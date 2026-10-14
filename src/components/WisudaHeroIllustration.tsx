import React from 'react';
import { StibhaLogo } from './StibhaLogo';

export const WisudaHeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-[4/3] max-w-xl mx-auto select-none ${className}`}>
      <svg
        viewBox="0 0 600 450"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="100%" stopColor="#dcfce7" />
          </linearGradient>

          <linearGradient id="campusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d1fae5" />
            <stop offset="100%" stopColor="#a7f3d0" />
          </linearGradient>

          <linearGradient id="tableGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>

          <linearGradient id="bookCoverGreen1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>

          <linearGradient id="bookCoverGreen2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="goldTassel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          <linearGradient id="goldCoin" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.15" floodColor="#064e3b" />
          </filter>
        </defs>

        {/* Soft Sunny Backdrop */}
        <rect x="10" y="10" width="580" height="430" rx="32" fill="url(#skyGrad)" opacity="0.8" />

        {/* Campus Building Backdrop (Soft Illustrated STIBHA Campus) */}
        <g opacity="0.55">
          {/* Main campus facade */}
          <rect x="190" y="140" width="220" height="110" rx="4" fill="url(#campusGrad)" />
          {/* Triangular pediment / roof */}
          <polygon points="300,90 180,140 420,140" fill="#059669" opacity="0.75" />
          {/* Central Dome / Tower */}
          <rect x="280" y="65" width="40" height="30" fill="#10b981" />
          <path d="M280,65 Q300,40 320,65 Z" fill="#047857" />
          {/* Pillars */}
          <rect x="215" y="155" width="12" height="75" fill="#ecfdf5" rx="2" />
          <rect x="245" y="155" width="12" height="75" fill="#ecfdf5" rx="2" />
          <rect x="275" y="155" width="12" height="75" fill="#ecfdf5" rx="2" />
          <rect x="312" y="155" width="12" height="75" fill="#ecfdf5" rx="2" />
          <rect x="342" y="155" width="12" height="75" fill="#ecfdf5" rx="2" />
          <rect x="372" y="155" width="12" height="75" fill="#ecfdf5" rx="2" />
          {/* Windows */}
          <rect x="230" y="165" width="8" height="16" rx="2" fill="#047857" opacity="0.3" />
          <rect x="260" y="165" width="8" height="16" rx="2" fill="#047857" opacity="0.3" />
          <rect x="330" y="165" width="8" height="16" rx="2" fill="#047857" opacity="0.3" />
          <rect x="360" y="165" width="8" height="16" rx="2" fill="#047857" opacity="0.3" />

          {/* Lush Green Trees Left & Right */}
          <circle cx="160" cy="220" r="45" fill="#34d399" opacity="0.7" />
          <circle cx="130" cy="240" r="35" fill="#10b981" opacity="0.75" />
          <circle cx="440" cy="220" r="45" fill="#34d399" opacity="0.7" />
          <circle cx="470" cy="240" r="35" fill="#10b981" opacity="0.75" />
        </g>

        {/* Clean Wooden Desk Surface in Perspective */}
        <polygon points="0,290 600,290 600,450 0,450" fill="url(#tableGrad)" />
        <line x1="0" y1="290" x2="600" y2="290" stroke="#fcd34d" strokeWidth="3" />

        {/* Desk Ambient Shadow under Objects */}
        <ellipse cx="200" cy="365" rx="170" ry="45" fill="#047857" opacity="0.12" />
        <ellipse cx="430" cy="365" rx="130" ry="35" fill="#047857" opacity="0.12" />

        {/* Financial Sheet with Bar Chart on Desk */}
        <g transform="translate(230, 310) rotate(-4)" filter="url(#softShadow)">
          {/* Paper */}
          <rect x="0" y="0" width="170" height="100" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          {/* Header line */}
          <rect x="15" y="15" width="60" height="6" rx="3" fill="#cbd5e1" />
          <rect x="15" y="25" width="90" height="4" rx="2" fill="#e2e8f0" />
          {/* Mini Bar Chart */}
          <rect x="30" y="65" width="12" height="20" rx="2" fill="#6ee7b7" />
          <rect x="50" y="50" width="12" height="35" rx="2" fill="#10b981" />
          <rect x="70" y="42" width="12" height="43" rx="2" fill="#059669" />
          <rect x="90" y="32" width="12" height="53" rx="2" fill="#047857" />
          <rect x="110" y="55" width="12" height="30" rx="2" fill="#fbbf24" />
          <line x1="20" y1="88" x2="145" y2="88" stroke="#cbd5e1" strokeWidth="1.5" />
        </g>

        {/* Modern Calculator on Desk */}
        <g transform="translate(325, 275)" filter="url(#softShadow)">
          {/* Body */}
          <rect x="0" y="0" width="85" height="110" rx="14" fill="#1e293b" />
          <rect x="3" y="3" width="79" height="104" rx="11" fill="#334155" />
          {/* Screen */}
          <rect x="10" y="10" width="65" height="24" rx="4" fill="#0f172a" />
          <rect x="12" y="12" width="61" height="20" rx="3" fill="#064e3b" />
          {/* Screen text */}
          <text x="66" y="27" textAnchor="end" fill="#6ee7b7" fontSize="12" fontFamily="monospace" fontWeight="bold">
            2026.00
          </text>
          {/* Buttons Grid */}
          <g fill="#475569" rx="3">
            {/* Row 1 */}
            <rect x="12" y="42" width="12" height="10" rx="2" fill="#ef4444" />
            <rect x="28" y="42" width="12" height="10" rx="2" />
            <rect x="44" y="42" width="12" height="10" rx="2" />
            <rect x="60" y="42" width="12" height="10" rx="2" fill="#10b981" />
            {/* Row 2 */}
            <rect x="12" y="56" width="12" height="10" rx="2" fill="#64748b" />
            <rect x="28" y="56" width="12" height="10" rx="2" fill="#64748b" />
            <rect x="44" y="56" width="12" height="10" rx="2" fill="#64748b" />
            <rect x="60" y="56" width="12" height="10" rx="2" fill="#10b981" />
            {/* Row 3 */}
            <rect x="12" y="70" width="12" height="10" rx="2" fill="#64748b" />
            <rect x="28" y="70" width="12" height="10" rx="2" fill="#64748b" />
            <rect x="44" y="70" width="12" height="10" rx="2" fill="#64748b" />
            <rect x="60" y="70" width="12" height="24" rx="2" fill="#eab308" />
            {/* Row 4 */}
            <rect x="12" y="84" width="28" height="10" rx="2" fill="#64748b" />
            <rect x="44" y="84" width="12" height="10" rx="2" fill="#64748b" />
          </g>
        </g>

        {/* Stacks of Golden Coins */}
        <g transform="translate(425, 305)" filter="url(#softShadow)">
          {/* Stack 1 (Taller) */}
          <g transform="translate(35, 10)">
            <ellipse cx="15" cy="55" rx="18" ry="7" fill="#78350f" />
            <ellipse cx="15" cy="50" rx="18" ry="7" fill="url(#goldCoin)" />
            <ellipse cx="15" cy="42" rx="18" ry="7" fill="url(#goldCoin)" />
            <ellipse cx="15" cy="34" rx="18" ry="7" fill="url(#goldCoin)" />
            <ellipse cx="15" cy="26" rx="18" ry="7" fill="url(#goldCoin)" />
            <ellipse cx="15" cy="18" rx="18" ry="7" fill="url(#goldCoin)" />
            <ellipse cx="15" cy="10" rx="18" ry="7" fill="url(#goldCoin)" stroke="#fef08a" strokeWidth="1" />
          </g>
          {/* Stack 2 (Medium) */}
          <g transform="translate(5, 25)">
            <ellipse cx="15" cy="48" rx="18" ry="7" fill="#78350f" />
            <ellipse cx="15" cy="43" rx="18" ry="7" fill="url(#goldCoin)" />
            <ellipse cx="15" cy="35" rx="18" ry="7" fill="url(#goldCoin)" />
            <ellipse cx="15" cy="27" rx="18" ry="7" fill="url(#goldCoin)" />
            <ellipse cx="15" cy="19" rx="18" ry="7" fill="url(#goldCoin)" stroke="#fef08a" strokeWidth="1" />
          </g>
          {/* Single Coin in front */}
          <g transform="translate(45, 55)">
            <ellipse cx="15" cy="18" rx="18" ry="7" fill="#78350f" />
            <ellipse cx="15" cy="14" rx="18" ry="7" fill="url(#goldCoin)" stroke="#fef08a" strokeWidth="1" />
          </g>
        </g>

        {/* Stack of Two Green Hardcover Books */}
        <g transform="translate(20, 260)" filter="url(#softShadow)">
          {/* Bottom Book */}
          <g transform="translate(0, 45)">
            {/* Book Spine & Cover */}
            <rect x="15" y="0" width="220" height="28" rx="4" fill="url(#bookCoverGreen1)" />
            {/* White Pages Block */}
            <rect x="25" y="5" width="205" height="18" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            {/* Page edge ridges */}
            <line x1="28" y1="10" x2="225" y2="10" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="28" y1="14" x2="225" y2="14" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="28" y1="18" x2="225" y2="18" stroke="#cbd5e1" strokeWidth="1" />
            {/* Bottom cover ridge */}
            <rect x="10" y="24" width="230" height="5" rx="2" fill="#064e3b" />
          </g>

          {/* Top Book */}
          <g transform="translate(5, 15)">
            {/* Book Spine & Cover */}
            <rect x="15" y="0" width="220" height="28" rx="4" fill="url(#bookCoverGreen2)" />
            {/* White Pages Block */}
            <rect x="25" y="5" width="205" height="18" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
            {/* Page edge ridges */}
            <line x1="28" y1="10" x2="225" y2="10" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="28" y1="14" x2="225" y2="14" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="28" y1="18" x2="225" y2="18" stroke="#cbd5e1" strokeWidth="1" />
            {/* Top cover ridge */}
            <rect x="10" y="24" width="230" height="5" rx="2" fill="#047857" />
          </g>
        </g>

        {/* Graduation Cap (Toga) on Top of Books */}
        <g transform="translate(40, 195)" filter="url(#softShadow)">
          {/* Cap Skull/Base Dome */}
          <ellipse cx="140" cy="55" rx="55" ry="25" fill="#020617" />
          <path d="M85,55 Q140,85 195,55 L195,68 Q140,98 85,68 Z" fill="#0f172a" />

          {/* Square Mortarboard (Perspective diamond) */}
          <polygon
            points="140,0 245,35 140,70 35,35"
            fill="url(#capGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />
          {/* Top Highlight Rim */}
          <polygon
            points="140,4 235,35 140,66 45,35"
            fill="none"
            stroke="#475569"
            strokeWidth="1"
            opacity="0.4"
          />

          {/* Button on top of cap */}
          <ellipse cx="140" cy="35" rx="7" ry="4" fill="#020617" />

          {/* Golden Yellow Tassel Ribbon */}
          <path
            d="M140,35 Q105,45 80,75 Q70,95 72,130"
            fill="none"
            stroke="url(#goldTassel)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Hanging Golden Tassel Fringe */}
          <g transform="translate(62, 125)">
            <rect x="5" y="0" width="10" height="5" rx="2" fill="#ca8a04" />
            <polygon points="5,5 15,5 18,35 2,35" fill="url(#goldTassel)" />
            {/* Fringe strands */}
            <line x1="4" y1="35" x2="4" y2="40" stroke="#ca8a04" strokeWidth="1.5" />
            <line x1="7" y1="35" x2="7" y2="42" stroke="#eab308" strokeWidth="1.5" />
            <line x1="10" y1="35" x2="10" y2="42" stroke="#facc15" strokeWidth="1.5" />
            <line x1="13" y1="35" x2="13" y2="40" stroke="#ca8a04" strokeWidth="1.5" />
            <line x1="16" y1="35" x2="16" y2="38" stroke="#ca8a04" strokeWidth="1.5" />
          </g>
        </g>

        {/* Rolled Diploma Certificate Scroll in Foreground */}
        <g transform="translate(55, 335)" filter="url(#softShadow)">
          {/* Scroll tube body */}
          <path
            d="M30,5 L190,0 Q196,15 190,30 L30,35 Q20,20 30,5 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          {/* Rolled paper ends */}
          <ellipse cx="30" cy="20" rx="14" ry="15" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <ellipse cx="30" cy="20" rx="7" ry="8" fill="#e2e8f0" />

          {/* Green Ribbon Tied Around Scroll */}
          <rect x="100" y="2" width="22" height="32" rx="2" fill="#047857" stroke="#064e3b" strokeWidth="1" />
          {/* Ribbon Ends Hanging */}
          <path d="M102,34 L94,58 L104,52 L112,58 L110,34 Z" fill="#059669" />
          <path d="M112,34 L118,56 L124,50 L130,56 L124,34 Z" fill="#047857" />

          {/* Golden / Green Medal Seal */}
          <circle cx="111" cy="28" r="14" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="111" cy="28" r="11" fill="#15803d" />
          {/* Mini caduceus/emblem inside medal */}
          <polygon points="111,20 118,25 116,33 106,33 104,25" fill="#fef08a" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
};
