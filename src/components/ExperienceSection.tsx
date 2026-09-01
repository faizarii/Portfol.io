import React from 'react';
import { portfolioConfig } from '../portfolio.config';
import { Timeline, type TimelineEntry } from './ui/timeline';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { experiences } = portfolioConfig;

  if (!experiences || !experiences.items || experiences.items.length === 0) {
    return null;
  }

  // Format experience items into Timeline entries
  const timelineData: TimelineEntry[] = experiences.items.map((item) => ({
    title: item.timelineLabel,
    content: (
      <div className="w-full">
        {/* Unified Pinned Experience Card in Deep Blue Glassmorphic Palette */}
        <div className="bg-[#00386C]/90 backdrop-blur-2xl border border-white/[0.16] hover:border-white/[0.3] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 transition-all duration-300 shadow-[0_30px_70px_-20px_rgba(0,20,50,0.8)]">
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
              <div className="w-full lg:w-[36%] xl:w-[38%] shrink-0 grid grid-cols-2 lg:flex lg:flex-col gap-2.5 sm:gap-3 justify-center mt-3 lg:mt-0">
                {item.images.slice(0, 2).map((img, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="relative h-24 sm:h-32 md:h-36 lg:h-[130px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-[#002952] border border-white/[0.15] group"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-105 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002952]/70 via-transparent to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
  }));

  return (
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
  );
};

export default ExperienceSection;
