import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import {
  Receipt,
  Search,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react';
import { ExpenseTransaction } from '../types';
import { ReceiptPreviewModal } from '../components/ReceiptModals';

interface ExpensesPageProps {
  setActiveTab: (tab: string) => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ setActiveTab }) => {
  const { expenses, sies, currentUser, deleteExpense } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sieFilter, setSieFilter] = useState<string>('ALL');
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<ExpenseTransaction | null>(null);

  // Isolation check: Koordinator can only see their own Sie transactions!
  const filteredExpenses = expenses.filter((e) => {
    if (e.deleted_at) return false;

    if (currentUser.role === 'koordinator_sie' && currentUser.sie_id) {
      if (e.sie_id !== currentUser.sie_id) return false;
    } else if (sieFilter !== 'ALL' && e.sie_id !== sieFilter) {
      return false;
    }

    const sie = sies.find((s) => s.id === e.sie_id);
    const matchSearch =
      e.transaction_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sie && sie.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchSearch;
  });

  const handleDelete = (tx: ExpenseTransaction) => {
    if (confirm(`Yakin ingin menghapus transaksi [${tx.transaction_no}] "${tx.item_name}"?`)) {
      deleteExpense(tx.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            Daftar Pengeluaran &amp; Nota
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentUser.role === 'koordinator_sie'
              ? 'Seluruh riwayat pengeluaran kas seksi Anda yang telah tercatat.'
              : 'Seluruh transaksi pengeluaran riil panitia wisuda.'}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('add-expense')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 self-start"
        >
          <Plus className="w-4 h-4" /> + Catat Pengeluaran Baru
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari transaksi, barang..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {currentUser.role !== 'koordinator_sie' && (
            <select
              value={sieFilter}
              onChange={(e) => setSieFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
            >
              <option value="ALL">Semua Seksi</option>
              {sies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}

          <div className="text-xs text-slate-500 font-medium px-2">
            Total: <span className="font-bold text-slate-800">{filteredExpenses.length} Transaksi</span>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">No. Transaksi</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Seksi</th>
                <th className="py-3.5 px-4">Nama Barang / Uraian</th>
                <th className="py-3.5 px-4">Nominal</th>
                <th className="py-3.5 px-4 text-center">Bukti Nota</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Tidak ada pengeluaran yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const isBendahara = exp.sie_id === 'sie-bendahara' || exp.sie_id === 'BENDAHARA';
                  const sie = sies.find((s) => s.id === exp.sie_id) || (isBendahara ? { name: 'Bendahara (Kas Pusat)', code: 'BENDAHARA' } : undefined);

                  return (
                    <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {exp.transaction_no}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {formatDateIndo(exp.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 block">{sie?.name}</span>
                          {isBendahara && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Kas Pusat
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{sie?.code}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{exp.item_name}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{exp.description}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm whitespace-nowrap">
                        {formatRupiah(exp.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {exp.receipts && exp.receipts.length > 0 ? (
                          <button
                            onClick={() => setSelectedTxForReceipt(exp)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> Lihat Nota
                          </button>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {currentUser.role !== 'viewer' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(exp)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 font-semibold text-xs transition-colors border border-rose-200 shadow-2xs"
                            title="Hapus Transaksi Pengeluaran (Salah Input)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
