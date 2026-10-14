import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  ArrowDownLeft,
  PieChart,
  ArrowUpRight,
  Receipt,
  CheckSquare,
  Users2,
  UserCog,
  FileQuestion,
  FileSpreadsheet,
  History,
  Settings,
  PlusCircle,
  Coins,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { SieAvatar } from './SieAvatar';
import { StibhaLogo } from './StibhaLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenSupabaseGuide: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  onOpenSupabaseGuide,
}) => {
  const { currentUser, centralSummary, getSieSummary, sies } = useApp();

  const currentSieSummary = currentUser.sie_id ? getSieSummary(currentUser.sie_id) : null;
  const currentSie = sies.find((s) => s.id === currentUser.sie_id);

  // Define nav links per role
  const getNavLinks = (): NavItem[] => {
    if (currentUser.role === 'super_admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'income', label: 'Pemasukan', icon: ArrowDownLeft },
        { id: 'budgets', label: 'Anggaran Sie', icon: PieChart },
        { id: 'disbursements', label: 'Pencairan Dana', icon: ArrowUpRight },
        { id: 'expenses', label: 'Pengeluaran', icon: Receipt },
        { id: 'management', label: 'Manajemen Sie & Pengguna', icon: Users2 },
        { id: 'fund-requests', label: 'Permintaan Dana', icon: FileQuestion },
        { id: 'reports', label: 'Laporan Keuangan', icon: FileSpreadsheet },
        { id: 'audit', label: 'Audit Log', icon: History },
        { id: 'settings', label: 'Pengaturan & DB', icon: Settings },
      ];
    } else if (currentUser.role === 'koordinator_sie') {
      return [
        { id: 'dashboard', label: 'Dashboard Sie', icon: LayoutDashboard },
        { id: 'add-expense', label: '+ Catat Pengeluaran', icon: PlusCircle, highlight: true },
        { id: 'expenses', label: 'Pengeluaran Sie', icon: Receipt },
        { id: 'budgets', label: 'Anggaran Saya', icon: PieChart },
        { id: 'fund-requests', label: 'Permintaan Dana', icon: FileQuestion },
        { id: 'reports', label: 'Laporan Sie', icon: FileSpreadsheet },
        { id: 'profile', label: 'Profil Sie', icon: Users2 },
      ];
    } else {
      // Viewer
      return [
        { id: 'dashboard', label: 'Dashboard Eksekutif', icon: LayoutDashboard },
        { id: 'sie-monitoring', label: 'Monitoring Seluruh Sie', icon: Building },
        { id: 'reports', label: 'Laporan Keuangan', icon: FileSpreadsheet },
        { id: 'audit', label: 'Audit Log Transaksi', icon: History },
      ];
    }
  };

  const navLinks = getNavLinks();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-0 max-lg:-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <StibhaLogo className="w-8 h-8 shrink-0 drop-shadow-sm" />
            <div>
              <span className="font-bold text-white text-sm tracking-tight block">
                WISUDA FINANCE
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-medium block">
                STIBHA TAHUN 2026
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* User Mini Role Card */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/30">
          <div className="flex items-center gap-3">
            <SieAvatar user={currentUser} sie={currentSie} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                {currentUser.full_name}
              </div>
              <div className="text-[10px] text-emerald-400 font-medium truncate flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                {currentUser.role === 'super_admin'
                  ? 'Bendahara Utama'
                  : currentUser.role === 'koordinator_sie'
                  ? currentSie?.name || 'Koordinator'
                  : 'Ketua / Viewer'}
              </div>
            </div>
          </div>

          {/* Quick Balance Preview Card in Sidebar */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 flex items-center justify-between font-medium">
              <span>{currentUser.role === 'koordinator_sie' ? 'Sisa Kas Sie Anda:' : 'Saldo Kas Pusat:'}</span>
              <Coins className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white font-mono mt-1">
              {currentUser.role === 'koordinator_sie' && currentSieSummary
                ? formatRupiah(currentSieSummary.remaining_balance)
                : formatRupiah(centralSummary.central_cash_balance)}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Menu Utama
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  item.highlight
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm'
                    : isActive
                    ? 'bg-emerald-500/15 text-emerald-400 font-semibold border-l-3 border-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      item.highlight
                        ? 'text-white'
                        : isActive
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between">
          <span>v2.6 • Vercel Ready</span>
          <button
            onClick={onOpenSupabaseGuide}
            className="text-emerald-400 hover:underline font-mono text-[10px]"
          >
            Supabase DB
          </button>
        </div>
      </aside>
    </>
  );
};
