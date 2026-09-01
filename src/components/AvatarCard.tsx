import React, { useRef, useState } from 'react';
import { portfolioConfig } from '../portfolio.config';
import { User } from 'lucide-react';

interface AvatarCardProps {
  className?: string;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({ className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('');
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const [hasError, setHasError] = useState(false);
  const rawSrc = portfolioConfig.avatar.imageSrc;
  const normalizedSrc = rawSrc ? rawSrc.replace(/^(\.\/)?public\//, '/') : '';
  const activeImage = !hasError && normalizedSrc ? normalizedSrc : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(`perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22,
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className={`relative select-none ${className}`}>
      {/* 3D Glass Avatar / Photo Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform }}
        className="avatar-glass-card group relative overflow-hidden flex items-center justify-center w-[200px] h-[250px] sm:w-[240px] sm:h-[300px] md:w-[280px] md:h-[350px] lg:w-[320px] lg:h-[400px] xl:w-[350px] xl:h-[440px] transition-transform duration-200 ease-out"
      >
        {/* Dynamic Specular Glare Light */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[28px] transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}) 0%, transparent 60%)`,
          }}
        />

        {activeImage ? (
          <div className="w-full h-full p-2">
            <img
              src={activeImage}
              alt={portfolioConfig.avatar.alt}
              onError={() => setHasError(true)}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="w-full h-full object-cover rounded-[22px]"
            />
          </div>
        ) : (
          /* Sleek Minimalist Portrait Placeholder Frame */
          <div className="w-full h-full p-2 flex flex-col items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center mb-4">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-300 stroke-[1.25]" />
              </div>
              <span className="text-xs sm:text-sm font-medium tracking-wide text-neutral-300">
                Avatar Card
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-500 mt-1 max-w-[160px] leading-relaxed">
                Add image link in portfolio.config.ts
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
