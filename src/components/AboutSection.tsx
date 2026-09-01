import React, { useRef } from 'react';
import { portfolioConfig } from '../portfolio.config';
import { DragGallery } from './ui/DragGallery';
import { useScroll, motion, useTransform } from 'framer-motion';

export const AboutSection: React.FC = () => {
  const { about } = portfolioConfig;
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progress through the dedicated About scroll track (on desktop)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-10 w-full border-t border-white/[0.08] lg:h-[185vh]"
    >
      {/* Viewport-Pinned Stage on Desktop (lg+), Fluid and readable on Mobile/Tablet */}
      <div className="lg:sticky lg:top-0 min-h-screen lg:h-screen w-full flex flex-col justify-center py-14 sm:py-20 lg:py-0 px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto overflow-hidden">
        {/* Two-column layout: text bio on left, floating image showcase on right */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 sm:gap-12 lg:gap-14 xl:gap-18 my-auto w-full">
          {/* Left column: Editorial Bio */}
          <div className="w-full lg:w-[48%] xl:w-[45%] shrink-0 flex flex-col justify-between">
            <div>
              {/* Heading */}
              <h2 className="font-hero-display text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-[#FFE500] leading-[0.92] uppercase mb-4 sm:mb-6 select-none">
                {about.heading}
              </h2>

              {/* Bio paragraphs in high-contrast crisp white */}
              <div className="space-y-3 sm:space-y-4">
                {about.paragraphs.map((text, idx) => (
                  <p
                    key={idx}
                    className="text-[14px] sm:text-[15px] md:text-[15.5px] leading-[1.75] sm:leading-[1.8] text-white"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            {/* Focus areas / tags */}
            {about.focusAreas && about.focusAreas.length > 0 && (
              <div className="mt-5 sm:mt-8 pt-4 sm:pt-5 border-t border-white/[0.12]">
                <div className="text-[11px] sm:text-[11.5px] font-mono tracking-widest text-[#FFE500] uppercase mb-2.5 sm:mb-3">
                  Core Technologies & Focus
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {about.focusAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-lg text-[11.5px] sm:text-[12.5px] font-medium tracking-wide text-white bg-white/[0.1] border border-white/20 transition-all duration-200 hover:bg-white/[0.2] hover:border-white/40"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Pure Floating Image Showcase */}
          <div className="w-full lg:flex-1 min-w-0 flex items-center mt-4 sm:mt-6 lg:mt-0">
            <DragGallery
              items={about.gallery}
              className="w-full"
            />
          </div>
        </div>

        {/* Subtle Bottom Ambient Scroll Indicator (Desktop only) */}
        <div className="hidden lg:flex absolute bottom-6 left-6 right-6 sm:left-10 sm:right-10 md:left-16 md:right-16 lg:left-20 lg:right-20 items-center justify-between pointer-events-none opacity-40">
          <div className="h-[1px] flex-1 bg-white/15 relative overflow-hidden rounded-full max-w-[120px]">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#FFD166]"
              style={{ width: progressWidth }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
