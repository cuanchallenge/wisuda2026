import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { StibhaLogo } from '../components/StibhaLogo';
import { WisudaHeroIllustration } from '../components/WisudaHeroIllustration';

interface LoginPageProps {
  onLoginSuccess: (role: string) => void;
  onOpenSupabaseGuide?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { users, setCurrentUser } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const foundUser = users.find(
        (u) =>
          (u.username && u.username.toLowerCase() === trimmedUser) ||
          (u.email && u.email.toLowerCase() === trimmedUser)
      );

      if (!foundUser) {
        setErrorMessage(`User login "${username}" tidak ditemukan dalam sistem kepanitiaan.`);
        setIsLoading(false);
        return;
      }

      if (!foundUser.is_active) {
        setErrorMessage('Akun ini dinonaktifkan oleh Bendahara Utama.');
        setIsLoading(false);
        return;
      }

      // Check password if set
      if (foundUser.password && foundUser.password !== password) {
        setErrorMessage('Kata sandi yang Anda masukkan salah. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      setCurrentUser(foundUser);
      setIsLoading(false);
      onLoginSuccess(foundUser.role);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#f3f9f5] flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      {/* Decorative Organic Green & Gold Wave Accents (Top-Left) */}
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 pointer-events-none select-none overflow-hidden z-0">
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-50,-50 C120,-20 180,80 140,220 C100,320 0,340 -50,320 Z"
            fill="#15803d"
            opacity="0.85"
          />
          <path
            d="M-50,-50 C80,20 140,110 80,240 C30,310 -30,290 -50,280 Z"
            fill="#22c55e"
            opacity="0.7"
          />
          <path
            d="M-50,80 C40,120 100,200 40,290 C-10,330 -50,310 -50,300 Z"
            fill="#eab308"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Decorative Organic Green & Gold Wave Accents (Bottom-Right) */}
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 pointer-events-none select-none overflow-hidden z-0">
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M450,450 C280,420 220,320 260,180 C300,80 400,60 450,80 Z"
            fill="#15803d"
            opacity="0.85"
          />
          <path
            d="M450,450 C320,380 260,290 320,160 C370,90 430,110 450,120 Z"
            fill="#22c55e"
            opacity="0.6"
          />
          <path
            d="M450,320 C360,280 300,200 360,110 C410,70 450,90 450,100 Z"
            fill="#eab308"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="w-full max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
        {/* Left Side: Brand Identity & Hero Artwork (Desktop & Tablet) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6 pt-2 lg:pt-0">
          {/* Header Branding */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="shrink-0 drop-shadow-md">
              <StibhaLogo className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#0d5939] tracking-wider text-xl sm:text-2xl uppercase">
                  WISUDA
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] font-mono border border-emerald-300">
                  TA 2026
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b432b] tracking-tight leading-none mt-1">
                STIBHA 2026
              </h1>
              {/* Yellow Accent Bar */}
              <div className="h-1.5 w-14 bg-amber-400 rounded-full mt-2.5 shadow-xs" />
            </div>
          </div>

          {/* Subtitle Description */}
          <p className="text-slate-600 text-xs sm:text-sm lg:text-base font-medium max-w-lg leading-relaxed">
            Halaman login ini digunakan untuk bendahara dan semua sie seksi. Sistem manajemen
            keuangan dan realisasi anggaran terpadu Wisuda STIKES Bhakti Al-Qodiri.
          </p>

          {/* 3D Graduation Cap & Financial Management Scene */}
          <div className="hidden sm:block">
            <WisudaHeroIllustration className="max-w-md lg:max-w-xl mx-auto lg:mx-0" />
          </div>

          {/* Mobile Badge Info */}
          <div className="sm:hidden flex items-center gap-2 p-3 rounded-2xl bg-white/80 border border-emerald-100 shadow-2xs text-xs text-emerald-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Portal Resmi Pengelolaan Keuangan Panitia Wisuda STIBHA</span>
          </div>
        </div>

        {/* Right Side: Floating White Login Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(5,150,105,0.18)] border border-slate-100/90 relative">
            {/* Center Logo */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="drop-shadow-md mb-2 hover:scale-105 transition-transform">
                <StibhaLogo className="w-16 h-16 sm:w-20 sm:h-20" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0b432b] tracking-tight">
                Selamat Datang
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">
                Silakan login untuk melanjutkan ke halaman keuangan wisuda.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-6 space-y-4 text-xs">
              {/* Field: Username */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 text-xs">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Masukkan username"
                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-xs sm:text-sm font-medium transition-all"
                    required
                  />
                </div>
              </div>

              {/* Field: Password */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 text-xs">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Masukkan password"
                    className="w-full pl-11 pr-11 py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-xs sm:text-sm font-medium transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#0f764a] hover:bg-[#0c623d] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-800/20 hover:shadow-xl transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Memverifikasi...
                  </span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Footer Info */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400 font-medium tracking-wide">
              Wisuda STIBHA 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
