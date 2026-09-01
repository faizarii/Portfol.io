import React from 'react';
import { portfolioConfig } from '../portfolio.config';
import { Download } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const { ctaButton, navLinks } = portfolioConfig;

  const handleCtaClick = (e: React.MouseEvent) => {
    if (ctaButton.actionType === 'modal') {
      e.preventDefault();
      onOpenContact();
    } else if (ctaButton.actionType === 'email') {
      e.preventDefault();
      window.location.href = `mailto:${ctaButton.email || 'contact@example.com'}`;
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string, isExternal?: boolean) => {
    if (!isExternal && url.startsWith('#')) {
      e.preventDefault();
      if (url === '#hero' || url === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.querySelector(url);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="relative z-20 w-full pt-6 sm:pt-8 md:pt-10 px-4 sm:px-8 md:px-16 lg:px-20 flex flex-wrap items-center justify-between gap-3 sm:gap-6">
      {/* Top Left: CTA Button (Download CV) */}
      <div className="shrink-0">
        {ctaButton.actionType === 'download' ? (
          <a
            href={ctaButton.fileUrl || '/cv.pdf'}
            download={ctaButton.downloadFileName || 'Faiz_Ari_Fadhilah_CV.pdf'}
            className="nav-link inline-flex items-center gap-1.5 sm:gap-2 group text-xs sm:text-[14px] md:text-[15px] font-medium"
          >
            <Download className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-transform group-hover:translate-y-0.5 shrink-0" />
            <span>{ctaButton.label}</span>
          </a>
        ) : (
          <a
            href={ctaButton.link || '#'}
            onClick={handleCtaClick}
            className="nav-link inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[14px] md:text-[15px] font-medium"
          >
            <Download className="w-3.5 h-3.5 opacity-80 shrink-0" />
            <span>{ctaButton.label}</span>
          </a>
        )}
      </div>

      {/* Top Right: Navigation Links */}
      <nav className="flex items-center gap-3 sm:gap-6 md:gap-8 lg:gap-10 text-xs sm:text-[14px] md:text-[15px] overflow-x-auto no-scrollbar py-1">
        {navLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            onClick={(e) => handleNavClick(e, link.url, link.isExternal)}
            target={link.isExternal ? '_blank' : undefined}
            rel={link.isExternal ? 'noopener noreferrer' : undefined}
            className="nav-link whitespace-nowrap"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
