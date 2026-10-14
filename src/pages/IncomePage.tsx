import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDateIndo, parseRupiahInput } from '../utils/formatters';
import {
  ArrowDownLeft,
  Plus,
  Search,
  Calendar,
  FileText,
  UploadCloud,
  CheckCircle,
  ExternalLink,
  Wallet,
  Eye,
  Trash2,
} from 'lucide-react';
import { IncomeTransaction } from '../types';
import { DocumentPreviewModal } from '../components/ReceiptModals';

export const IncomePage: React.FC = () => {
  const { incomes, addIncome, deleteIncome, currentUser, centralSummary } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedIncomeForProof, setSelectedIncomeForProof] = useState<IncomeTransaction | null>(null);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('Subsidi Kampus');
  const [rawAmount, setRawAmount] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Filter incomes
  const filteredIncomes = incomes.filter((item) => {
    if (item.deleted_at) return false;
    const matchSearch =
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.transaction_no.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const categories = [
    'Subsidi Kampus',
    'Iuran Wisudawan',
    'Sponsorship',
    'Donasi / Infaq',
    'Tenant Wisuda',
    'Penjualan Souvenir',
    'Lainnya',
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseRupiahInput(e.target.value);
    setRawAmount(val > 0 ? val.toLocaleString('id-ID') : '');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB!');
      return;
    }

    setFileName(file.name);
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setReceiptUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const numericAmount = parseRupiahInput(rawAmount);
    if (!source.trim()) {
      setErrorMsg('Sumber dana tidak boleh kosong.');
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setErrorMsg('Nominal pemasukan harus lebih besar dari Rp0.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Keterangan pemasukan harus diisi.');
      return;
    }

    addIncome({
      date,
      source: source.trim(),
      category,
      amount: numericAmount,
      description: description.trim(),
      notes: notes.trim() || undefined,
      receipt_url: receiptUrl || undefined,
    });

    // Reset
    setShowAddModal(false);
    setSource('');
    setRawAmount('');
    setDescription('');
    setNotes('');
    setReceiptUrl('');
    setFileName('');
  };

  const handleDelete = (item: IncomeTransaction) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus transaksi pemasukan [${item.transaction_no}] dari "${item.source}" sebesar ${formatRupiah(item.amount)}?\n\nTindakan ini untuk menghapus atau mengoreksi kesalahan input.`
      )
    ) {
      deleteIncome(item.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowDownLeft className="w-6 h-6 text-emerald-600" />
            Modul Pemasukan Kas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pencatatan dana masuk dari rektorat, wisudawan, sponsorship, dan donor resmi.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 self-start"
          >
            <Plus className="w-4 h-4" /> + Catat Pemasukan Baru
          </button>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
            Total Pemasukan Kas STIBHA 2026
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono mt-1 text-white">
            {formatRupiah(centralSummary.total_income)}
          </div>
          <p className="text-[11px] text-emerald-200 mt-0.5">
            Semua pemasukan otomatis terhitung dan menambah Saldo Kas Pusat.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-3 rounded-xl backdrop-blur-xs text-xs">
          <div className="text-emerald-200 font-medium">Saldo Kas Tersedia Sekarang:</div>
          <div className="text-lg font-bold font-mono text-white mt-0.5">
            {formatRupiah(centralSummary.central_cash_balance)}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari sumber, nomor transaksi, uraian..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 whitespace-nowrap">Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500 w-full sm:w-auto"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Incomes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">No. Transaksi</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Sumber Dana</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Nominal</th>
                <th className="py-3.5 px-4">Keterangan</th>
                <th className="py-3.5 px-4 text-center">Bukti</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    Tidak ada data pemasukan yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredIncomes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.transaction_no}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {formatDateIndo(item.date)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{item.source}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 text-sm whitespace-nowrap">
                      {formatRupiah(item.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={item.description}>
                      {item.description}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedIncomeForProof(item)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition-colors shadow-2xs"
                        title="Lihat Kwitansi / Bukti Transaksi"
                      >
                        <Eye className="w-3.5 h-3.5" /> Lihat Bukti
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {currentUser.role !== 'viewer' && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 font-semibold text-xs transition-colors border border-rose-200 shadow-2xs"
                          title="Hapus Transaksi Pemasukan (Salah Input)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Income */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Catat Pemasukan Kas Baru</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tanggal Transaksi *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Sumber Dana *</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Contoh: Rektorat STIBHA / Sponsor Bank BSI"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Kategori *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nominal (Rp) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={rawAmount}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:outline-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Keterangan / Uraian *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Rincian peruntukan atau sumber dana..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                  required
                />
              </div>

              {/* Upload Bukti */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Bukti Transfer / Kwitansi (Opsional)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    id="income-receipt"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="income-receipt" className="cursor-pointer flex flex-col items-center">
                    <UploadCloud className="w-6 h-6 text-emerald-600 mb-1" />
                    <span className="font-semibold text-slate-800">
                      {fileName || 'Pilih Berkas atau Foto Kwitansi'}
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, PDF (Maks. 10MB)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nomor rekening, bank pengirim, dsb."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 text-[11px] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nomor transaksi akan dibuat otomatis (contoh: IN-20261008-XXXX)</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Simpan Pemasukan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proof Viewer Modal */}
      {selectedIncomeForProof && (
        <DocumentPreviewModal
          isOpen={Boolean(selectedIncomeForProof)}
          onClose={() => setSelectedIncomeForProof(null)}
          title="Bukti Kwitansi / Transfer Pemasukan Kas"
          transactionNo={selectedIncomeForProof.transaction_no}
          fileUrl={selectedIncomeForProof.receipt_url}
          fileName={`bukti-pemasukan-${selectedIncomeForProof.transaction_no}`}
          amount={selectedIncomeForProof.amount}
          date={selectedIncomeForProof.date}
          sourceOrRecipient={selectedIncomeForProof.source}
          category={selectedIncomeForProof.category}
          description={selectedIncomeForProof.description}
          notes={selectedIncomeForProof.notes}
          isIncome={true}
        />
      )}
    </div>
  );
};
