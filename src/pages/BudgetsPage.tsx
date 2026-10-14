import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, parseRupiahInput } from '../utils/formatters';
import {
  PieChart,
  Edit3,
  Building,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  const { sies, budgets, updateBudget, currentUser, allSieSummaries, getSieSummary } = useApp();
  const [editingSieId, setEditingSieId] = useState<string | null>(null);
  const [editAmountStr, setEditAmountStr] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const isSuperAdmin = currentUser.role === 'super_admin';

  // For coordinator, only show their Sie; for admin/viewer, show all
  const displayedSummaries =
    currentUser.role === 'koordinator_sie' && currentUser.sie_id
      ? allSieSummaries.filter((s) => s.sie.id === currentUser.sie_id)
      : allSieSummaries;

  const totalAllocated = displayedSummaries.reduce((acc, s) => acc + s.budget, 0);
  const totalDisbursed = displayedSummaries.reduce((acc, s) => acc + s.disbursed, 0);
  const totalExpenses = displayedSummaries.reduce((acc, s) => acc + s.total_expenses_approved, 0);

  const startEdit = (sieId: string) => {
    const current = budgets.find((b) => b.sie_id === sieId);
    setEditingSieId(sieId);
    setEditAmountStr(current ? current.allocated_amount.toLocaleString('id-ID') : '0');
    setEditNotes(current?.notes || '');
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSieId) return;

    const numeric = parseRupiahInput(editAmountStr);
    const sieName = sies.find((s) => s.id === editingSieId)?.name || 'Seksi';
    updateBudget(editingSieId, numeric, editNotes);
    setToastMsg(`Plafon anggaran untuk ${sieName} berhasil diubah menjadi ${formatRupiah(numeric)}!`);
    setTimeout(() => setToastMsg(''), 3000);
    setEditingSieId(null);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in border border-emerald-500">
          <CheckCircle className="w-4 h-4 text-white shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <PieChart className="w-6 h-6 text-emerald-600" />
            Modul Plafon Anggaran Sie
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Penetapan batas alokasi dana per seksi kepanitiaan Wisuda STIBHA 2026.
          </p>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Plafon Anggaran</span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2">
            {formatRupiah(totalAllocated)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total alokasi seluruh seksi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Dana Telah Dicairkan</span>
          <div className="text-2xl font-black font-mono text-blue-700 mt-2">
            {formatRupiah(totalDisbursed)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Telah ditransfer ke rekening seksi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Realisasi Pengeluaran</span>
          <div className="text-2xl font-black font-mono text-rose-700 mt-2">
            {formatRupiah(totalExpenses)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Pengeluaran sah dengan nota valid</p>
        </div>
      </div>

      {/* Budget List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            Daftar Alokasi &amp; Realisasi Anggaran Tiap Sie
          </h2>
          {isSuperAdmin && (
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Bendahara dapat mengubah plafon
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Nama Seksi</th>
                <th className="py-3.5 px-4">Plafon Anggaran</th>
                <th className="py-3.5 px-4">Dana Dicairkan</th>
                <th className="py-3.5 px-4">Total Pengeluaran</th>
                <th className="py-3.5 px-4">Sisa Dana Riil</th>
                <th className="py-3.5 px-4 text-center">Penggunaan (%)</th>
                {isSuperAdmin && <th className="py-3.5 px-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedSummaries.map((summary) => (
                <tr key={summary.sie.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{summary.sie.name}</div>
                    <span className="text-[10px] font-mono text-slate-400">{summary.sie.code}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                    {formatRupiah(summary.budget)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-700">
                    {formatRupiah(summary.disbursed)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-700">
                    {formatRupiah(summary.total_expenses_approved)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    {formatRupiah(summary.remaining_balance)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold font-mono text-slate-900">
                        {summary.budget_utilization_rate}%
                      </span>
                      <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${
                            summary.status === 'danger'
                              ? 'bg-rose-500'
                              : summary.status === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, summary.budget_utilization_rate)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  {isSuperAdmin && (
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => startEdit(summary.sie.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold inline-flex items-center gap-1 text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit Plafon
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Plafon */}
      {editingSieId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Ubah Alokasi Plafon Anggaran
              </h3>
              <button
                onClick={() => setEditingSieId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Seksi
                </label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800">
                  {sies.find((s) => s.id === editingSieId)?.name}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Plafon Anggaran (Nominal Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold font-mono text-slate-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={editAmountStr}
                    onChange={(e) => {
                      const val = parseRupiahInput(e.target.value);
                      setEditAmountStr(val > 0 ? val.toLocaleString('id-ID') : '');
                    }}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:outline-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Catatan Alokasi (Opsional)
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={2}
                  placeholder="Peruntukan anggaran..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSieId(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
