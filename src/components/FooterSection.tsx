import React from 'react';
import { portfolioConfig } from '../portfolio.config';
import { ArrowUpRight } from 'lucide-react';

export const FooterSection: React.FC = () => {
  const { contactModal } = portfolioConfig;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (targetId === '#hero' || targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Home', url: '#hero' },
    { label: 'About', url: '#about' },
    { label: 'Experiences', url: '#experience' },
    { label: 'Projects', url: '#projects' },
  ];

  return (
    <footer
      id="contact"
      data-no-cursor-lens="true"
      className="relative z-10 w-full border-t border-white/[0.08] py-14 sm:py-20 px-6 sm:px-10 md:px-16 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Title & Subtitle */}
        <div className="mb-10 sm:mb-12">
          <h2 className="font-hero-display text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-[#FFE500] leading-[0.92] uppercase mb-4 select-none">
            GET IN TOUCH
          </h2>
          <p
            className="text-sm sm:text-base text-white/95 max-w-lg leading-relaxed font-normal"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Feel free to reach out for collaborations, project inquiries, or just to say hi!
          </p>
        </div>

        {/* 2-Column Grid: Navigation & Socials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 pt-8 border-t border-white/[0.08]">
          {/* Navigation Column */}
          <div>
            <div className="text-[12px] font-mono tracking-widest text-[#FFE500] uppercase mb-4 font-medium">
              Navigation
            </div>
            <ul className="space-y-2.5">
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    onClick={(e) => scrollToSection(e, link.url)}
                    className="nav-link text-sm sm:text-[15px] inline-block text-white hover:text-[#FFE500]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Column */}
          <div>
            <div className="text-[12px] font-mono tracking-widest text-[#FFE500] uppercase mb-4 font-medium">
              Socials
            </div>
            <ul className="space-y-2.5">
              {contactModal.socials.map((social, idx) => (
                <li key={idx}>
                  <a
                    href={social.url}
                    target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="inline-flex items-center gap-1.5 text-sm sm:text-[15px] text-white hover:text-[#FFE500] group transition-colors"
                  >
                    <span>{social.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/80 group-hover:text-[#FFE500] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
