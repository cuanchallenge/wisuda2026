import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle,
  Clock,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Database,
  Menu,
  CheckCheck,
  AlertTriangle,
} from 'lucide-react';
import { formatDateTimeIndo } from '../utils/formatters';
import { SieAvatar } from './SieAvatar';
import { StibhaLogo } from './StibhaLogo';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onOpenSupabaseGuide: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onOpenSupabaseGuide,
  setActiveTab,
}) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isUsingSupabase,
    centralSummary,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPersonaPicker, setShowPersonaPicker] = useState(false);

  // Filter notifications relevant to current user
  const userNotifications = notifications.filter((n) => {
    if (n.target_user_id === currentUser.id) return true;
    if (n.target_role === currentUser.role) return true;
    if (currentUser.sie_id && n.target_sie_id === currentUser.sie_id) return true;
    return false;
  });

  const unreadCount = userNotifications.filter((n) => !n.is_read).length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return { label: 'BENDAHARA (SUPER ADMIN)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'koordinator_sie':
        return { label: 'KOORDINATOR SIE', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'viewer':
        return { label: 'KETUA / VIEWER', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: role, color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <StibhaLogo className="w-10 h-10 shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  WISUDA STIBHA
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono">
                  2026
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-1 font-medium hidden sm:block">
                Sistem Manajemen Keuangan Terpadu
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right quick pills */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Persona Switcher for Testing / Evaluation */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaPicker(!showPersonaPicker)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Ganti peran pengguna untuk simulasi"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Ganti Peran:</span>
              <span className="font-bold text-slate-900 max-w-[120px] truncate">
                {currentUser.role === 'super_admin' ? 'Bendahara' : currentUser.role === 'koordinator_sie' ? 'Koordinator' : 'Viewer'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showPersonaPicker && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Pilih Akun Simulasi Cepat
                </div>
                <div className="space-y-1 mt-1 max-h-72 overflow-y-auto">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setShowPersonaPicker(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                        currentUser.id === u.id
                          ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <SieAvatar user={u} size="sm" />
                      <div className="overflow-hidden flex-1">
                        <div className="truncate font-medium text-slate-900">{u.full_name}</div>
                        <div className="text-[10px] text-slate-500 capitalize">
                          {u.role.replace('_', ' ')}
                        </div>
                      </div>
                      {currentUser.id === u.id && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Database / Supabase indicator button */}
          <button
            onClick={onOpenSupabaseGuide}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all shadow-2xs ${
              isUsingSupabase
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Klik untuk konfigurasi Supabase & skrip SQL"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline font-mono text-[11px]">
              {isUsingSupabase ? 'Supabase Connected' : 'Supabase Ready'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-0 z-50 overflow-hidden animate-fade-in">
                <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    Notifikasi ({userNotifications.length})
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Tandai semua dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {userNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Belum ada notifikasi baru.
                    </div>
                  ) : (
                    userNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.link_to) {
                            setActiveTab(notif.link_to);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-3 text-xs transition-colors cursor-pointer flex gap-3 ${
                          notif.is_read ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/50 hover:bg-emerald-50'
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {notif.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          ) : notif.type === 'error' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                          ) : notif.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 leading-snug">
                            {notif.title}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {formatDateTimeIndo(notif.created_at)}
                          </span>
                        </div>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 self-center shrink-0"></span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile button */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <SieAvatar user={currentUser} size="md" />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 max-w-[140px] truncate">
                  {currentUser.full_name}
                </div>
                <div className="text-[10px] text-emerald-600 font-mono font-semibold leading-none truncate max-w-[140px]">
                  @{currentUser.username}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                <div className="p-3 border-b border-slate-100">
                  <div className="font-bold text-xs text-slate-900">{currentUser.full_name}</div>
                  <div className="text-[11px] text-emerald-700 font-mono font-semibold mt-0.5">@{currentUser.username}</div>
                  <div className="mt-2">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>
                </div>

                <div className="p-1 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-500" /> Profil Pengguna
                  </button>
                  <button
                    onClick={() => {
                      onOpenSupabaseGuide();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2"
                  >
                    <Database className="w-4 h-4 text-emerald-600" /> Database & Supabase
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('login');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" /> Keluar (Logout)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
