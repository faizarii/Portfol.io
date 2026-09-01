export interface GalleryItem {
  id: number;
  image: string;
  title?: string;
}

interface DragGalleryProps {
  items: GalleryItem[];
  className?: string;
}

/**
 * Pure floating autoloop showcase that glides continuously and effortlessly.
 * Automatically loops infinitely without requiring user clicks or drags.
 * Smoothly pauses on hover for detailed viewing.
 */
export function DragGallery({ items, className = "" }: DragGalleryProps) {
  // Duplicate items 3 times for a seamless, continuous infinite loop
  const loopItems = [...items, ...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden select-none group/gallery ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      {/* Continuous Infinite Autoloop Ribbon */}
      <div className="flex w-max gap-4 sm:gap-6 py-2 items-stretch animate-infinite-scroll group-hover/gallery:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
        {loopItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="relative shrink-0 w-[240px] sm:w-[270px] md:w-[300px] h-[340px] sm:h-[380px] md:h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-[#002F5E]/60 group/card border border-white/[0.1] hover:border-white/[0.25] transition-all duration-300 transform-gpu"
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
