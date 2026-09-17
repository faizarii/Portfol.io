import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { portfolioConfig } from '../portfolio.config';
import { BriefcaseBusiness, Download, ExternalLink, FolderKanban, Home, Menu, UserRound, X } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const { ctaButton, navLinks } = portfolioConfig;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setIsMobileMenuOpen(false);
      if (url === '#hero' || url === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.querySelector(url);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const mobileIcons = {
    '#hero': Home,
    '#about': UserRound,
    '#experience': BriefcaseBusiness,
    '#projects': FolderKanban,
  };

  return (
    <header className="relative z-20 w-full pt-6 sm:pt-8 md:pt-10 px-4 sm:px-8 md:px-16 lg:px-20 flex flex-wrap items-center justify-between gap-3 sm:gap-6">
      <span className="md:hidden text-sm font-semibold text-white tracking-tight">
        Portfol.io
      </span>

      {/* Top Left: CTA Button (Download CV) */}
      <div className="hidden md:block shrink-0">
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

      <button
        type="button"
        aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsMobileMenuOpen((open) => !open)}
        className="md:hidden ml-auto p-2 text-white"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[15px] py-1">
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

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-4 right-4 mt-3 md:hidden flex flex-col rounded-2xl border border-white/20 bg-[#00386C]/95 p-2 shadow-2xl backdrop-blur-xl"
          >
            {navLinks.map((link, idx) => {
              const Icon = mobileIcons[link.url as keyof typeof mobileIcons] || ExternalLink;

              return (
                <a
                  key={idx}
                  href={link.url}
                  onClick={(e) => handleNavClick(e, link.url, link.isExternal)}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  className="nav-link flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10"
                >
                  <Icon className="w-4 h-4 text-[#FFE500]" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
