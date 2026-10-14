import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import {
  ShieldAlert,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Building,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Printer,
} from 'lucide-react';

interface DashboardViewerProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardViewer: React.FC<DashboardViewerProps> = ({ setActiveTab }) => {
  const { centralSummary, allSieSummaries, incomes, disbursements, expenses } = useApp();

  return (
    <div className="space-y-6">
      {/* Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-300" />
              Mode Monitoring Eksekutif (Ketua Panitia / Pengawas)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Transparansi Keuangan Wisuda STIBHA 2026
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Portal pengawasan resmi untuk memastikan akuntabilitas, ketertiban anggaran, dan kelancaran aliran dana kepanitiaan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('reports')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" /> Buka Laporan Keuangan
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" /> Cetak Ringkasan
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Kas Tersedia (Pusat)</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-2">
            {formatRupiah(centralSummary.central_cash_balance)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Saldo likuid di bendahara</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Total Pemasukan</span>
            <ArrowDownLeft className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2">
            {formatRupiah(centralSummary.total_income)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{incomes.filter((i) => !i.deleted_at).length} Sumber penerimaan</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Dana Telah Dicairkan</span>
            <ArrowUpRight className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2">
            {formatRupiah(centralSummary.total_disbursed)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{disbursements.filter((d) => !d.deleted_at).length} Penyaluran ke seksi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Pengeluaran Terverifikasi</span>
            <Receipt className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2">
            {formatRupiah(centralSummary.total_expenses_approved)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Disertai bukti nota & kwitansi sah</p>
        </div>
      </div>

      {/* Realisasi Anggaran per Sie Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Building className="w-4 h-4 text-emerald-600" />
          Matriks Realisasi Anggaran per Seksi
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Status penyerapan anggaran secara keseluruhan untuk evaluasi pimpinan
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Nama Seksi</th>
                <th className="py-3 px-3">Plafon Anggaran</th>
                <th className="py-3 px-3">Dana Dicairkan</th>
                <th className="py-3 px-3">Pengeluaran Real</th>
                <th className="py-3 px-3">Sisa Kas di Seksi</th>
                <th className="py-3 px-3 text-center">Realisasi Plafon</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allSieSummaries.map((s) => (
                <tr key={s.sie.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {s.sie.name}
                    <span className="block text-[10px] text-slate-400 font-mono font-normal">
                      {s.sie.code}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800">{formatRupiah(s.budget)}</td>
                  <td className="py-3 px-3 font-mono text-blue-700">{formatRupiah(s.disbursed)}</td>
                  <td className="py-3 px-3 font-mono text-rose-700 font-bold">
                    {formatRupiah(s.total_expenses_approved)}
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-700 font-bold">
                    {formatRupiah(s.remaining_balance)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 justify-center">
                      <span className="font-mono font-bold text-slate-800 text-[11px]">
                        {s.budget_utilization_rate}%
                      </span>
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            s.status === 'danger'
                              ? 'bg-rose-500'
                              : s.status === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, s.budget_utilization_rate)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'danger'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : s.status === 'warning'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {s.status === 'danger' ? 'Kritis' : s.status === 'warning' ? 'Waspada' : 'Aman'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
