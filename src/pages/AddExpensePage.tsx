import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, parseRupiahInput, generateStoragePath, generateTransactionNo } from '../utils/formatters';
import {
  Camera,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Receipt,
  ArrowLeft,
  X,
  Upload,
  Coins,
} from 'lucide-react';
import { PaymentMethod } from '../types';

interface AddExpensePageProps {
  setActiveTab: (tab: string) => void;
}

export const AddExpensePage: React.FC<AddExpensePageProps> = ({ setActiveTab }) => {
  const { currentUser, sies, addExpense, getSieSummary } = useApp();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If coordinator, use their assigned Sie; if admin/bendahara, default to BENDAHARA or allow selection
  const isBendaharaOrAdmin = currentUser.role === 'super_admin' || currentUser.username === 'bendahara' || !currentUser.sie_id;
  const userSieId = currentUser.sie_id || 'sie-bendahara';
  const [selectedSieId, setSelectedSieId] = useState(userSieId);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Konsumsi');
  const [itemName, setItemName] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFER');
  const [description, setDescription] = useState('');

  // File upload state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<number | undefined>();
  const [fileType, setFileType] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const isBendaharaSelected = selectedSieId === 'sie-bendahara' || selectedSieId === 'BENDAHARA';
  const sieSummary = getSieSummary(selectedSieId);
  const currentSie = sies.find((s) => s.id === selectedSieId) || (isBendaharaSelected ? {
    id: 'sie-bendahara',
    name: 'Bendahara (Kas Pusat)',
    code: 'BENDAHARA',
    description: 'Pengeluaran operasional umum dan belanja langsung bersumber dari Kas Bendahara Pusat',
    is_active: true,
    created_at: '',
  } : undefined);

  const categories = [
    'Konsumsi',
    'Perlengkapan',
    'Transportasi',
    'Dokumentasi',
    'Dekorasi',
    'Acara & Protokoler',
    'Operasional & ATK',
    'Honorarium',
    'Keamanan',
    'Lainnya',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Ukuran file maksimal 10MB!');
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setFileType(file.type);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const numericAmount = parseRupiahInput(rawAmount);
    if (!itemName.trim()) {
      setErrorMessage('Nama barang atau jasa harus diisi.');
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setErrorMessage('Nominal pengeluaran harus lebih besar dari Rp0.');
      return;
    }

    if (!previewUrl) {
      setErrorMessage('Wajib melampirkan foto nota atau bukti kwitansi transaksi.');
      return;
    }

    const tempTxNo = generateTransactionNo('EXP');
    const storagePath = generateStoragePath(
      currentSie?.code || 'sie',
      tempTxNo,
      fileName || 'nota.jpg'
    );

    const result = addExpense({
      sie_id: selectedSieId,
      date,
      category,
      item_name: itemName.trim(),
      amount: numericAmount,
      payment_method: paymentMethod,
      description: description.trim() || `Pembelian / Biaya ${itemName.trim()}`,
      status: 'DITERIMA',
      receipts: [
        {
          id: `rec-${Date.now()}`,
          expense_id: '',
          file_path: storagePath,
          file_url: previewUrl,
          file_name: fileName || 'nota.jpg',
          file_size: fileSize,
          file_type: fileType,
          uploaded_at: new Date().toISOString(),
        },
      ],
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Gagal menyimpan transaksi.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      setActiveTab('expenses');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('expenses')}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Pengeluaran
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Catat Pengeluaran &amp; Upload Nota
            </h1>
            <p className="text-xs text-slate-500">
              Input bukti transaksi riil seksi untuk pencatatan kas wisuda
            </p>
          </div>
        </div>

        {/* Available balance notification widget */}
        {sieSummary && (
          <div
            className={`mb-6 p-4 rounded-2xl text-white flex items-center justify-between transition-all ${
              isBendaharaSelected
                ? 'bg-gradient-to-r from-emerald-800 to-teal-900 border border-emerald-600/40 shadow-sm'
                : 'bg-slate-900'
            }`}
          >
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider block ${
                  isBendaharaSelected ? 'text-emerald-300' : 'text-slate-400'
                }`}
              >
                {isBendaharaSelected
                  ? 'Sisa Saldo Kas Bendahara (Kas Pusat)'
                  : `Sisa Saldo Kas ${sieSummary.sie.name}`}
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {formatRupiah(sieSummary.remaining_balance)}
              </span>
            </div>
            <div className="text-right text-[11px] text-slate-300">
              <span className="block font-medium">
                {isBendaharaSelected ? 'Sumber Dana: Kas Bendahara Pusat' : 'Batas Maksimal Pengeluaran'}
              </span>
              <span className="text-emerald-400 font-mono font-bold">100% Saldo Tersedia</span>
            </div>
          </div>
        )}

        {isSuccess ? (
          <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 animate-fade-in">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold">Pengeluaran Berhasil Dicatat!</h3>
            <p className="text-xs text-emerald-700 mt-1">
              Nota transaksi telah dicatat dan saldo kas {isBendaharaSelected ? 'Bendahara (Kas Pusat)' : 'seksi'} otomatis terpotong.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Admin/Bendahara can choose Sie; Koordinator is locked to their own Sie */}
            {isBendaharaOrAdmin ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-bold">
                    Pilih Seksi Pemilik Transaksi *
                  </label>
                  {isBendaharaSelected ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Sumber Keuangan: Bendahara
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400">
                      Sumber: Kas Pencairan Seksi
                    </span>
                  )}
                </div>
                <select
                  value={selectedSieId}
                  onChange={(e) => setSelectedSieId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-semibold focus:outline-emerald-500 bg-white"
                >
                  <option value="sie-bendahara" className="font-bold text-emerald-800 bg-emerald-50">
                    ⭐ BENDAHARA (Pengeluaran Langsung Kas Pusat)
                  </option>
                  <optgroup label="Seksi Kepanitiaan Wisuda">
                    {sies
                      .filter((s) => s.id !== 'sie-bendahara' && s.code !== 'BENDAHARA')
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                  </optgroup>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isBendaharaSelected
                    ? '💡 Pilihan BENDAHARA: Untuk mencatat pengeluaran operasional yang sumber keuangannya langsung dari Bendahara (Kas Pusat).'
                    : 'Pengeluaran ini dicatat atas nama seksi dan otomatis memotong sisa saldo pencairan dana seksi tersebut.'}
                </p>
              </div>
            ) : (
              <input type="hidden" value={selectedSieId} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tanggal Transaksi / Nota *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Kategori Pengeluaran *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Nama Barang / Jasa *</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Contoh: Sewa Kursi Futura 300 Pcs / Snack Box Gladi"
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Metode Pembayaran *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
              >
                <option value="TRANSFER">Transfer Bank / VA</option>
                <option value="TUNAI">Tunai (Cash)</option>
                <option value="QRIS">QRIS</option>
                <option value="KARTU_DEBIT">Kartu Debit</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Total Nominal Sesuai Kwitansi (Rp) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold font-mono text-slate-400 text-sm">
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
                  className="w-full pl-11 pr-3 py-3 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 text-base focus:outline-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Keterangan / Rincian Penggunaan</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Rincian tambahan atau spesifikasi barang..."
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium"
              />
            </div>

            {/* Mobile-First Camera & File Upload Section (Requirement #13, #23) */}
            <div className="border-t border-slate-200 pt-5">
              <label className="block text-slate-800 font-bold mb-2">
                Foto Nota / Kwitansi Transaksi *
              </label>
              <p className="text-[11px] text-slate-500 mb-3">
                Ambil foto nota langsung menggunakan kamera HP atau unggah gambar/PDF dari galeri perangkat.
              </p>

              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {!previewUrl ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Camera Option */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-5 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 flex flex-col items-center justify-center gap-2 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Ambil Foto Nota</span>
                    <span className="text-[10px] text-slate-500">Buka kamera ponsel langsung</span>
                  </button>

                  {/* Gallery Option */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/70 flex flex-col items-center justify-center gap-2 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Pilih dari Galeri</span>
                    <span className="text-[10px] text-slate-500">JPG, PNG, atau PDF (maks 10MB)</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-800 truncate max-w-xs">{fileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFileName('');
                      }}
                      className="text-rose-600 hover:text-rose-800 text-xs font-semibold flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Ganti Foto
                    </button>
                  </div>

                  <div className="max-h-60 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center bg-white">
                    <img src={previewUrl} alt="Preview Nota" className="max-h-60 object-contain mx-auto" />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('expenses')}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all text-xs"
              >
                Simpan Pengeluaran
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
