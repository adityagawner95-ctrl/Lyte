import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 28 }) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-950/80 via-slate-900 to-[#0A0E17] border border-indigo-500/20 shadow-sm shadow-indigo-950/50 shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="XML Studio"
    >
      <svg
        width={size * 0.72}
        height={size * 0.72}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        {/* Left angle bracket */}
        <path
          d="M6 8L2.5 12L6 16"
          stroke="#818CF8"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right angle bracket */}
        <path
          d="M18 8L21.5 12L18 16"
          stroke="#06B6D4"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central page outline */}
        <path
          d="M9 5H14C14.5523 5 15 5.44772 15 6V18C15 18.5523 14.5523 19 14 19H9C8.44772 19 8 18.5523 8 18V6C8 5.44772 8.44772 5 9 5Z"
          stroke="#94A3B8"
          strokeWidth="1.2"
          strokeDasharray="2 1.5"
          fill="#0F172A"
          fillOpacity="0.8"
        />

        {/* Transformation flow arrow */}
        <path
          d="M9.5 12H13.5M12 10.5L13.5 12L12 13.5"
          stroke="#C084FC"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
