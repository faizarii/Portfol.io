import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

interface AnimationLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

export const AnimationLoader: React.FC<AnimationLoaderProps> = ({
  onComplete,
  duration = 2.4,
}) => {
  const [displayCount, setDisplayCount] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  const countValue = useMotionValue(1);
  const springCount = useSpring(countValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    // Lock body scroll during intro loader
    document.body.style.overflow = 'hidden';

    // Start progress & count-up firmly to 100
    countValue.set(100);

    const unsubscribe = springCount.on('change', (latest) => {
      const rounded = Math.round(latest);
      const clamped = Math.min(100, Math.max(1, rounded));
      setDisplayCount(clamped);

      if (rounded >= 100 && !isFinished) {
        setDisplayCount(100);
        setIsFinished(true);
      }
    });

    return () => {
      unsubscribe();
      document.body.style.overflow = '';
    };
  }, [countValue, springCount, isFinished]);

  const handleExitComplete = () => {
    document.body.style.overflow = '';
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isFinished ? (
        <motion.div
          key="animation-loader"
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            borderBottomLeftRadius: ['0%', '35%', '0%'],
            borderBottomRightRadius: ['0%', '35%', '0%'],
            transition: {
              duration: 0.85,
              ease: [0.77, 0, 0.175, 1],
              delay: 0.28,
            },
          }}
          className="fixed inset-0 z-[100000] flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-[#00509D] text-[#FFE500] select-none pointer-events-auto overscroll-none overflow-hidden"
          style={{ willChange: 'transform, border-radius' }}
        >
          {/* Top Row (Brand Name omitted as requested) */}
          <div className="w-full flex items-center justify-between min-h-[32px]">
            {/* Intentionally blank per user directive */}
          </div>

          {/* Middle Animated Progress Bar Line */}
          <div className="w-full relative py-4">
            <div className="w-full h-[2px] sm:h-[3px] bg-white/15 relative overflow-hidden rounded-full">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: duration,
                  ease: [0.12, 0.23, 0.5, 1],
                }}
                className="absolute top-0 left-0 bottom-0 bg-[#FFE500] shadow-[0_0_15px_rgba(255,229,0,0.8)] rounded-full"
              />
            </div>
          </div>

          {/* Bottom Massive Typographic Counter Display (Anton Font matching Hero Name) */}
          <div className="w-full flex items-end justify-end">
            <div className="inline-flex items-baseline font-bold tracking-tighter leading-none select-none text-[#FFE500]">
              <span className="text-[clamp(6rem,22vw,24rem)] leading-[0.82] font-hero-display tracking-tight select-none">
                {displayCount}
              </span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AnimationLoader;
