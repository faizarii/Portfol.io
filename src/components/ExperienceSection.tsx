import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { portfolioConfig } from '../portfolio.config';
import { Timeline, type TimelineEntry } from './ui/timeline';
import { ExternalLink, CheckCircle2, X, ZoomIn } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { experiences } = portfolioConfig;
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  // Preload all experience images for instantaneous rendering
  useEffect(() => {
    if (experiences?.items) {
      experiences.items.forEach((item) => {
        item.images?.forEach((img) => {
          const imageObj = new Image();
          imageObj.src = img.src;
        });
      });
    }
  }, [experiences]);

  // Lock background body scroll & handle Escape key when lightbox is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  if (!experiences || !experiences.items || experiences.items.length === 0) {
    return null;
  }

  // Format experience items into Timeline entries
  const timelineData: TimelineEntry[] = experiences.items.map((item) => ({
    title: item.timelineLabel,
    content: (
      <div className="w-full">
        {/* Unified Experience Card in Deep Blue Glassmorphic Palette */}
        <div className="bg-[#00386C]/90 backdrop-blur-2xl border border-white/[0.16] hover:border-white/[0.3] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 transition-colors duration-300 shadow-[0_30px_70px_-20px_rgba(0,20,50,0.8)]">
          {/* Header: Role & Organization */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-4 sm:pb-5 border-b border-white/[0.12]">
            <div>
              <h4
                className="text-base sm:text-xl md:text-2xl font-bold text-[#FFE500] tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {item.role}
              </h4>
              <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                {item.organizationUrl ? (
                  <a
                    href={item.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] sm:text-[14.5px] font-medium text-white hover:text-[#FFE500] transition-colors group"
                  >
                    <span>{item.organization}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <span className="text-[13px] sm:text-[14.5px] font-medium text-white">
                    {item.organization}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Card Body: Text Content + Integrated Image Showcase */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6 items-stretch">
            {/* Left Content Column */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p
                  className="text-[13.5px] sm:text-[14.5px] md:text-[15.5px] leading-[1.75] sm:leading-[1.8] text-white"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {item.description}
                </p>

                {/* Key Highlights */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                    {item.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 sm:gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE500] shrink-0 mt-1" />
                        <span
                          className="text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-[1.6] sm:leading-[1.65] text-white"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills Badges */}
              {item.skills && item.skills.length > 0 && (
                <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/[0.1] flex flex-wrap gap-1.5">
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-[12px] md:text-[12.5px] font-medium tracking-wide text-white bg-white/[0.1] border border-white/20 hover:bg-white/[0.2] hover:border-white/40 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right Visual Showcase */}
            {item.images && item.images.length > 0 && (
              <div
                className={`w-full lg:w-[36%] xl:w-[38%] shrink-0 grid ${
                  item.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                } lg:flex lg:flex-col gap-2.5 sm:gap-3 justify-center mt-3 lg:mt-0`}
              >
                {item.images.slice(0, 2).map((img, imgIdx) => (
                  <button
                    key={imgIdx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    aria-label={`View full image: ${img.alt}`}
                    className="relative h-28 sm:h-36 md:h-36 lg:h-[130px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-[#002952] border border-white/[0.15] hover:border-[#FFE500]/60 transition-all duration-300 group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#FFE500]"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002952]/70 via-transparent to-transparent pointer-events-none" />

                    {/* Subtle Zoom Badge on Hover */}
                    <div className="absolute bottom-2 right-2 p-1 rounded-lg bg-black/60 backdrop-blur-md text-white/80 group-hover:text-[#FFE500] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <>
      <section
        id="experience"
        className="relative z-10 w-full border-t border-white/[0.08]"
      >
        <Timeline
          data={timelineData}
          heading={experiences.heading}
          subtitle={experiences.subtitle}
        />
      </section>

      {/* ========================================================================= */}
      {/* FULL RESOLUTION IMAGE LIGHTBOX MODAL                                      */}
      {/* ========================================================================= */}
      {selectedImage && typeof document !== 'undefined' && createPortal(
        <div
          data-no-cursor-lens="true"
          data-lenis-prevent="true"
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8 bg-[#001833]/85 backdrop-blur-2xl animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-[#002E5C] border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,10,30,0.95)] flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close image preview"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-[#FFE500] text-white hover:text-[#002952] border border-white/15 transition-all duration-200 shadow-lg cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Lightbox Image */}
            <div className="relative max-h-[78vh] overflow-hidden flex items-center justify-center bg-black/40">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-full max-h-[78vh] object-contain"
              />
            </div>

            {/* Caption / Alt Label */}
            {selectedImage.alt && (
              <div className="px-5 py-3.5 bg-[#00254A] border-t border-white/[0.1] flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-white/90">
                  {selectedImage.alt}
                </span>
                <span className="text-[11px] font-mono text-[#FFE500] tracking-wider uppercase">
                  Documentation Preview
                </span>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ExperienceSection;
