import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Building,
  Plus,
  Eye,
  FileCheck,
  ChevronRight,
  Receipt,
  Trash2,
} from 'lucide-react';
import { ReceiptPreviewModal } from '../components/ReceiptModals';
import { ExpenseTransaction, IncomeTransaction } from '../types';

interface DashboardAdminProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({ setActiveTab }) => {
  const { centralSummary, allSieSummaries, expenses, incomes, disbursements, deleteExpense, deleteIncome } = useApp();
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<ExpenseTransaction | null>(null);

  const recentExpenses = expenses.filter((e) => !e.deleted_at).slice(0, 5);
  const recentIncomes = incomes.filter((i) => !i.deleted_at).slice(0, 5);

  const handleDeleteExpense = (exp: ExpenseTransaction) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus transaksi pengeluaran [${exp.transaction_no}] "${exp.item_name}" sebesar ${formatRupiah(exp.amount)}?\n\nTindakan ini untuk menghapus atau mengoreksi kesalahan input.`
      )
    ) {
      deleteExpense(exp.id);
    }
  };

  const handleDeleteIncome = (inc: IncomeTransaction) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus transaksi pemasukan [${inc.transaction_no}] dari "${inc.source}" sebesar ${formatRupiah(inc.amount)}?\n\nTindakan ini untuk menghapus atau mengoreksi kesalahan input.`
      )
    ) {
      deleteIncome(inc.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Utama Bendahara
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitoring keuangan, arus kas, realisasi anggaran per seksi, dan transaksi panitia wisuda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('income')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Catat Pemasukan
          </button>
          <button
            onClick={() => setActiveTab('disbursements')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" /> Cairkan Dana
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL PEMASUKAN */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Pemasukan
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-3">
            {formatRupiah(centralSummary.total_income)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{incomes.filter((i) => !i.deleted_at).length} Transaksi Tercatat</span>
          </div>
        </div>

        {/* Card 2: SALDO KAS PUSAT */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
              Saldo Kas Tersedia
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center backdrop-blur-xs">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-3">
            {formatRupiah(centralSummary.central_cash_balance)}
          </div>
          <div className="text-[11px] text-emerald-100 font-medium mt-1">
            Pemasukan dikurangi seluruh dana yang telah dicairkan
          </div>
        </div>

        {/* Card 3: TOTAL DANA DICAIRKAN */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Dana Dicairkan
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-3">
            {formatRupiah(centralSummary.total_disbursed)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {disbursements.filter((d) => !d.deleted_at).length} Tahap transfer ke seluruh seksi
          </div>
        </div>

        {/* Card 4: TOTAL PENGELUARAN */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Pengeluaran Real
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-3">
            {formatRupiah(centralSummary.total_expenses_approved)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {expenses.length} Transaksi belanja panitia
          </div>
        </div>
      </div>

      {/* Row 2: Anggaran & Dana Belum Terpakai */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* TOTAL ANGGARAN PLAFON */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Plafon Anggaran
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {formatRupiah(centralSummary.total_budget_allocated)}
            </div>
            <div className="text-[11px] text-slate-500">Alokasi seluruh seksi kepanitiaan</div>
          </div>
        </div>

        {/* DANA BELUM TERPAKAI DI SIE */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Dana Belum Terpakai di Sie
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {formatRupiah(centralSummary.unused_disbursed_funds)}
            </div>
            <div className="text-[11px] text-slate-500">Sisa saldo dipegang koordinator seksi</div>
          </div>
        </div>
      </div>

      {/* Monitoring Realisasi Anggaran per Sie */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              Monitoring Realisasi Anggaran Seluruh Sie
            </h2>
            <p className="text-xs text-slate-500">
              Indikator warna: <span className="text-emerald-700 font-semibold">Hijau (&lt;75% Aman)</span>,{' '}
              <span className="text-amber-700 font-semibold">Kuning (75-90% Mendekati batas)</span>,{' '}
              <span className="text-rose-700 font-semibold">Merah (&gt;90% / Melebihi batas)</span>
            </p>
          </div>
          <button
            onClick={() => setActiveTab('budgets')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start"
          >
            Kelola Plafon Anggaran <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {allSieSummaries.map((summary) => {
            const statusConfig = {
              safe: {
                badge: 'Aman',
                badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                barClass: 'bg-emerald-500',
                borderClass: 'border-slate-200 hover:border-emerald-300',
              },
              warning: {
                badge: 'Mendekati Batas',
                badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
                barClass: 'bg-amber-500',
                borderClass: 'border-amber-300 bg-amber-50/20',
              },
              danger: {
                badge: 'Kritis / Melebihi',
                badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
                barClass: 'bg-rose-500',
                borderClass: 'border-rose-300 bg-rose-50/20',
              },
            }[summary.status];

            return (
              <div
                key={summary.sie.id}
                className={`p-4 rounded-xl border transition-all ${statusConfig.borderClass} bg-white shadow-2xs`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{summary.sie.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{summary.sie.code}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusConfig.badgeClass}`}>
                    {statusConfig.badge}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs mt-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Plafon Anggaran:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {formatRupiah(summary.budget)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Dana Dicairkan:</span>
                    <span className="font-semibold text-blue-700 font-mono">
                      {formatRupiah(summary.disbursed)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Terpakai:</span>
                    <span className="font-bold text-rose-700 font-mono">
                      {formatRupiah(summary.total_expenses_approved)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 border-t border-slate-100 pt-1">
                    <span className="font-medium text-slate-700">Sisa Kas di Sie:</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {formatRupiah(summary.remaining_balance)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-medium">Realisasi Plafon</span>
                    <span className="font-bold font-mono text-slate-800">
                      {summary.budget_utilization_rate}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statusConfig.barClass}`}
                      style={{ width: `${Math.min(100, summary.budget_utilization_rate)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Incomes */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                Pemasukan Kas Terkini
              </h3>
              <p className="text-xs text-slate-500">Histori penerimaan dana kas wisuda</p>
            </div>
            <button
              onClick={() => setActiveTab('income')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-2.5">
            {recentIncomes.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Belum ada transaksi pemasukan kas yang dicatat.
              </div>
            ) : (
              recentIncomes.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 truncate">{inc.source}</div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                      <span>{formatDateIndo(inc.date)}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{inc.transaction_no}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div>
                      <div className="font-bold font-mono text-emerald-700 text-sm">
                        {formatRupiah(inc.amount)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{inc.category}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteIncome(inc)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus Transaksi Pemasukan (Salah Input)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Expenses Log */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Pengeluaran Terkini
              </h3>
              <p className="text-xs text-slate-500">Histori belanja seluruh seksi</p>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-2.5">
            {recentExpenses.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Belum ada transaksi pengeluaran belanja yang dicatat.
              </div>
            ) : (
              recentExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 truncate">{exp.item_name}</div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                      <span>{formatDateIndo(exp.date)}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{exp.transaction_no}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div>
                      <div className="font-bold font-mono text-slate-900">{formatRupiah(exp.amount)}</div>
                      <span className="text-[10px] text-slate-400 font-medium">{exp.category}</span>
                    </div>

                    {exp.receipts && exp.receipts.length > 0 && (
                      <button
                        onClick={() => setSelectedTxForReceipt(exp)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
                        title="Lihat Nota"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(exp)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus Transaksi Pengeluaran (Salah Input)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      {selectedTxForReceipt && selectedTxForReceipt.receipts[0] && (
        <ReceiptPreviewModal
          isOpen={Boolean(selectedTxForReceipt)}
          onClose={() => setSelectedTxForReceipt(null)}
          receipt={selectedTxForReceipt.receipts[0]}
          transaction={selectedTxForReceipt}
        />
      )}
    </div>
  );
};
