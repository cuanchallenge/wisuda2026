import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import {
  Wallet,
  ArrowUpRight,
  Receipt,
  AlertCircle,
  PlusCircle,
  FileQuestion,
  Eye,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { ReceiptPreviewModal } from '../components/ReceiptModals';
import { ExpenseTransaction } from '../types';

interface DashboardSieProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardSie: React.FC<DashboardSieProps> = ({ setActiveTab }) => {
  const { currentUser, getSieSummary, expenses, deleteExpense, sies } = useApp();
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<ExpenseTransaction | null>(null);

  const sieId = currentUser.sie_id || 'sie-002'; // fallback to konsumsi for demo
  const summary = getSieSummary(sieId);
  const currentSie = sies.find((s) => s.id === sieId);

  // Filter only transactions belonging to this Sie (Security isolation)
  const sieExpenses = expenses.filter((e) => e.sie_id === sieId && !e.deleted_at);

  const handleDelete = (tx: ExpenseTransaction) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus transaksi pengeluaran [${tx.transaction_no}] "${tx.item_name}" sebesar ${formatRupiah(tx.amount)}?\n\nTindakan ini untuk menghapus atau mengoreksi kesalahan input.`
      )
    ) {
      deleteExpense(tx.id);
    }
  };

  if (!summary || !currentSie) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h3 className="font-bold text-slate-800">Sie Belum Ditugaskan</h3>
        <p className="text-xs text-slate-500 mt-1">
          Akun Anda belum dihubungkan ke salah satu Seksi. Hubungi Bendahara Utama.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner with Sie Identity */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                {currentSie.code}
              </span>
              <span className="text-xs text-slate-400">Portal Keuangan Panitia</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentSie.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {currentSie.description || 'Kelola pencairan, catat nota pengeluaran, dan pantau sisa kas seksi secara realtime.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('add-expense')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" /> + Catat Pengeluaran
            </button>
            <button
              onClick={() => setActiveTab('fund-requests')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-xs transition-colors"
            >
              <FileQuestion className="w-4 h-4" /> Minta Tambahan Dana
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SISA DANA (Highlighted) */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
              Sisa Kas Sie Anda
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-3">
            {formatRupiah(summary.remaining_balance)}
          </div>
          <p className="text-[11px] text-emerald-100 mt-1">
            Dana Diterima - Total Pengeluaran
          </p>
        </div>

        {/* DANA DITERIMA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dana Diterima
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-3">
            {formatRupiah(summary.disbursed)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Dicairkan oleh Bendahara Pusat
          </p>
        </div>

        {/* TOTAL PENGELUARAN */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Pengeluaran
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-3">
            {formatRupiah(summary.total_expenses_approved)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total biaya belanja seksi
          </p>
        </div>

        {/* TOTAL ANGGARAN PLAFON */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Plafon Anggaran
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-3">
            {formatRupiah(summary.budget)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Plafon maksimal untuk {currentSie.name}
          </p>
        </div>
      </div>

      {/* Progress Bar Penggunaan Anggaran */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Tingkat Penggunaan Plafon Anggaran
            </h3>
            <p className="text-xs text-slate-500">
              Realisasi pengeluaran riil dibandingkan batas alokasi anggaran
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black font-mono text-slate-900">
              {summary.budget_utilization_rate}%
            </span>
            <span className="text-xs text-slate-500 ml-1">terpakai</span>
          </div>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-3">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              summary.budget_utilization_rate > 90
                ? 'bg-rose-500'
                : summary.budget_utilization_rate > 75
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, summary.budget_utilization_rate)}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-mono">
          <span>Terpakai: {formatRupiah(summary.total_expenses_approved)}</span>
          <span>Plafon: {formatRupiah(summary.budget)}</span>
        </div>
      </div>

      {/* Riwayat Transaksi Sie Terkini */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Riwayat Pengeluaran {currentSie.name}
            </h3>
            <p className="text-xs text-slate-500">Daftar transaksi belanja seksi</p>
          </div>
          <button
            onClick={() => setActiveTab('expenses')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Lihat Semua ({sieExpenses.length})
          </button>
        </div>

        <div className="space-y-3">
          {sieExpenses.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
              Belum ada pengeluaran yang dicatat. Klik tombol di atas untuk mencatat nota baru.
            </div>
          ) : (
            sieExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">
                      {exp.transaction_no}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {formatDateIndo(exp.date)}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1">{exp.item_name}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Kategori: {exp.category} • Metode: {exp.payment_method}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className="font-bold font-mono text-base text-slate-900">
                    {formatRupiah(exp.amount)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {exp.receipts && exp.receipts.length > 0 && (
                      <button
                        onClick={() => setSelectedTxForReceipt(exp)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Lihat Nota
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(exp)}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-semibold flex items-center gap-1 border border-rose-200 transition-colors"
                      title="Hapus Pengeluaran (Salah Input)"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Receipt Modal */}
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
