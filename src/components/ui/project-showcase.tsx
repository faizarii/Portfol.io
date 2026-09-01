"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowUpRight,
  ExternalLink,
  X,
  Layers,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export interface Project {
  title: string;
  description: string;
  link: string;
  image: string;
  year?: string;
  category?: string;
  fullDescription?: string;
  techStack?: string[];
  highlights?: string[];
  gallery?: string[];
  githubUrl?: string;
}

export const defaultProjects: Project[] = [
  {
    title: "Lumina",
    description: "AI-powered design system generator.",
    link: "https://github.com/faizarii",
    githubUrl: "https://github.com/faizarii",
    category: "AI & Design Engineering",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    fullDescription:
      "Lumina transforms high-level product intent into complete, production-ready design systems. By combining multi-modal LLMs with strict design token schemas, Lumina generates accessible color palettes, modular typography scales, spacing grids, and Tailwind CSS configuration files in milliseconds.",
    techStack: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "OpenAI API",
      "Radix UI",
      "Zustand",
    ],
  },
  {
    title: "Flux",
    description: "Real-time collaboration for creative teams.",
    link: "https://github.com/faizarii",
    githubUrl: "https://github.com/faizarii",
    category: "Full-Stack Web & Real-Time",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
    fullDescription:
      "Flux is a low-latency collaborative workspace engineered for distributed product designers and engineers. Featuring an ultra-fast CRDT-backed sync engine, interactive canvas multi-cursor presence, real-time voice huddles, and version-controlled asset branching.",
    techStack: [
      "React",
      "Node.js",
      "WebSockets",
      "WebRTC",
      "Yjs CRDT",
      "PostgreSQL",
      "Docker",
    ],
  },
  {
    title: "Vortex",
    description: "High-performance data visualization engine.",
    link: "https://github.com/faizarii",
    githubUrl: "https://github.com/faizarii",
    category: "Data & Computer Vision",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    fullDescription:
      "Vortex visualizes multi-million record temporal datasets directly inside client browsers using custom WebGL shaders and GPU-accelerated computing pipelines. Delivers constant 60 FPS interactive querying, geospatial clustering, and automated statistical anomaly detection.",
    techStack: [
      "Three.js",
      "WebGL",
      "TypeScript",
      "D3.js",
      "WebAssembly",
      "Rust",
    ],
  },
  {
    title: "Echo",
    description: "Spatial audio experiences for the web.",
    link: "https://github.com/faizarii",
    githubUrl: "https://github.com/faizarii",
    category: "Audio & Machine Learning",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    fullDescription:
      "Echo brings true 3D spatial acoustics to browser environments through the Web Audio API and real-time head-related transfer function (HRTF) convolution algorithms. Used for virtual acoustic spaces, immersive gaming simulations, and interactive audio storytelling.",
    techStack: [
      "Web Audio API",
      "TypeScript",
      "PyTorch",
      "Tailwind CSS",
      "Canvas 2D",
    ],
  },
];

interface ProjectShowcaseProps {
  projects?: Project[];
  title?: string;
  subtitle?: string;
}

export function ProjectShowcase({
  projects = defaultProjects,
  title,
  subtitle,
}: ProjectShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Smooth lerping for the cursor follower image preview
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const updatePosition = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, targetPosition.x, 0.18),
        y: lerp(prev.y, targetPosition.y, 0.18),
      }));
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    animationFrameRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTargetPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setIsVisible(false);
  }, []);

  const handleOpenProject = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setIsVisible(false);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Lock background body scroll & handle Escape key when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  // Compute offset so the image doesn't block the cursor text
  const previewHeight = 195;
  const offsetX = 28;
  const offsetY = -previewHeight / 2;

  return (
    <>
      <section
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-no-cursor-lens="true"
        className="relative w-full max-w-3xl mx-auto px-0 py-0 select-none"
      >
        {/* Optional Section Header */}
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h2 className="text-[#FFE500] text-xs sm:text-sm font-mono tracking-widest uppercase">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-white/90 mt-1 font-normal">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Floating Peeking Image Preview on Cursor */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-50 overflow-hidden rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,20,50,0.9)] border border-white/20 backdrop-blur-md hidden md:block"
          style={{
            transform: `translate3d(${smoothPosition.x + offsetX}px, ${smoothPosition.y + offsetY
              }px, 0)`,
            opacity: isVisible && !selectedProject ? 1 : 0,
            scale: isVisible && !selectedProject ? 1 : 0.82,
            transition:
              "opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), scale 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform, opacity",
          }}
        >
          <div className="relative w-[300px] h-[195px] bg-[#002952] rounded-2xl overflow-hidden">
            {projects.map((project, index) => (
              <img
                key={project.title}
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
                style={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  transform: hoveredIndex === index ? "scale(1)" : "scale(1.1)",
                  filter: hoveredIndex === index ? "none" : "blur(12px)",
                }}
              />
            ))}
            {/* Ambient vignette & shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#002952]/90 via-transparent to-white/[0.08] pointer-events-none" />

            {/* Category pill overlay */}
            {hoveredIndex !== null && projects[hoveredIndex] && (
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="text-[11px] font-mono text-white/90 font-medium px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                  {projects[hoveredIndex].category || "Featured Work"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Project Items List */}
        <div className="space-y-0">
          {projects.map((project, index) => (
            <button
              key={project.title}
              type="button"
              onClick={(e) => handleOpenProject(e, project)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              data-no-cursor-lens="true"
              data-project-item="true"
              className="group w-full text-left block cursor-pointer transition-colors duration-200"
            >
              <div className="relative py-4 sm:py-5 border-t border-white/[0.08] transition-all duration-300 ease-out">
                {/* Background highlight on hover */}
                <div
                  className={`
                    absolute inset-0 -mx-4 px-4 bg-white/[0.05] border border-white/[0.08] rounded-xl
                    transition-all duration-300 ease-out pointer-events-none
                    ${hoveredIndex === index
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-[0.98]"
                    }
                  `}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 pr-4">
                    {/* Project Title with Animated Underline */}
                    <div className="inline-flex items-center gap-2 sm:gap-2.5">
                      <h3
                        className="text-[#FFE500] font-bold text-xl sm:text-2xl tracking-tight transition-colors group-hover:text-white"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <span className="relative">
                          {project.title}
                          {/* Animated underline */}
                          <span
                            className={`
                              absolute left-0 -bottom-1 w-full h-[1.5px] bg-[#FFE500] origin-left
                              transition-transform duration-300 ease-out
                              ${hoveredIndex === index ? "scale-x-100" : "scale-x-0"}
                            `}
                          />
                        </span>
                      </h3>

                      {/* Arrow that slides in on hover */}
                      <ArrowUpRight
                        className={`
                          w-4 h-4 sm:w-5 sm:h-5 text-[#FFE500]
                          transition-all duration-300 ease-out
                          ${hoveredIndex === index
                            ? "opacity-100 translate-x-0 translate-y-0"
                            : "opacity-0 -translate-x-2 translate-y-2"
                          }
                        `}
                      />
                    </div>

                    {/* Tagline / Description */}
                    <p
                      className="text-sm sm:text-[14.5px] mt-1.5 leading-relaxed text-white/90 group-hover:text-white transition-colors duration-300 ease-out"
                    >
                      {project.description}
                    </p>

                    {/* Tech Badges preview on item */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.techStack.slice(0, 3).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11.5px] font-mono text-white bg-white/[0.1] border border-white/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono text-white/80">
                            +{project.techStack.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right metadata: Category */}
                  {project.category && (
                    <div className="shrink-0 pt-1">
                      <span className="text-[11.5px] font-mono uppercase tracking-wider text-white px-2.5 py-1 rounded-full bg-white/[0.1] border border-white/20">
                        {project.category.split("&")[0].trim()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}

          {/* Bottom border for last item */}
          <div className="border-t border-white/[0.08]" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DETAILED PROJECT MODAL / CARD                                             */}
      {/* ========================================================================= */}
      {selectedProject && (
        <div
          data-no-cursor-lens="true"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 overscroll-contain"
        >
          {/* Backdrop Blur Layer */}
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-[#001D3D]/80 backdrop-blur-xl transition-opacity animate-fadeIn"
            aria-hidden="true"
          />

          {/* Project Detail Card - Enabled for smooth mouse wheel and touch scrolling */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
            data-no-cursor-lens="true"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[88dvh] overflow-y-auto overscroll-contain bg-[#002E5C] border border-white/20 rounded-2xl sm:rounded-3xl shadow-[0_30px_90px_rgba(0,20,50,0.95)] z-10 text-white flex flex-col focus:outline-none"
          >
            {/* Top Close Button */}
            <button
              onClick={handleCloseModal}
              aria-label="Close project modal"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-[#FFE500] text-white hover:text-[#002952] border border-white/15 transition-all duration-200 shadow-lg cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Modal Big Hero Image on Top */}
            <div className="relative w-full h-44 sm:h-60 md:h-72 bg-black/40 overflow-hidden shrink-0 border-b border-white/[0.1]">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002E5C] via-transparent to-black/40 pointer-events-none" />

              {/* Category Badge on Photo */}
              {selectedProject.category && (
                <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-6 flex items-center pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-mono font-medium text-white/90">
                    <Sparkles className="w-3 h-3 text-[#FFE500]" />
                    {selectedProject.category}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Body Content */}
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 flex-1">
              {/* Title & Quick Actions Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-white/[0.1]">
                <div>
                  <h3
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FFE500] tracking-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {selectedProject.title}
                  </h3>
                  <p className="text-white/90 text-[13px] sm:text-sm md:text-base mt-1">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] border border-white/20 text-xs font-semibold tracking-wide text-white transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                  )}
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#FFE500] hover:bg-[#FFF04D] text-[#002952] text-xs font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <span>Try it out!</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* In-depth Project Narrative / Description */}
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#FFE500] mb-2.5 flex items-center gap-2 font-medium">
                  <Layers className="w-3.5 h-3.5 text-[#FFE500]" />
                  <span>Overview & Architecture</span>
                </div>
                <p
                  className="text-sm sm:text-[14.5px] text-white leading-[1.85]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {selectedProject.fullDescription || selectedProject.description}
                </p>
              </div>

              {/* Tech Stack Badges */}
              {selectedProject.techStack &&
                selectedProject.techStack.length > 0 && (
                  <div className="pt-4 border-t border-white/[0.12]">
                    <div className="text-xs font-mono uppercase tracking-widest text-[#FFE500] mb-3 font-medium">
                      Technologies & Tools
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-white bg-white/[0.1] border border-white/20 hover:border-white/40 transition-colors"
                        >
                          <ChevronRight className="w-3 h-3 text-[#FFE500]" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectShowcase;
