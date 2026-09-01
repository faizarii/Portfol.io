import React, { useState, useEffect } from 'react';
import { portfolioConfig } from '../portfolio.config';
import { AvatarCard } from './AvatarCard';

export const Hero: React.FC = () => {
  const { hero, avatar } = portfolioConfig;

  const [displayedFirstName, setDisplayedFirstName] = useState('');
  const [displayedLastName, setDisplayedLastName] = useState('');
  const [displayedThirdLine, setDisplayedThirdLine] = useState('');
  const [activeLine, setActiveLine] = useState<1 | 2 | 3>(1);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const firstName = hero.firstName || '';
    const lastName = hero.lastName || '';
    const thirdLine = hero.thirdLine || '';

    const typeSpeed = 75; // ms per character
    const linePause = 160; // ms pause before moving to the next line

    let lineIndex = 1;
    let charIndex = 0;

    const typeNextChar = () => {
      if (lineIndex === 1) {
        if (charIndex < firstName.length) {
          setDisplayedFirstName(firstName.slice(0, charIndex + 1));
          charIndex++;
          timeoutId = setTimeout(typeNextChar, typeSpeed);
        } else {
          lineIndex = 2;
          charIndex = 0;
          setActiveLine(2);
          timeoutId = setTimeout(typeNextChar, linePause);
        }
      } else if (lineIndex === 2) {
        if (charIndex < lastName.length) {
          setDisplayedLastName(lastName.slice(0, charIndex + 1));
          charIndex++;
          timeoutId = setTimeout(typeNextChar, typeSpeed);
        } else {
          if (thirdLine) {
            lineIndex = 3;
            charIndex = 0;
            setActiveLine(3);
            timeoutId = setTimeout(typeNextChar, linePause);
          } else {
            setIsDone(true);
          }
        }
      } else if (lineIndex === 3) {
        if (charIndex < thirdLine.length) {
          setDisplayedThirdLine(thirdLine.slice(0, charIndex + 1));
          charIndex++;
          timeoutId = setTimeout(typeNextChar, typeSpeed);
        } else {
          setIsDone(true);
        }
      }
    };

    // Initial short pause before starting typing animation
    timeoutId = setTimeout(typeNextChar, 250);

    return () => clearTimeout(timeoutId);
  }, [hero.firstName, hero.lastName, hero.thirdLine]);

  // Render the blinking cursor line - perfectly level with Anton font cap height (0.78em) and baseline
  const renderCursor = () => (
    <span
      aria-hidden="true"
      className="inline-block w-[2px] sm:w-[2.5px] md:w-[3.5px] lg:w-[4px] h-[0.78em] bg-[#FFE500] ml-2 sm:ml-3 align-baseline rounded-none animate-cursor-blink"
    />
  );

  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-6 sm:py-8 md:py-10 px-4 sm:px-8">
      {/* Central Composition Wrapper */}
      <div className="relative w-full max-w-7xl flex flex-col items-center justify-center">

        {/* Layout: Avatar on Left (Primary / Default) */}
        {avatar.position === 'left' ? (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-20 w-full">
            {/* Left: Large Avatar Card */}
            <div className="shrink-0 z-20">
              <AvatarCard />
            </div>

            {/* Right: Massive Typography with Typewriter & Blinking Cursor */}
            <div
              className="flex flex-col items-center lg:items-start text-center lg:text-left font-hero-display tracking-tight select-none"
              aria-label={`${hero.firstName} ${hero.lastName}`}
            >
              {/* First Name (e.g. FAIZ ARI) */}
              <h1 className="hero-title-line min-h-[0.92em]">
                <span>{displayedFirstName}</span>
                {activeLine === 1 && renderCursor()}
              </h1>

              {/* Last Name (e.g. FADHILAH) */}
              <h1 className="hero-title-line min-h-[0.92em] mt-2 sm:mt-3 md:mt-4 lg:mt-5">
                <span>{displayedLastName}</span>
                {(activeLine === 2 || (isDone && !hero.thirdLine)) && renderCursor()}
              </h1>

              {/* Optional 3rd line if provided */}
              {hero.thirdLine && (
                <h1 className="hero-title-line min-h-[0.92em] mt-2 sm:mt-3 md:mt-4 lg:mt-5">
                  <span>{displayedThirdLine}</span>
                  {(activeLine === 3 || isDone) && renderCursor()}
                </h1>
              )}
            </div>
          </div>
        ) : (
          /* Centered / Other Configured Layouts */
          <div
            className="relative flex flex-col items-center justify-center text-center font-hero-display tracking-tight select-none"
            aria-label={`${hero.firstName} ${hero.lastName}`}
          >
            {/* First Name */}
            <h1 className="hero-title-line min-h-[0.92em]">
              <span>{displayedFirstName}</span>
              {activeLine === 1 && renderCursor()}
            </h1>

            {/* Last Name with small subtle padding */}
            <div className="relative inline-flex items-center justify-center mt-2 sm:mt-3 md:mt-4 lg:mt-5">
              <h1 className="hero-title-line min-h-[0.92em]">
                <span>{displayedLastName}</span>
                {(activeLine === 2 || (isDone && !hero.thirdLine)) && renderCursor()}
              </h1>

              {/* If position is 'offset-right', place next to the last name */}
              {avatar.position === 'offset-right' && (
                <div className="hidden lg:block absolute left-[102%] top-1/2 -translate-y-1/2 pl-6 z-20">
                  <AvatarCard />
                </div>
              )}
            </div>

            {/* Optional 3rd line if provided */}
            {hero.thirdLine && (
              <h1 className="hero-title-line min-h-[0.92em] mt-2 sm:mt-3 md:mt-4 lg:mt-5">
                <span>{displayedThirdLine}</span>
                {(activeLine === 3 || isDone) && renderCursor()}
              </h1>
            )}

            {/* Position: 'bottom-right' */}
            {avatar.position === 'bottom-right' && (
              <div className="w-full max-w-5xl flex justify-center md:justify-end mt-6 sm:mt-8 md:mt-4 md:-mb-12 z-20">
                <AvatarCard />
              </div>
            )}

            {/* Position: 'bottom-center' */}
            {avatar.position === 'bottom-center' && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-15%] sm:bottom-[-10%] md:bottom-[-6%] z-20">
                <AvatarCard />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Hero;
