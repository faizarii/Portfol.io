import React, { useState, useEffect, useRef } from 'react';
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
import { AnimationLoader } from './components/AnimationLoader';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Disable automatic browser scroll restoration on reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Reset window scroll to top and clear any hash anchor
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Silky smooth, uniform gliding scroll across the entire website
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;
    lenis.scrollTo(0, { immediate: true });

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

  const handleLoadingComplete = () => {
    setIsLoading(false);
    window.scrollTo(0, 0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  };

  return (
    <div className="relative w-full bg-[#00509D] text-white selection:bg-[#FFD166] selection:text-[#002952] overflow-x-clip">
      {/* Interactive Cursor Follower Inverting Lens (Active only after loading completes) */}
      {!isLoading && <CursorLens />}

      {/* Interactive Silky Atmospheric Background */}
      <BackgroundCanvas />

      {/* 1. HERO VIEWPORT: Full-screen landing with Navbar, Hero, and Footer status bar */}
      <section id="hero" className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-x-hidden select-none">
        {/* Top Navigation */}
        <Navbar onOpenContact={() => setIsContactOpen(true)} />

        {/* Center Hero with Condensed Typography & Positioned Photo Card */}
        <Hero startTyping={!isLoading} />

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

      {/* Cinematic Intro Preloader Screen */}
      {isLoading && (
        <AnimationLoader onComplete={handleLoadingComplete} />
      )}
    </div>
  );
};

export default App;
