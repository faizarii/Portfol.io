import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FooterInfo } from './components/FooterInfo';
import { AboutSection } from './components/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { FooterSection } from './components/FooterSection';
import { ContactModal } from './components/ContactModal';
import { CursorLens } from './components/CursorLens';

export const App: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    // Silky smooth, uniform gliding scroll across the entire website
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full bg-[#00509D] text-white selection:bg-[#FFD166] selection:text-[#002952] overflow-x-clip">
      {/* Interactive Cursor Follower Inverting Lens */}
      <CursorLens />

      {/* Interactive Silky Atmospheric Background */}
      <BackgroundCanvas />

      {/* 1. HERO VIEWPORT: Full-screen landing with Navbar, Hero, and Footer status bar */}
      <section id="hero" className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-x-hidden select-none">
        {/* Top Navigation */}
        <Navbar onOpenContact={() => setIsContactOpen(true)} />

        {/* Center Hero with Condensed Typography & Positioned Photo Card */}
        <Hero />

        {/* Bottom Hero Metadata & Status */}
        <FooterInfo />
      </section>

      {/* 2. ABOUT ME SECTION */}
      <AboutSection />

      {/* 3. EXPERIENCES TIMELINE SECTION */}
      <ExperienceSection />

      {/* 4. PROJECTS SHOWCASE SECTION */}
      <ProjectsSection />

      {/* 5. FOOTER & CONTACT SECTION */}
      <FooterSection />

      {/* Interactive Social Media & Contact Dialog */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
};

export default App;
