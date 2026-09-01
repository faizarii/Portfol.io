import React, { useRef } from 'react';
import { portfolioConfig } from '../portfolio.config';
import { ProjectShowcase } from './ui/project-showcase';
import { useScroll, motion, useTransform } from 'framer-motion';

export const ProjectsSection: React.FC = () => {
  const { projects } = portfolioConfig;
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progress through the dedicated Projects scroll track (on desktop)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (!projects || !projects.items || projects.items.length === 0) {
    return null;
  }

  return (
    <section
      id="projects"
      ref={containerRef}
      data-no-cursor-lens="true"
      className="relative z-10 w-full border-t border-white/[0.08] lg:h-[185vh]"
    >
      {/* Viewport-Pinned Stage on Desktop (lg+), Fluid flow on Mobile/Tablet */}
      <div className="lg:sticky lg:top-0 min-h-screen lg:h-screen w-full flex flex-col justify-center py-14 sm:py-20 lg:py-0 px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto overflow-hidden">
        {/* Section Heading */}
        <div className="mb-5 sm:mb-8 text-center sm:text-left max-w-3xl mx-auto w-full">
          <h2 className="font-hero-display text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-[#FFE500] leading-[0.92] uppercase select-none">
            {projects.heading}
          </h2>
          {projects.subtitle && (
            <p
              className="text-sm sm:text-base text-white/90 mt-1.5 sm:mt-2.5 max-w-xl"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {projects.subtitle}
            </p>
          )}
        </div>

        {/* Interactive Project Showcase Component */}
        <div className="w-full max-w-3xl mx-auto">
          <ProjectShowcase
            projects={projects.items}
          />
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

export default ProjectsSection;
