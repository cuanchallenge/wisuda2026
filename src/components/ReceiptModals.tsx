import React, { useState } from 'react';
import { ExpenseReceipt, ExpenseTransaction } from '../types';
import { formatRupiah, formatDateIndo, terbilangRupiah } from '../utils/formatters';
import {
  FileText,
  Download,
  X,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Printer,
  CheckCircle2,
  Building,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StibhaLogo } from './StibhaLogo';

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  transactionNo?: string;
  fileUrl?: string | null;
  fileName?: string;
  fields?: { label: string; value: string }[];
  amount?: number;
  date?: string;
  sourceOrRecipient?: string;
  category?: string;
  description?: string;
  notes?: string;
  isIncome?: boolean;
  treasurerName?: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  title = 'Bukti Transaksi Kas',
  transactionNo = 'TX-2026',
  fileUrl,
  fileName,
  fields = [],
  amount,
  date,
  sourceOrRecipient,
  category,
  description,
  notes,
  isIncome = false,
  treasurerName,
}) => {
  let activeTreasurerName = treasurerName || 'MAHRUS';
  try {
    const appContext = useApp();
    const bendaharaUser = appContext.users.find(
      (u) => u.username === 'bendahara' || u.role === 'super_admin' || u.sie_id === 'sie-bendahara'
    );
    if (!treasurerName && bendaharaUser?.full_name) {
      activeTreasurerName = bendaharaUser.full_name.replace(/\s*\(Bendahara\)/i, '').trim() || 'MAHRUS';
    }
  } catch {
    activeTreasurerName = treasurerName || 'MAHRUS';
  }

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'voucher' | 'attachment'>(
    fileUrl ? 'attachment' : 'voucher'
  );
  const [imageError, setImageError] = useState(false);

  // Sync tab when opening
  React.useEffect(() => {
    setImageError(false);
    setZoomLevel(1);
    if (fileUrl) {
      setActiveTab('attachment');
    } else {
      setActiveTab('voucher');
    }
  }, [fileUrl, isOpen]);

  if (!isOpen) return null;

  // Extract from fields if direct props not supplied
  const resolvedAmount =
    amount ??
    Number(
      fields
        .find((f) => f.label.toLowerCase().includes('nominal'))
        ?.value.replace(/[^0-9]/g, '') || 0
    );
  const resolvedDate =
    date ??
    fields.find((f) => f.label.toLowerCase().includes('tanggal'))?.value ??
    new Date().toISOString();
  const resolvedParty =
    sourceOrRecipient ??
    fields.find(
      (f) =>
        f.label.toLowerCase().includes('sumber') ||
        f.label.toLowerCase().includes('seksi') ||
        f.label.toLowerCase().includes('item')
    )?.value ??
    '-';
  const resolvedCategory =
    category ??
    fields.find((f) => f.label.toLowerCase().includes('kategori'))?.value ??
    'Umum';
  const resolvedDescription =
    description ??
    fields.find(
      (f) =>
        f.label.toLowerCase().includes('uraian') ||
        f.label.toLowerCase().includes('keterangan')
    )?.value ??
    '-';

  const isPdf = Boolean(
    (fileName && fileName.toLowerCase().endsWith('.pdf')) ||
    (fileUrl && (fileUrl.startsWith('data:application/pdf') || fileUrl.includes('.pdf')))
  );

  const handleDownloadFile = () => {
    if (!fileUrl) return;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName || `${transactionNo || 'bukti'}.${isPdf ? 'pdf' : 'jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:max-h-none print:w-full">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                No. Registrasi: <span className="font-bold text-emerald-700">{transactionNo}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors"
              title="Cetak Bukti"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (if attachment exists) */}
        {fileUrl && (
          <div className="bg-slate-100/80 px-5 pt-2 border-b border-slate-200 flex gap-2 text-xs print:hidden">
            <button
              onClick={() => setActiveTab('attachment')}
              className={`pb-2.5 px-3 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'attachment'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Berkas / Foto Lampiran Asli
            </button>
            <button
              onClick={() => setActiveTab('voucher')}
              className={`pb-2.5 px-3 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'voucher'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Kwitansi Kas Digital Resmi
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          {activeTab === 'attachment' && fileUrl ? (
            /* ATTACHMENT VIEW */
            <div className="flex flex-col items-center justify-center min-h-[320px] bg-slate-900/5 rounded-xl p-3 relative border border-slate-200">
              {isPdf ? (
                /* PDF PREVIEW */
                <div className="text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md w-full">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="font-bold text-slate-900 text-sm mb-1 truncate px-2">
                    {fileName || 'Dokumen_Bukti.pdf'}
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Dokumen Berkas PDF Resmi Transaksi
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Buka di Tab Baru
                    </a>
                    <button
                      onClick={handleDownloadFile}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Download className="w-4 h-4" /> Unduh PDF
                    </button>
                  </div>
                </div>
              ) : imageError ? (
                /* IMAGE LOAD FALLBACK */
                <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-sm">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Lampiran Berkas Transaksi</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Foto tersimpan aman di sistem. Anda dapat melihat format kwitansi resmi di tab sebelah atau mengunduh berkas langsung.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setActiveTab('voucher')}
                      className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      Buka Kwitansi Resmi
                    </button>
                    {fileUrl && (
                      <button
                        onClick={handleDownloadFile}
                        className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50"
                      >
                        Unduh File
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* IMAGE VIEW WITH ZOOM */
                <div className="relative max-h-[60vh] max-w-full overflow-hidden rounded-xl border border-slate-200 shadow bg-white flex items-center justify-center">
                  <img
                    src={fileUrl}
                    alt={fileName || 'Bukti Transaksi'}
                    onError={() => setImageError(true)}
                    style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease-out' }}
                    className="max-h-[58vh] max-w-full object-contain mx-auto select-none"
                  />
                  {/* Floating Zoom Controls */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs text-white p-1 rounded-xl shadow-lg border border-slate-700/50">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                      title="Perkecil"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono px-1 font-bold">{Math.round(zoomLevel * 100)}%</span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                      title="Perbesar"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors border-l border-white/20 ml-0.5"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* OFFICIAL KWITANSI DIGITAL VIEW (Never empty!) */
            <div className="bg-white rounded-2xl border-2 border-slate-300/80 shadow-md p-6 sm:p-8 font-sans relative overflow-hidden">
              {/* Decorative Background Stamp */}
              <div className="absolute right-4 bottom-8 -rotate-12 pointer-events-none select-none opacity-85">
                <div className="border-4 border-emerald-600 rounded-2xl p-3 text-center text-emerald-600 font-black tracking-widest uppercase">
                  <div className="text-[10px] tracking-widest border-b-2 border-emerald-600 pb-0.5">
                    PANITIA WISUDA 2026
                  </div>
                  <div className="text-sm font-extrabold my-0.5">
                    {isIncome ? 'LUNAS / DITERIMA' : 'SAH / TERCATAT'}
                  </div>
                  <div className="text-[9px] tracking-wider font-mono">
                    BENDAHARA STIBHA
                  </div>
                </div>
              </div>

              {/* Kop Surat Header */}
              <div className="border-b-2 border-slate-800 pb-4 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StibhaLogo className="w-12 h-12 shrink-0 drop-shadow-xs" />
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                      PANITIA WISUDA SARJANA STIBHA 2026
                    </h2>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Sistem Manajemen Keuangan Terpadu & Akuntabilitas Kas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    NO. BUKTI KAS
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-slate-900">
                    {transactionNo}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center my-4">
                <span className="inline-block border-b-2 border-slate-900 pb-1 text-sm sm:text-base font-black tracking-wider uppercase text-slate-900">
                  {isIncome ? 'KUITANSI TANDA TERIMA KAS MASUK' : 'BUKTI PENGELUARAN KAS RESMI'}
                </span>
              </div>

              {/* Kwitansi Body Fields */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-800 mt-5">
                <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-dashed border-slate-200">
                  <div className="col-span-4 sm:col-span-3 text-slate-500 font-semibold">
                    {isIncome ? 'Telah Diterima Dari' : 'Dikeluarkan Kepada / Seksi'}
                  </div>
                  <div className="col-span-8 sm:col-span-9 font-bold text-slate-900">
                    : {resolvedParty}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-dashed border-slate-200">
                  <div className="col-span-4 sm:col-span-3 text-slate-500 font-semibold">
                    Uang Sejumlah
                  </div>
                  <div className="col-span-8 sm:col-span-9 italic font-serif font-bold text-emerald-900 bg-emerald-50/70 p-2 rounded-lg">
                    : &ldquo;{terbilangRupiah(resolvedAmount)}&rdquo;
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-dashed border-slate-200">
                  <div className="col-span-4 sm:col-span-3 text-slate-500 font-semibold">
                    Untuk Pembayaran
                  </div>
                  <div className="col-span-8 sm:col-span-9 text-slate-800">
                    : <span className="font-semibold">{resolvedCategory}</span> — {resolvedDescription}
                  </div>
                </div>

                {notes && (
                  <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-dashed border-slate-200">
                    <div className="col-span-4 sm:col-span-3 text-slate-500 font-semibold">
                      Catatan Transaksi
                    </div>
                    <div className="col-span-8 sm:col-span-9 text-slate-600">
                      : {notes}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom: Nominal Box & Signatures */}
              <div className="mt-8 pt-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase tracking-wider">
                    Jumlah Nominal Kas
                  </span>
                  <div className="inline-block bg-slate-900 text-white px-4 py-2.5 rounded-xl font-mono text-lg sm:text-xl font-black shadow-sm tracking-tight">
                    {formatRupiah(resolvedAmount)}
                  </div>
                </div>

                <div className="text-center sm:text-right min-w-[180px]">
                  <div className="text-[11px] text-slate-500 mb-1">
                    Makassar, {formatDateIndo(resolvedDate)}
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    Bendahara Acara Wisuda STIBHA
                  </div>
                  <div className="h-14 flex items-end justify-center sm:justify-end">
                    <span className="text-emerald-700 font-serif italic font-bold text-xs">
                      [Tanda Tangan Digital Sah]
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs border-t border-slate-300 pt-1 tracking-wide uppercase">
                    {activeTreasurerName || 'MAHRUS'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dokumen Bukti Keuangan Terverifikasi Sistem</span>
          </div>

          <div className="flex items-center gap-2">
            {fileUrl && (
              <button
                onClick={handleDownloadFile}
                className="px-3.5 py-2 border border-slate-300 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Berkas
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Kwitansi
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl font-medium transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ReceiptPreviewModal for Expense transactions
interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt?: ExpenseReceipt | null;
  transaction?: ExpenseTransaction | null;
  treasurerName?: string;
}

export const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({
  isOpen,
  onClose,
  receipt,
  transaction,
  treasurerName,
}) => {
  if (!isOpen) return null;

  return (
    <DocumentPreviewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Bukti Kwitansi / Nota Pengeluaran"
      transactionNo={transaction?.transaction_no || receipt?.file_name || 'EXP-2026'}
      treasurerName={treasurerName}
      fileUrl={receipt?.file_url}
      fileName={receipt?.file_name || 'nota-pengeluaran.jpg'}
      amount={transaction?.amount}
      date={transaction?.date}
      sourceOrRecipient={transaction?.item_name}
      category={transaction?.category}
      description={transaction?.description}
      notes={transaction?.admin_notes}
      isIncome={false}
      fields={
        transaction
          ? [
              { label: 'Item / Uraian', value: transaction.item_name },
              { label: 'Kategori', value: transaction.category },
              { label: 'Nominal', value: formatRupiah(transaction.amount) },
              { label: 'Tanggal', value: formatDateIndo(transaction.date) },
              { label: 'Metode Pembayaran', value: transaction.payment_method },
            ]
          : []
      }
    />
  );
};
