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
    setActiveCard(index);
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
    <div className="w-full">
      {/* ========================================================================= */}
      {/* 1. MOBILE VIEW (< md): Clean, Natural Vertical Flow (Zero cutoffs, fluid)  */}
      {/* ========================================================================= */}
      <div className="block md:hidden w-full py-10 px-4 sm:px-6">
        {/* Mobile Section Header */}
        {(heading || subtitle) && (
          <div className="mb-8">
            {heading && (
              <h2 className="font-hero-display text-3xl sm:text-4xl font-bold tracking-tight text-[#FFE500] leading-[0.92] uppercase mb-2 select-none">
                {heading}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-[13.5px] sm:text-sm text-white/95 leading-relaxed"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Mobile Vertical Timeline Flow */}
        <div className="relative pl-6 sm:pl-8 space-y-8">
          {/* Vertical Connecting Spine */}
          <div className="absolute left-[11px] sm:left-[15px] top-3 bottom-6 w-[2px] bg-gradient-to-b from-[#FFE500] via-white/20 to-white/5 pointer-events-none" />

          {/* Sequential Experience Items */}
          {data.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Milestone Indicator Node */}
              <div className="absolute -left-[23px] sm:-left-[27px] top-1.5 h-6 w-6 rounded-full bg-[#002952] border-2 border-[#FFE500] shadow-[0_0_12px_rgba(255,229,0,0.6)] flex items-center justify-center z-10">
                <div className="h-2 w-2 rounded-full bg-[#FFE500]" />
              </div>

              {/* Milestone Date / Label Badge */}
              <div className="mb-3">
                <span className="inline-block font-hero-display text-sm sm:text-base text-[#FFE500] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-[#002952]/90 border border-[#FFE500]/30 shadow-sm">
                  {item.title}
                </span>
              </div>

              {/* Experience Card Content (Natural height, full visibility) */}
              <div className="w-full">
                {item.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEW (md+): Pinned Sticky Stage with In-Place Crossfade         */}
      {/* ========================================================================= */}
      <div
        ref={containerRef}
        className="hidden md:block relative w-full"
        style={{ height: `${Math.max(160, data.length * 60)}vh` }}
      >
        {/* Viewport-Pinned Stage */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-8 md:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden">
          {/* Section Header */}
          {(heading || subtitle) && (
            <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
              <div>
                {heading && (
                  <h2 className="font-hero-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFE500] leading-[0.92] uppercase mb-2 select-none">
                    {heading}
                  </h2>
                )}
                {subtitle && (
                  <p
                    className="text-[14.5px] md:text-[15.5px] text-white/95 max-w-xl leading-relaxed"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Step Counter Indicator */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[12px] font-mono text-white/85 tracking-widest uppercase font-medium">
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
                          ? "w-6 bg-[#FFE500]"
                          : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Pinned Stage: Left Timeline Spine + Right In-Place Card */}
          <div className="flex flex-row items-center gap-8 md:gap-10 lg:gap-14 w-full">
            {/* Left Timeline Spine */}
            <div className="relative flex flex-col justify-start gap-4 md:gap-10 shrink-0 py-2">
              {/* Vertical Connector Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-white/15 -z-0">
                {/* Illuminating Active Scroll Beam */}
                <motion.div
                  className="w-full bg-gradient-to-b from-[#FFE500] to-[#FFD166] shadow-[0_0_10px_rgba(255,229,0,0.8)]"
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
                    className="group flex items-center gap-3 md:gap-4 text-left transition-all duration-300 focus:outline-none cursor-pointer relative z-10"
                  >
                    {/* Indicator Dot */}
                    <div
                      className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isActive
                          ? "bg-[#002952] border-2 border-[#FFE500] shadow-[0_0_15px_rgba(255,229,0,0.5)] scale-110"
                          : isPast
                          ? "bg-[#002952] border border-[#FFE500]/60"
                          : "bg-[#002952] border border-white/20 hover:border-white/40"
                      }`}
                    >
                      <div
                        className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-[#FFE500] shadow-[0_0_8px_rgba(255,229,0,0.9)]"
                            : isPast
                            ? "bg-[#FFE500]/60"
                            : "bg-white/20 group-hover:bg-white/40"
                        }`}
                      />
                    </div>

                    {/* Milestone Year Label */}
                    <div className="block whitespace-nowrap">
                      <span
                        className={`block font-hero-display text-base md:text-xl lg:text-2xl transition-all duration-300 ${
                          isActive
                            ? "text-[#FFE500] font-bold"
                            : isPast
                            ? "text-white/80"
                            : "text-white/45 group-hover:text-white"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right In-Place Card Stage */}
            <div className="flex-1 w-full min-h-[360px] md:min-h-[420px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCard}
                  initial={{ opacity: 0, y: 22, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -22, scale: 0.98 }}
                  transition={{
                    duration: 0.38,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full"
                >
                  {data[activeCard].content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
