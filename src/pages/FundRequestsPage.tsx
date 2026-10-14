import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDateIndo, parseRupiahInput } from '../utils/formatters';
import {
  FileQuestion,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  AlertCircle,
  TrendingUp,
  Trash2,
} from 'lucide-react';
import { FundRequest } from '../types';

export const FundRequestsPage: React.FC = () => {
  const { fundRequests, sies, addFundRequest, reviewFundRequest, deleteFundRequest, currentUser, getSieSummary } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [reviewingReq, setReviewingReq] = useState<FundRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'DISETUJUI' | 'DITOLAK'>('DISETUJUI');
  const [adminNotes, setAdminNotes] = useState('');

  // Add Form
  const userSieId = currentUser.sie_id || (sies[0]?.id || '');
  const [selectedSieId, setSelectedSieId] = useState(userSieId);
  const [rawAmount, setRawAmount] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Filter requests: coordinator only sees their Sie; admin/viewer sees all
  const displayedRequests = fundRequests.filter((r) => {
    if (currentUser.role === 'koordinator_sie' && currentUser.sie_id) {
      return r.sie_id === currentUser.sie_id;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const numeric = parseRupiahInput(rawAmount);
    if (!numeric || numeric <= 0) {
      setErrorMsg('Nominal tambahan harus lebih dari Rp0.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Alasan pengajuan harus diisi.');
      return;
    }

    addFundRequest({
      sie_id: selectedSieId,
      amount: numeric,
      reason: reason.trim(),
      description: description.trim() || undefined,
    });

    setShowAddModal(false);
    setRawAmount('');
    setReason('');
    setDescription('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingReq) return;

    reviewFundRequest(reviewingReq.id, reviewAction, adminNotes.trim());
    setReviewingReq(null);
    setAdminNotes('');
  };

  const handleDeleteRequest = (req: FundRequest) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus permohonan dana tambahan [${req.request_no}] sebesar ${formatRupiah(req.amount)}?\n\nTindakan ini untuk menghapus atau mengoreksi kesalahan input.`
      )
    ) {
      deleteFundRequest(req.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileQuestion className="w-6 h-6 text-purple-600" />
            Permintaan Dana Tambahan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pengajuan eskalasi anggaran darurat atau penambahan kuota kegiatan wisuda.
          </p>
        </div>

        {currentUser.role !== 'viewer' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 self-start"
          >
            <Plus className="w-4 h-4" /> + Ajukan Permintaan Dana
          </button>
        )}
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Riwayat &amp; Status Pengajuan Dana Tambahan
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Total {displayedRequests.length} Permohonan
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {displayedRequests.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              Belum ada permohonan dana tambahan yang diajukan.
            </div>
          ) : (
            displayedRequests.map((req) => {
              const sie = sies.find((s) => s.id === req.sie_id);
              return (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {req.request_no}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          req.status === 'DISETUJUI'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'DITOLAK'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1 font-semibold">
                        <Building className="w-3 h-3 text-slate-400" />
                        {sie?.name}
                      </span>
                      <span className="text-slate-400">• {formatDateIndo(req.created_at)}</span>
                    </div>

                    <div className="text-sm font-bold text-slate-900">{req.reason}</div>
                    {req.description && (
                      <p className="text-slate-600 leading-relaxed text-[11px] max-w-xl">
                        {req.description}
                      </p>
                    )}

                    {req.admin_notes && (
                      <div className="mt-2 p-2 bg-slate-100 rounded-lg text-[11px] text-slate-700">
                        <span className="font-semibold">Catatan Keputusan Bendahara:</span> {req.admin_notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center md:flex-col items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Nominal Diminta
                      </span>
                      <span className="font-mono font-black text-slate-900 text-base sm:text-lg">
                        {formatRupiah(req.amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSuperAdmin && req.status === 'DIAJUKAN' && (
                        <>
                          <button
                            onClick={() => {
                              setReviewingReq(req);
                              setReviewAction('DISETUJUI');
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Setujui &amp; Cairkan
                          </button>
                          <button
                            onClick={() => {
                              setReviewingReq(req);
                              setReviewAction('DITOLAK');
                            }}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-xs flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Tolak
                          </button>
                        </>
                      )}

                      {currentUser.role !== 'viewer' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRequest(req)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 font-semibold text-xs transition-colors border border-rose-200"
                          title="Hapus Permohonan (Salah Input)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Add Fund Request */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-purple-600" />
                Permohonan Dana Tambahan
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
                  {errorMsg}
                </div>
              )}

              {currentUser.role === 'super_admin' ? (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pilih Seksi Pengaju *</label>
                  <select
                    value={selectedSieId}
                    onChange={(e) => setSelectedSieId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-semibold"
                  >
                    {sies.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nominal Dana Tambahan (Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">
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
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Alasan Kebutuhan Dana Tambahan *
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Contoh: Lonjakan peserta wisuda, penambahan genset cadangan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Rincian Penjelasan (Opsional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Penjelasan detail komparasi harga atau kalkulasi..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Kirim Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Review */}
      {reviewingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 text-base">
              Tinjau Permohonan: {reviewingReq.request_no}
            </h3>
            <p className="text-slate-500 mt-1">
              {reviewingReq.reason} ({formatRupiah(reviewingReq.amount)})
            </p>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Keputusan Bendahara *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewAction('DISETUJUI')}
                    className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${
                      reviewAction === 'DISETUJUI'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Setujui &amp; Cairkan
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAction('DITOLAK')}
                    className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${
                      reviewAction === 'DITOLAK'
                        ? 'bg-rose-50 border-rose-500 text-rose-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-rose-600" /> Tolak
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Catatan Review untuk Seksi
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Alasan persetujuan atau penolakan..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewingReq(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm"
                >
                  Simpan Keputusan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
