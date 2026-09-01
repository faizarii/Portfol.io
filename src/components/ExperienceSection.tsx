import React from 'react';
import { portfolioConfig } from '../portfolio.config';
import { Timeline, type TimelineEntry } from './ui/timeline';
import { MapPin, ExternalLink, CheckCircle2 } from 'lucide-react';

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
        {/* Unified Pinned Experience Card */}
        <div className="bg-[#0F1218]/95 backdrop-blur-2xl border border-white/[0.1] hover:border-white/[0.2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.95)]">
          {/* Header: Role & Organization */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
            <div>
              <h4
                className="text-lg sm:text-xl md:text-2xl font-bold text-[#EDE8DF] tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {item.role}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                {item.organizationUrl ? (
                  <a
                    href={item.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14.5px] font-medium text-white/90 hover:text-white transition-colors group"
                  >
                    <span>{item.organization}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <span className="text-[13.5px] sm:text-[14.5px] font-medium text-white/90">
                    {item.organization}
                  </span>
                )}
              </div>
            </div>

            {/* Location Tag */}
            {item.location && (
              <div className="flex items-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-mono text-[#A1A7B4] bg-white/[0.05] border border-white/[0.08]">
                  <MapPin className="w-3 h-3 text-white/60" />
                  {item.location}
                </span>
              </div>
            )}
          </div>

          {/* Card Body: Text Content + Integrated Image Showcase */}
          <div className="flex flex-col lg:flex-row gap-6 mt-6 items-stretch">
            {/* Left Content Column */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p
                  className="text-[14px] sm:text-[15px] leading-[1.8] text-[#A1A7B4]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {item.description}
                </p>

                {/* Key Highlights */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {item.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-white/75 shrink-0 mt-1" />
                        <span
                          className="text-[13px] sm:text-[13.5px] leading-[1.65] text-[#C4C8D3]"
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
                <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11.5px] sm:text-[12px] font-medium tracking-wide text-white/80 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.2] transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right Visual Showcase */}
            {item.images && item.images.length > 0 && (
              <div className="lg:w-[36%] xl:w-[38%] shrink-0 flex flex-col gap-3 justify-center">
                {item.images.slice(0, 2).map((img, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="relative h-36 sm:h-40 lg:h-[135px] rounded-2xl overflow-hidden shadow-lg bg-neutral-900 border border-white/[0.08] group"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-105 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E]/60 via-transparent to-transparent pointer-events-none" />
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
      className="relative z-10 w-full border-t border-white/[0.06]"
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
