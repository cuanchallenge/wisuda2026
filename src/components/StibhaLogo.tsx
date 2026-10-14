import React from 'react';

interface StibhaLogoProps {
  className?: string;
  size?: number;
}

export const StibhaLogo: React.FC<StibhaLogoProps> = ({ className = 'w-16 h-16', size }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="stibhaGoldDisc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </radialGradient>
        <linearGradient id="stibhaGreenPentagon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#0f5c2b" />
        </linearGradient>
        <linearGradient id="stibhaSnakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c2410c" />
          <stop offset="50%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <filter id="stibhaShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" floodColor="#064e3b" />
        </filter>
      </defs>

      {/* Outer Green Pentagon */}
      <polygon
        points="100,6 194,74 158,188 42,188 6,74"
        fill="url(#stibhaGreenPentagon)"
        stroke="#064e3b"
        strokeWidth="2.5"
        filter="url(#stibhaShadow)"
      />

      {/* Pentagon Inner Border Highlight */}
      <polygon
        points="100,12 186,76 153,182 47,182 14,76"
        fill="none"
        stroke="#22c55e"
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* Central Yellow Sunburst / Disc */}
      <circle
        cx="100"
        cy="104"
        r="68"
        fill="url(#stibhaGoldDisc)"
        stroke="#15803d"
        strokeWidth="2.5"
      />

      {/* Dotted Concentric Ring */}
      <circle
        cx="100"
        cy="104"
        r="64"
        fill="none"
        stroke="#166534"
        strokeWidth="2"
        strokeDasharray="2.5 3.5"
      />

      {/* Central Staff / Caduceus Rod */}
      <rect x="97" y="52" width="6" height="78" rx="3" fill="#1e293b" />
      {/* Golden Sphere on Staff */}
      <circle cx="100" cy="50" r="7" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="98" cy="48" r="2.5" fill="#fef08a" />

      {/* Outstretched Wings (Caduceus) */}
      <g fill="#15803d" stroke="#064e3b" strokeWidth="1">
        {/* Left Wing */}
        <path d="M96 66 C80 50, 52 56, 46 64 C56 68, 70 70, 78 74 C65 74, 52 78, 48 84 C60 84, 76 82, 88 80 C80 84, 72 88, 68 94 C78 90, 88 86, 96 82 Z" />
        {/* Right Wing */}
        <path d="M104 66 C120 50, 148 56, 154 64 C144 68, 130 70, 122 74 C135 74, 148 78, 152 84 C140 84, 124 82, 112 80 C120 84, 128 88, 132 94 C122 90, 112 86, 104 82 Z" />
      </g>

      {/* Twinned Entwined Snakes */}
      <g fill="none" stroke="url(#stibhaSnakeGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        {/* Left snake loops */}
        <path d="M92 74 C78 76, 78 88, 92 92 C108 96, 108 108, 92 112" />
        {/* Right snake loops */}
        <path d="M108 74 C122 76, 122 88, 108 92 C92 96, 92 108, 108 112" />
      </g>
      {/* Snake Heads */}
      <circle cx="89" cy="73" r="4" fill="#7c2d12" />
      <circle cx="111" cy="73" r="4" fill="#7c2d12" />

      {/* Open White Book in Center-Bottom */}
      <g filter="url(#stibhaShadow)">
        {/* Book Left Page */}
        <path
          d="M98 118 L68 122 C64 123, 62 138, 66 142 L98 138 Z"
          fill="#ffffff"
          stroke="#1e293b"
          strokeWidth="1.5"
        />
        {/* Book Right Page */}
        <path
          d="M102 118 L132 122 C136 123, 138 138, 134 142 L102 138 Z"
          fill="#ffffff"
          stroke="#1e293b"
          strokeWidth="1.5"
        />
        {/* Spine */}
        <line x1="100" y1="117" x2="100" y2="139" stroke="#0f172a" strokeWidth="2" />
        {/* Text lines on book */}
        <line x1="72" y1="126" x2="94" y2="124" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="72" y1="130" x2="94" y2="128" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="72" y1="134" x2="94" y2="132" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />

        <line x1="106" y1="124" x2="128" y2="126" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="106" y1="128" x2="128" y2="130" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="106" y1="132" x2="128" y2="134" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
      </g>

      {/* Ribbon Banner at Bottom */}
      <g>
        {/* Ribbon folds */}
        <path d="M42 144 L48 136 L56 148 L42 152 Z" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
        <path d="M158 144 L152 136 L144 148 L158 152 Z" fill="#cbd5e1" stroke="#334155" strokeWidth="1" />
        {/* Main Ribbon Arch */}
        <path
          d="M48 142 C70 152, 130 152, 152 142 L148 156 C126 168, 74 168, 52 156 Z"
          fill="#ffffff"
          stroke="#1e293b"
          strokeWidth="1.5"
        />
        {/* Ribbon Text */}
        <text
          x="100"
          y="157"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
          fill="#0f172a"
          letterSpacing="0.4"
        >
          STIKES BHAKTI AL-QODIRI
        </text>
      </g>
    </svg>
  );
};
