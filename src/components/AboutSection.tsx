import React, { useRef } from 'react';
import { portfolioConfig } from '../portfolio.config';
import { DragGallery } from './ui/DragGallery';
import { useScroll, motion, useTransform } from 'framer-motion';

export const AboutSection: React.FC = () => {
  const { about } = portfolioConfig;
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progress through the dedicated About scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-10 w-full border-t border-white/[0.06]"
      style={{ height: '185vh' }}
    >
      {/* Viewport-Pinned Stage: Locks in center while scrolling through 185vh distance */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-20 max-w-7xl mx-auto overflow-hidden">
        {/* Two-column layout: text bio on left, floating image showcase on right */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-10 lg:gap-14 xl:gap-18">
          {/* Left column: Editorial Bio */}
          <div className="w-full lg:w-[48%] xl:w-[45%] shrink-0 flex flex-col justify-between">
            <div>
              {/* Heading */}
              <h2 className="font-hero-display text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-[#EDE8DF] leading-[0.92] uppercase mb-5 sm:mb-6 select-none">
                {about.heading}
              </h2>

              {/* Bio paragraphs */}
              <div className="space-y-3.5 sm:space-y-4">
                {about.paragraphs.map((text, idx) => (
                  <p
                    key={idx}
                    className="text-[14px] sm:text-[15px] leading-[1.75] text-[#A1A7B4]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            {/* Focus areas / tags */}
            {about.focusAreas && about.focusAreas.length > 0 && (
              <div className="mt-6 sm:mt-8 pt-5 border-t border-white/[0.06]">
                <div className="text-[11px] font-mono tracking-widest text-[#A1A7B4]/70 uppercase mb-3">
                  Core Technologies & Focus
                </div>
                <div className="flex flex-wrap gap-2">
                  {about.focusAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-[12px] sm:text-[12.5px] font-medium tracking-wide text-white/85 bg-white/[0.04] border border-white/[0.08] transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.18] hover:text-white"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Pure Floating Image Showcase */}
          <div className="w-full lg:flex-1 min-w-0 flex items-center">
            <DragGallery
              items={about.gallery}
              className="w-full"
            />
          </div>
        </div>

        {/* Subtle Bottom Ambient Scroll Indicator */}
        <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-10 md:left-16 md:right-16 lg:left-20 lg:right-20 flex items-center justify-between pointer-events-none opacity-40">
          <div className="h-[1px] flex-1 bg-white/10 relative overflow-hidden rounded-full max-w-[120px]">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#EDE8DF]"
              style={{ width: progressWidth }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

