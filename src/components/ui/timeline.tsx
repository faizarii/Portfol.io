"use client";

import React, { useRef, useState } from "react";
import {
  useScroll,
  useMotionValueEvent,
  motion,
  AnimatePresence,
} from "framer-motion";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  heading?: string;
  subtitle?: string;
}

/**
 * Pinned Sticky Timeline Deck:
 * The card and images stay rock-solid in place in the center of the viewport
 * while the user scrolls. As scroll progress passes each milestone threshold,
 * the card seamlessly cross-fades in-place to the next experience.
 */
export const Timeline: React.FC<TimelineProps> = ({
  data,
  heading,
  subtitle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll progress across the dedicated timeline height track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
    if (!data.length) return;
    
    // Divide 0..1 into equal segments for each timeline item
    const segment = 1 / data.length;
    const rawIndex = Math.floor(latest / segment);
    const index = Math.min(data.length - 1, Math.max(0, rawIndex));
    
    if (index !== activeCard) {
      setActiveCard(index);
    }
  });

  // Jump directly to milestone when clicking left navigation nodes
  const jumpToMilestone = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const totalScrollableHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetOffset = (index / (data.length - 1 || 1)) * totalScrollableHeight;
    
    window.scrollTo({
      top: scrollTop + rect.top + targetOffset + 5,
      behavior: "smooth",
    });
  };

  if (!data || data.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${Math.max(220, data.length * 85)}vh` }}
    >
      {/* Viewport-Pinned Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden">
        {/* Section Header */}
        {(heading || subtitle) && (
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {heading && (
                <h2 className="font-hero-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#EDE8DF] leading-[0.92] uppercase mb-2 select-none">
                  {heading}
                </h2>
              )}
              {subtitle && (
                <p
                  className="text-[14px] sm:text-[15px] text-[#A1A7B4] max-w-xl leading-relaxed"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Step Counter Indicator */}
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-mono text-[#A1A7B4] tracking-widest uppercase">
                {String(activeCard + 1).padStart(2, "0")} / {String(data.length).padStart(2, "0")}
              </span>
              <div className="flex gap-1.5">
                {data.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => jumpToMilestone(idx)}
                    aria-label={`Jump to step ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeCard
                        ? "w-6 bg-[#EDE8DF]"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Pinned Stage: Left Timeline Spine + Right In-Place Card */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-10 lg:gap-14 w-full">
          {/* Left Timeline Spine */}
          <div className="relative flex md:flex-col justify-between md:justify-start gap-4 sm:gap-8 md:gap-10 w-full md:w-auto shrink-0 py-2">
            {/* Vertical Connector Line (Desktop) */}
            <div className="hidden md:block absolute left-[19px] top-4 bottom-4 w-[2px] bg-white/10 -z-0">
              {/* Illuminating Active Scroll Beam */}
              <motion.div
                className="w-full bg-gradient-to-b from-[#EDE8DF] to-white/90 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{
                  height: `${Math.min(100, scrollProgress * 100)}%`,
                }}
              />
            </div>

            {/* Milestones Navigation Items */}
            {data.map((item, idx) => {
              const isActive = idx === activeCard;
              const isPast = idx < activeCard;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => jumpToMilestone(idx)}
                  className="group flex items-center gap-4 text-left transition-all duration-300 focus:outline-none cursor-pointer relative z-10"
                >
                  {/* Indicator Dot */}
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-[#090B0E] border-2 border-[#EDE8DF] shadow-[0_0_15px_rgba(237,232,223,0.5)] scale-110"
                        : isPast
                        ? "bg-[#090B0E] border border-[#EDE8DF]/60"
                        : "bg-[#090B0E] border border-white/20 hover:border-white/40"
                    }`}
                  >
                    <div
                      className={`h-3 w-3 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-[#EDE8DF] shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                          : isPast
                          ? "bg-[#EDE8DF]/60"
                          : "bg-white/20 group-hover:bg-white/40"
                      }`}
                    />
                  </div>

                  {/* Milestone Year Label */}
                  <div className="hidden md:block">
                    <span
                      className={`block font-hero-display text-xl sm:text-2xl transition-all duration-300 ${
                        isActive
                          ? "text-[#EDE8DF] scale-105"
                          : isPast
                          ? "text-[#A1A7B4]/70"
                          : "text-white/30 group-hover:text-white/60"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right In-Place Card Stage (Does not move, seamlessly crossfades in place) */}
          <div className="flex-1 w-full min-h-[380px] sm:min-h-[420px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard}
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {data[activeCard].content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
