import React, { useRef, useEffect, useState } from "react";

export interface GalleryItem {
  id: number;
  image: string;
  title?: string;
}

interface DragGalleryProps {
  items: GalleryItem[];
  className?: string;
  autoSpeed?: number; // Base speed in px/frame (normalized to 60fps)
}

/**
 * Interactive Infinite Drag & Auto-Slide Gallery:
 * - Continuously glides forward automatically.
 * - Allows users to click and hold / drag to scrub through images at any speed.
 * - Flick / swipe has natural inertia with smooth momentum.
 * - On release, momentum decays seamlessly and forward auto-slide resumes.
 * - Seamless infinite wrapping in both directions with zero jumps.
 */
export function DragGallery({
  items,
  className = "",
  autoSpeed = 0.75,
}: DragGalleryProps) {
  // Quadruple items to provide a robust seamless infinite buffer in both directions
  const loopItems = [...items, ...items, ...items, ...items];

  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const xRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const lastPointerXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const singleWidthRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Calculate single set width (1/4 of total track width)
    const updateDimensions = () => {
      if (track) {
        const fullWidth = track.scrollWidth;
        singleWidthRef.current = fullWidth / 4;
        if (xRef.current === 0 && singleWidthRef.current > 0) {
          xRef.current = -singleWidthRef.current;
        }
      }
    };

    updateDimensions();
    // Re-check after images load
    const timer = setTimeout(updateDimensions, 200);
    window.addEventListener("resize", updateDimensions);

    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const loop = (currentTimestamp: number) => {
      const delta = Math.min(32, currentTimestamp - lastTimestamp);
      lastTimestamp = currentTimestamp;
      const timeScale = delta / (1000 / 60); // normalize for 60Hz, 120Hz, 144Hz displays

      const singleWidth = singleWidthRef.current;

      if (singleWidth > 0 && track) {
        if (isPointerDownRef.current) {
          // Actively being dragged: velocity is computed on pointer move
          velocityRef.current *= 0.85;
        } else {
          // Post-release momentum decay
          if (Math.abs(velocityRef.current) > 0.08) {
            xRef.current += velocityRef.current * timeScale;
            velocityRef.current *= Math.pow(0.92, timeScale);
          } else {
            // Smoothly resume base auto-slide (glides left)
            velocityRef.current = 0;
            const currentSpeed = isHoveredRef.current ? autoSpeed * 0.45 : autoSpeed;
            xRef.current -= currentSpeed * timeScale;
          }
        }

        // Invisible wrap within [-2 * singleWidth, -singleWidth]
        while (xRef.current > -singleWidth) {
          xRef.current -= singleWidth;
        }
        while (xRef.current < -2 * singleWidth) {
          xRef.current += singleWidth;
        }

        track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [autoSpeed]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary button
    isPointerDownRef.current = true;
    setIsDragging(true);
    lastPointerXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const deltaX = e.clientX - lastPointerXRef.current;

    xRef.current += deltaX;

    // Calculate instantaneous velocity in px per 60fps frame
    const instantVelocity = (deltaX / dt) * (1000 / 60);
    velocityRef.current = velocityRef.current * 0.35 + instantVelocity * 0.65;

    lastPointerXRef.current = e.clientX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onDragStart={(e) => e.preventDefault()}
      className={`relative w-full overflow-hidden select-none touch-pan-y ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      {/* Continuous Interactive Ribbon */}
      <div
        ref={trackRef}
        className="flex w-max gap-4 sm:gap-6 py-2 items-stretch will-change-transform"
        style={{
          transform: "translate3d(0, 0, 0)",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {loopItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="relative shrink-0 w-[240px] sm:w-[270px] md:w-[300px] h-[340px] sm:h-[380px] md:h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-[#002F5E]/60 group/card border border-white/[0.1] hover:border-white/[0.25] transition-colors duration-300 transform-gpu pointer-events-none"
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Pure image */}
            <img
              src={item.image}
              alt=""
              draggable={false}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 group-hover/card:brightness-105 pointer-events-none transform-gpu"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />

            {/* Subtle gloss sheen on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Soft edge gradient fades for seamless blend into #00509D background */}
      <div className="absolute inset-y-0 left-0 w-10 sm:w-16 bg-gradient-to-r from-[#00509D] to-transparent pointer-events-none z-10 opacity-90" />
      <div className="absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-[#00509D] to-transparent pointer-events-none z-10 opacity-90" />
    </div>
  );
}

export default DragGallery;
