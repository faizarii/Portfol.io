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
      className="relative z-10 w-full border-t border-white/[0.08] px-4 py-14 sm:px-8 sm:py-20 md:px-16 lg:px-20"
    >
      <div className="w-full max-w-3xl mx-auto">
        <div
          className="sticky top-0 z-10 -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-20 px-4 sm:px-8 md:px-16 lg:px-20 py-5"
          style={{
            background: 'linear-gradient(180deg, #00509D 0%, #00468A 60%, #00386C 100%)',
            backgroundAttachment: 'fixed',
            backgroundSize: '100vw 100vh',
          }}
        >
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

        <ProjectShowcase projects={projects.items} />

        <div className="hidden lg:flex mt-8 items-center pointer-events-none opacity-40">
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
