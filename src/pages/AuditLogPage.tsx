import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDateTimeIndo } from '../utils/formatters';
import {
  History,
  Shield,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
} from 'lucide-react';

export const AuditLogPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchSearch =
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchAction = actionFilter === 'ALL' || log.action.includes(actionFilter);
    return matchSearch && matchAction;
  });

  const getActionBadge = (action: string) => {
    if (action.includes('VERIFIKASI_SETUJU') || action.includes('APPROVE')) {
      return { label: action, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
    if (action.includes('TOLAK') || action.includes('REJECT') || action.includes('DELETE')) {
      return { label: action, color: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
    if (action.includes('PENCAIRAN') || action.includes('DISBURSEMENT')) {
      return { label: action, color: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
    if (action.includes('PEMASUKAN') || action.includes('INCOME')) {
      return { label: action, color: 'bg-teal-100 text-teal-800 border-teal-300' };
    }
    return { label: action, color: 'bg-slate-100 text-slate-800 border-slate-300' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-slate-700" />
            Audit Log &amp; Rekam Jejak Aktivitas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log permanen yang mencatat seluruh tindakan finansial untuk kepatuhan dan integritas data.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari user, transaksi, atau detail log..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 whitespace-nowrap">Filter Aksi:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
          >
            <option value="ALL">Semua Aksi</option>
            <option value="PEMASUKAN">Pemasukan</option>
            <option value="PENCAIRAN">Pencairan Dana</option>
            <option value="PENGELUARAN">Pengeluaran</option>
            <option value="VERIFIKASI">Verifikasi</option>
            <option value="USER">User Management</option>
          </select>
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              Tidak ada log aktivitas yang cocok.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = getActionBadge(log.action);

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="font-mono text-slate-400 text-[10px]">
                        ID: {log.entity_id}
                      </span>
                    </div>

                    <div className="text-slate-900 font-semibold text-xs leading-snug">
                      {log.details}
                    </div>

                    <div className="text-slate-500 text-[11px] flex items-center gap-2">
                      <span className="font-medium text-slate-700 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {log.user_name} ({log.user_role.replace('_', ' ')})
                      </span>
                    </div>
                  </div>

                  <div className="text-slate-400 text-[11px] whitespace-nowrap self-start sm:self-center font-mono">
                    {formatDateTimeIndo(log.created_at)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
