import React from 'react';
import { portfolioConfig } from '../portfolio.config';

export const FooterInfo: React.FC = () => {
  const { footer } = portfolioConfig;

  return (
    <footer className="relative z-20 w-full pb-8 sm:pb-10 md:pb-12 px-6 sm:px-10 md:px-16 lg:px-20 text-[14px] sm:text-[15px] md:text-[15.5px] leading-relaxed text-white/95 font-medium">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-12">
        {/* Left Bio Info - Clean & Uniform */}
        <div className="max-w-md">
          <p>
            {footer.leftText.line1}
            <br className="hidden sm:inline" />{' '}
            {footer.leftText.line2}
          </p>
        </div>

        {/* Right Focus & Area Info */}
        <div className="max-w-md md:text-right">
          <p>
            {footer.rightText.line1}
            <br className="hidden sm:inline" />{' '}
            {footer.rightText.line2}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterInfo;
