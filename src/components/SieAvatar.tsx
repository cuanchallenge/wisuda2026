import React from 'react';
import {
  UserRound,
  UserCheck,
  LucideIcon,
} from 'lucide-react';
import { UserProfile, Sie } from '../types';

interface SieAvatarProps {
  user?: Partial<UserProfile> | null;
  sie?: Partial<Sie> | null;
  sieName?: string;
  role?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Harmonious palette list for dynamic automatic coloring of any newly created Sie
const DYNAMIC_PALETTES = [
  { bgClass: 'bg-emerald-100', textClass: 'text-emerald-800', borderClass: 'border-emerald-300' },
  { bgClass: 'bg-sky-100', textClass: 'text-sky-800', borderClass: 'border-sky-300' },
  { bgClass: 'bg-purple-100', textClass: 'text-purple-800', borderClass: 'border-purple-300' },
  { bgClass: 'bg-rose-100', textClass: 'text-rose-800', borderClass: 'border-rose-300' },
  { bgClass: 'bg-amber-100', textClass: 'text-amber-800', borderClass: 'border-amber-300' },
  { bgClass: 'bg-indigo-100', textClass: 'text-indigo-800', borderClass: 'border-indigo-300' },
  { bgClass: 'bg-teal-100', textClass: 'text-teal-800', borderClass: 'border-teal-300' },
  { bgClass: 'bg-cyan-100', textClass: 'text-cyan-800', borderClass: 'border-cyan-300' },
  { bgClass: 'bg-violet-100', textClass: 'text-violet-800', borderClass: 'border-violet-300' },
  { bgClass: 'bg-fuchsia-100', textClass: 'text-fuchsia-800', borderClass: 'border-fuchsia-300' },
  { bgClass: 'bg-lime-100', textClass: 'text-lime-800', borderClass: 'border-lime-300' },
  { bgClass: 'bg-orange-100', textClass: 'text-orange-800', borderClass: 'border-orange-300' },
];

export const getSieIconAndColors = (sieCodeOrName?: string, role?: string): {
  icon: LucideIcon;
  bgClass: string;
  textClass: string;
  borderClass: string;
  label: string;
} => {
  const normalized = (sieCodeOrName || '').toLowerCase();

  // 1. By Role: Bendahara Kas Pusat
  if (role === 'super_admin' || normalized.includes('bendahara') || normalized.includes('kas') || normalized.includes('keuangan')) {
    return {
      icon: UserCheck, // Icon avatar orang (Bendahara Kas Pusat terverifikasi)
      bgClass: 'bg-emerald-100',
      textClass: 'text-emerald-800',
      borderClass: 'border-emerald-300 ring-2 ring-emerald-500/20',
      label: 'Bendahara (Kas Pusat)',
    };
  }

  // 2. By Role: Ketua Panitia / Viewer
  if (role === 'viewer' || normalized.includes('ketua') || normalized.includes('senat') || normalized.includes('rektor')) {
    return {
      icon: UserRound, // Icon avatar orang
      bgClass: 'bg-amber-100',
      textClass: 'text-amber-800',
      borderClass: 'border-amber-300 ring-2 ring-amber-500/20',
      label: 'Ketua Panitia Wisuda',
    };
  }

  // 3. Known Sie Categories: All using icon avatar orang with distinct color schemes
  if (normalized.includes('konsumsi') || normalized.includes('makan') || normalized.includes('snack') || normalized.includes('catering')) {
    return {
      icon: UserRound,
      bgClass: 'bg-orange-100',
      textClass: 'text-orange-700',
      borderClass: 'border-orange-200 ring-1 ring-orange-400/20',
      label: 'Koordinator Sie Konsumsi',
    };
  }

  if (normalized.includes('perlengkapan') || normalized.includes('logistik') || normalized.includes('perkap') || normalized.includes('sarpras') || normalized.includes('alat')) {
    return {
      icon: UserRound,
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-700',
      borderClass: 'border-blue-200 ring-1 ring-blue-400/20',
      label: 'Koordinator Sie Perlengkapan & Logistik',
    };
  }

  if (normalized.includes('acara') || normalized.includes('protokoler') || normalized.includes('mc') || normalized.includes('rundown') || normalized.includes('pemandu')) {
    return {
      icon: UserRound,
      bgClass: 'bg-purple-100',
      textClass: 'text-purple-700',
      borderClass: 'border-purple-200 ring-1 ring-purple-400/20',
      label: 'Koordinator Sie Acara & Protokoler',
    };
  }

  if (normalized.includes('dok') || normalized.includes('foto') || normalized.includes('video') || normalized.includes('multimedia') || normalized.includes('media')) {
    return {
      icon: UserRound,
      bgClass: 'bg-cyan-100',
      textClass: 'text-cyan-700',
      borderClass: 'border-cyan-200 ring-1 ring-cyan-400/20',
      label: 'Koordinator Sie Dokumentasi & Media',
    };
  }

  if (normalized.includes('humas') || normalized.includes('publikasi') || normalized.includes('komunikasi') || normalized.includes('relasi')) {
    return {
      icon: UserRound,
      bgClass: 'bg-teal-100',
      textClass: 'text-teal-700',
      borderClass: 'border-teal-200 ring-1 ring-teal-400/20',
      label: 'Koordinator Sie Humas & Publikasi',
    };
  }

  if (normalized.includes('aman') || normalized.includes('parkir') || normalized.includes('tertib') || normalized.includes('keamanan') || normalized.includes('security')) {
    return {
      icon: UserRound,
      bgClass: 'bg-indigo-100',
      textClass: 'text-indigo-700',
      borderClass: 'border-indigo-200 ring-1 ring-indigo-400/20',
      label: 'Koordinator Sie Keamanan & Ketertiban',
    };
  }

  if (normalized.includes('dekor') || normalized.includes('taman') || normalized.includes('panggung') || normalized.includes('estetika') || normalized.includes('desain')) {
    return {
      icon: UserRound,
      bgClass: 'bg-rose-100',
      textClass: 'text-rose-700',
      borderClass: 'border-rose-200 ring-1 ring-rose-400/20',
      label: 'Koordinator Sie Dekorasi & Panggung',
    };
  }

  if (normalized.includes('trans') || normalized.includes('kendaraan') || normalized.includes('mobil') || normalized.includes('bus') || normalized.includes('driver')) {
    return {
      icon: UserRound,
      bgClass: 'bg-amber-100',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-200 ring-1 ring-amber-400/20',
      label: 'Koordinator Sie Transportasi & Akomodasi',
    };
  }

  if (normalized.includes('medis') || normalized.includes('sehat') || normalized.includes('kesehatan') || normalized.includes('p3k') || normalized.includes('dokter')) {
    return {
      icon: UserRound,
      bgClass: 'bg-red-100',
      textClass: 'text-red-700',
      borderClass: 'border-red-200 ring-1 ring-red-400/20',
      label: 'Koordinator Sie Kesehatan & Medis',
    };
  }

  if (normalized.includes('sekret') || normalized.includes('admin') || normalized.includes('surat') || normalized.includes('registrasi') || normalized.includes('notulen') || normalized.includes('presensi') || normalized.includes('undangan')) {
    return {
      icon: UserRound,
      bgClass: 'bg-sky-100',
      textClass: 'text-sky-700',
      borderClass: 'border-sky-200 ring-1 ring-sky-400/20',
      label: 'Koordinator Sie Kesekretariatan & Administrasi',
    };
  }

  if (normalized.includes('danus') || normalized.includes('dana') || normalized.includes('sponsor') || normalized.includes('usaha')) {
    return {
      icon: UserRound,
      bgClass: 'bg-yellow-100',
      textClass: 'text-yellow-800',
      borderClass: 'border-yellow-200 ring-1 ring-yellow-400/20',
      label: 'Koordinator Sie Dana & Usaha',
    };
  }

  if (normalized.includes('bersih') || normalized.includes('sampah') || normalized.includes('kebersihan')) {
    return {
      icon: UserRound,
      bgClass: 'bg-lime-100',
      textClass: 'text-lime-700',
      borderClass: 'border-lime-200 ring-1 ring-lime-400/20',
      label: 'Koordinator Sie Kebersihan & Lingkungan',
    };
  }

  if (normalized.includes('doa') || normalized.includes('rohani') || normalized.includes('ibadah')) {
    return {
      icon: UserRound,
      bgClass: 'bg-violet-100',
      textClass: 'text-violet-700',
      borderClass: 'border-violet-200 ring-1 ring-violet-400/20',
      label: 'Koordinator Sie Kerohanian & Doa',
    };
  }

  if (normalized.includes('it') || normalized.includes('sistem') || normalized.includes('teknologi') || normalized.includes('web') || normalized.includes('operator')) {
    return {
      icon: UserRound,
      bgClass: 'bg-slate-200',
      textClass: 'text-slate-800',
      borderClass: 'border-slate-300 ring-1 ring-slate-400/20',
      label: 'Koordinator Sie IT & Multimedia',
    };
  }

  // 4. Default & For any newly added Sie: Automatically uses Person Avatar Icon (icon avatar orang)
  // Dynamic deterministic coloring from DYNAMIC_PALETTES based on sie name / code
  let palette = DYNAMIC_PALETTES[0];
  if (normalized.trim()) {
    const hash = normalized.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    palette = DYNAMIC_PALETTES[hash % DYNAMIC_PALETTES.length];
  }

  return {
    icon: UserRound, // Otomatis icon avatar orang untuk setiap penambahan sie baru
    bgClass: palette.bgClass,
    textClass: palette.textClass,
    borderClass: `${palette.borderClass} ring-1 ring-slate-400/20`,
    label: sieCodeOrName ? `Koordinator ${sieCodeOrName}` : 'Panitia Wisuda',
  };
};

export const SieAvatar: React.FC<SieAvatarProps> = ({
  user,
  sie,
  sieName,
  role,
  size = 'md',
  className = '',
}) => {
  const nameToMatch = sie?.name || sieName || user?.full_name || '';
  const roleToMatch = role || user?.role;
  const config = getSieIconAndColors(nameToMatch, roleToMatch);
  const IconComponent = config.icon;

  const sizeClasses = {
    xs: 'w-6 h-6 rounded-full',
    sm: 'w-7 h-7 rounded-full',
    md: 'w-8 h-8 rounded-full',
    lg: 'w-10 h-10 rounded-full',
    xl: 'w-14 h-14 sm:w-16 sm:h-16 rounded-full',
  }[size];

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5.5 h-5.5',
    xl: 'w-8 h-8 sm:w-9 sm:h-9',
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 border shadow-2xs transition-transform ${sizeClasses} ${config.bgClass} ${config.textClass} ${config.borderClass} ${className}`}
      title={config.label}
    >
      <IconComponent className={iconSizes} strokeWidth={2} />
    </div>
  );
};
