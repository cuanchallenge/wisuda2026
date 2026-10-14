import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDateIndo, parseRupiahInput } from '../utils/formatters';
import {
  ArrowUpRight,
  Plus,
  Building,
  UploadCloud,
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  Search,
  Eye,
  Trash2,
} from 'lucide-react';
import { FundDisbursement } from '../types';
import { DocumentPreviewModal } from '../components/ReceiptModals';

export const DisbursementsPage: React.FC = () => {
  const { disbursements, sies, addDisbursement, deleteDisbursement, currentUser, centralSummary } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sieFilter, setSieFilter] = useState('ALL');
  const [selectedDisbForProof, setSelectedDisbForProof] = useState<FundDisbursement | null>(null);

  // Form State
  const [selectedSieId, setSelectedSieId] = useState(sies[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rawAmount, setRawAmount] = useState('');
  const [phase, setPhase] = useState('Tahap 1');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Filter disbursements: if coordinator, only their Sie!
  const filteredDisbursements = disbursements.filter((d) => {
    if (d.deleted_at) return false;
    if (currentUser.role === 'koordinator_sie' && currentUser.sie_id) {
      if (d.sie_id !== currentUser.sie_id) return false;
    } else if (sieFilter !== 'ALL' && d.sie_id !== sieFilter) {
      return false;
    }

    const sie = sies.find((s) => s.id === d.sie_id);
    const matchSearch =
      d.transaction_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sie && sie.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB!');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setProofUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const numericAmount = parseRupiahInput(rawAmount);
    if (!numericAmount || numericAmount <= 0) {
      setErrorMsg('Nominal pencairan harus lebih dari Rp0.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Keterangan pencairan harus diisi.');
      return;
    }

    const result = addDisbursement({
      sie_id: selectedSieId,
      date,
      amount: numericAmount,
      phase,
      description: description.trim(),
      notes: notes.trim() || undefined,
      proof_url: proofUrl || undefined,
    });

    if (!result.success) {
      setErrorMsg(result.error || 'Gagal mencairkan dana.');
      return;
    }

    // Reset
    setShowModal(false);
    setRawAmount('');
    setDescription('');
    setNotes('');
    setProofUrl('');
    setFileName('');
  };

  const handleDelete = (d: FundDisbursement) => {
    const sie = sies.find((s) => s.id === d.sie_id);
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus transaksi pencairan dana [${d.transaction_no}] ke ${sie?.name || d.sie_id} sebesar ${formatRupiah(d.amount)} (${d.phase})?\n\nTindakan ini untuk membatalkan atau mengoreksi kesalahan input pencairan.`
      )
    ) {
      deleteDisbursement(d.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6 text-blue-600" />
            Modul Pencairan Dana ke Sie
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Penyaluran dana kas dari Bendahara Utama ke rekening masing-masing seksi panitia.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => {
              setErrorMsg('');
              setShowModal(true);
            }}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 self-start"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> + Cairkan Dana ke Sie
          </button>
        )}
      </div>

      {/* Cash Availability Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Saldo Kas Pusat Tersedia
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1">
            {formatRupiah(centralSummary.central_cash_balance)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Total Dana Dicairkan: {formatRupiah(centralSummary.total_disbursed)}
          </p>
        </div>

        {isSuperAdmin && (
          <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-3 rounded-xl text-xs">
            <span className="text-slate-300 font-semibold block">Kebijakan Pencairan:</span>
            <span className="text-slate-400 text-[11px] block mt-0.5">
              Setiap pencairan otomatis memotong Kas Pusat dan menambah saldo riil seksi penerima.
            </span>
          </div>
        )}
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari transaksi, seksi, tahap..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 text-xs"
          />
        </div>

        {currentUser.role !== 'koordinator_sie' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-500 whitespace-nowrap">Filter Sie:</span>
            <select
              value={sieFilter}
              onChange={(e) => setSieFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500 w-full sm:w-auto"
            >
              <option value="ALL">Semua Seksi</option>
              {sies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">No. Transaksi</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Seksi Penerima</th>
                <th className="py-3.5 px-4">Tahap Pencairan</th>
                <th className="py-3.5 px-4">Nominal</th>
                <th className="py-3.5 px-4">Keterangan Transfer</th>
                <th className="py-3.5 px-4 text-center">Bukti Transfer</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDisbursements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    Belum ada riwayat pencairan dana untuk kriteria ini.
                  </td>
                </tr>
              ) : (
                filteredDisbursements.map((d) => {
                  const sie = sies.find((s) => s.id === d.sie_id);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {d.transaction_no}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {formatDateIndo(d.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{sie?.name || d.sie_id}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{sie?.code}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[10px]">
                          {d.phase}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700 text-sm whitespace-nowrap">
                        {formatRupiah(d.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={d.description}>
                        {d.description}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedDisbForProof(d)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold text-xs transition-colors"
                          title="Lihat Bukti Pencairan"
                        >
                          <Eye className="w-3.5 h-3.5" /> Lihat Bukti
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDelete(d)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 font-semibold text-xs transition-colors border border-rose-200 shadow-2xs"
                            title="Hapus Pencairan Dana (Salah Input)"
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

      {/* Modal Add Disbursement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Cairkan Dana Kas ke Sie</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pilih Seksi Penerima *</label>
                <select
                  value={selectedSieId}
                  onChange={(e) => setSelectedSieId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-semibold"
                >
                  {sies.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tanggal Transfer *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tahap Pencairan *</label>
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                  >
                    <option value="Tahap 1">Tahap 1 (Uang Muka / DP)</option>
                    <option value="Tahap 2">Tahap 2 (Termin Lanjutan)</option>
                    <option value="Tahap 3">Tahap 3 (Pelunasan H-3)</option>
                    <option value="Operasional Darurat">Operasional Darurat</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nominal Dicairkan (Rp) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={rawAmount}
                    onChange={(e) => {
                      const val = parseRupiahInput(e.target.value);
                      setRawAmount(val > 0 ? val.toLocaleString('id-ID') : '');
                    }}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:outline-emerald-500"
                    required
                  />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Maksimal dicairkan: {formatRupiah(centralSummary.central_cash_balance)}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Keterangan / Uraian *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Contoh: Pencairan DP catering dan sewa panggung"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Bukti Transfer Bank (Opsional)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    id="disb-receipt"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="disb-receipt" className="cursor-pointer flex flex-col items-center">
                    <UploadCloud className="w-6 h-6 text-blue-600 mb-1" />
                    <span className="font-semibold text-slate-800">
                      {fileName || 'Unggah Bukti Transfer'}
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, PDF (Maks. 10MB)</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-blue-900 text-[11px] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Nomor transaksi otomatis dibuat: OUT-20261008-XXXX</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-sm"
                >
                  Konfirmasi Pencairan Dana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proof Viewer Modal */}
      {selectedDisbForProof && (
        <DocumentPreviewModal
          isOpen={Boolean(selectedDisbForProof)}
          onClose={() => setSelectedDisbForProof(null)}
          title="Bukti Transfer Pencairan Dana Kas"
          transactionNo={selectedDisbForProof.transaction_no}
          fileUrl={selectedDisbForProof.proof_url}
          fileName={`bukti-transfer-${selectedDisbForProof.transaction_no}`}
          amount={selectedDisbForProof.amount}
          date={selectedDisbForProof.date}
          sourceOrRecipient={sies.find((s) => s.id === selectedDisbForProof.sie_id)?.name || selectedDisbForProof.sie_id}
          category={selectedDisbForProof.phase}
          description={selectedDisbForProof.description}
          notes={selectedDisbForProof.notes}
          isIncome={false}
        />
      )}
    </div>
  );
};
