import React, { useRef } from 'react';
import { portfolioConfig } from '../portfolio.config';
import { ProjectShowcase } from './ui/project-showcase';
import { useScroll, motion, useTransform } from 'framer-motion';

export const ProjectsSection: React.FC = () => {
  const { projects } = portfolioConfig;
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progress through the dedicated Projects scroll track
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
      className="relative z-10 w-full border-t border-white/[0.06]"
      style={{ height: '185vh' }}
    >
      {/* Viewport-Pinned Stage: Locks in center while scrolling through 185vh distance */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-20 max-w-7xl mx-auto overflow-hidden">
        {/* Section Heading */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left max-w-3xl mx-auto w-full">
          <h2 className="font-hero-display text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-[#EDE8DF] leading-[0.92] uppercase select-none">
            {projects.heading}
          </h2>
          {projects.subtitle && (
            <p
              className="text-sm sm:text-base text-[#A1A7B4] mt-2 sm:mt-2.5 max-w-xl"
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

export default ProjectsSection;
