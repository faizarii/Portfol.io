import React, { useEffect, useRef, useState } from 'react';
import { portfolioConfig } from '../portfolio.config';

interface MorphTarget {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export const CursorLens: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const [isHoveredInteractive, setIsHoveredInteractive] = useState(false);
  const [isLensDisabled, setIsLensDisabled] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [morphTarget, setMorphTarget] = useState<MorphTarget | null>(null);

  const morphRef = useRef<MorphTarget | null>(null);

  const posRef = useRef({
    mouseX: -100,
    mouseY: -100,
    lensX: -100,
    lensY: -100,
    hasMoved: false,
  });

  const size = portfolioConfig.lens.size || 56;

  useEffect(() => {
    if (!portfolioConfig.lens.enabled) return;

    // Disable custom cursor on touch/pointer-coarse devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let animationFrameId: number;

    // IntersectionObserver to cleanly detect when visitor leaves/enters the Hero section
    const heroEl = document.getElementById('hero');
    let observer: IntersectionObserver | null = null;

    if (heroEl) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsInHero(entry.isIntersecting);
        },
        {
          rootMargin: '-80px 0px 0px 0px',
          threshold: 0.05,
        }
      );
      observer.observe(heroEl);
    }

    const updateDotPosition = (x: number, y: number) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.mouseX = e.clientX;
      posRef.current.mouseY = e.clientY;

      if (!posRef.current.hasMoved) {
        posRef.current.hasMoved = true;
        posRef.current.lensX = e.clientX;
        posRef.current.lensY = e.clientY;
        setIsVisible(true);
      }

      updateDotPosition(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setMorphTarget(null);
      morphRef.current = null;
    };

    const handleMouseEnter = () => {
      if (posRef.current.hasMoved) setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsClicked(true);
      updateDotPosition(posRef.current.mouseX, posRef.current.mouseY);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
      updateDotPosition(posRef.current.mouseX, posRef.current.mouseY);
    };

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isExplicitNoLens = Boolean(
        target.closest(
          '[data-no-cursor-lens], [data-no-lens], .no-cursor-lens, [data-project-item], .project-showcase-container, .project-peek-preview, .project-card-dialog'
        )
      );
      setIsLensDisabled(isExplicitNoLens);

      // Check for Navbar morphable targets (e.g. navigation links, CTA button)
      const morphEl = target.closest(
        'header a, header button, .nav-link, [data-cursor-morph], [data-cursor-snap]'
      ) as HTMLElement | null;

      if (morphEl) {
        const rect = morphEl.getBoundingClientRect();
        const padX = 18;
        const padY = 8;
        const targetData: MorphTarget = {
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          width: rect.width + padX,
          height: rect.height + padY,
        };
        setMorphTarget(targetData);
        morphRef.current = targetData;
      } else {
        setMorphTarget(null);
        morphRef.current = null;
      }

      const isInteractive = Boolean(
        target.closest(
          'a, button, input, [role="button"], .avatar-glass-card, .nav-link, .hero-title-line, p, h1, [data-interactive]'
        )
      );
      setIsHoveredInteractive(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleElementHover, { passive: true });

    // Smooth Lerp loop for the filled inversion lens with magnetic suction
    const animate = () => {
      const pos = posRef.current;
      const morph = morphRef.current;

      if (morph) {
        // Magnetic suction: anchored to the button center with subtle cursor gravity
        const targetX = morph.centerX + (pos.mouseX - morph.centerX) * 0.28;
        const targetY = morph.centerY + (pos.mouseY - morph.centerY) * 0.28;
        pos.lensX += (targetX - pos.lensX) * 0.24;
        pos.lensY += (targetY - pos.lensY) * 0.24;
      } else {
        // Normal fluid cursor follower
        pos.lensX += (pos.mouseX - pos.lensX) * 0.22;
        pos.lensY += (pos.mouseY - pos.lensY) * 0.22;
      }

      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${pos.lensX}px, ${pos.lensY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleElementHover);
      if (observer) observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!portfolioConfig.lens.enabled) return null;

  const isLensActive = isVisible && isInHero && !isLensDisabled;
  const isMorphed = Boolean(morphTarget && isLensActive);

  // Fluid width and height calculation (pure capsule morphing with zero radius snapping)
  const lensWidth = isMorphed
    ? morphTarget!.width
    : isHoveredInteractive
    ? size * 1.35
    : isClicked
    ? size * 0.85
    : size;

  const lensHeight = isMorphed
    ? morphTarget!.height
    : isHoveredInteractive
    ? size * 1.35
    : isClicked
    ? size * 0.85
    : size;

  return (
    <>
      {/* 1. Large Fluid Inversion Circle / Morphing Pill Lens (Active solely in the Hero section) */}
      <div
        ref={lensRef}
        style={{
          width: lensWidth,
          height: lensHeight,
          opacity: isLensActive ? 1 : 0,
        }}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full bg-white transition-[width,height,opacity] duration-300 cubic-bezier(0.16,1,0.3,1) mix-blend-difference"
        aria-hidden="true"
      />

      {/* 2. Precision Cursor Pointer Dot (No CSS class transform collisions) */}
      <div
        ref={dotRef}
        style={{
          opacity: isVisible && !isMorphed ? 1 : 0,
        }}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-[width,height,opacity,background-color,box-shadow,border-color] duration-150 ease-out ${
          !isLensActive
            ? `bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] border border-black/20 ring-2 ring-white/30 ${
                isClicked
                  ? 'w-2 h-2'
                  : isHoveredInteractive
                  ? 'w-3.5 h-3.5 ring-white/50 shadow-[0_0_16px_rgba(255,255,255,1)]'
                  : 'w-2.5 h-2.5'
              }`
            : isClicked
            ? 'w-1 h-1 bg-[#00509D]'
            : 'w-1.5 h-1.5 bg-[#00509D]'
        }`}
        aria-hidden="true"
      />
    </>
  );
};

export default CursorLens;
