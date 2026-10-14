import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDateIndo, exportToExcelXLSX } from '../utils/formatters';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  Filter,
  Building,
  CheckCircle,
  FileText,
  Calendar,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { incomes, expenses, disbursements, sies, centralSummary, currentUser, allSieSummaries, users } = useApp();

  const bendaharaUser = users?.find(
    (u) => u.username === 'bendahara' || u.role === 'super_admin' || u.sie_id === 'sie-bendahara'
  );
  const bendaharaName = bendaharaUser?.full_name ? bendaharaUser.full_name.replace(/\s*\(Bendahara\)/i, '').trim() : 'MAHRUS';

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sieFilter, setSieFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [reportType, setReportType] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('EXPENSE');

  // Filter expenses
  const filteredExpenses = expenses.filter((e) => {
    if (e.deleted_at) return false;
    if (currentUser.role === 'koordinator_sie' && currentUser.sie_id) {
      if (e.sie_id !== currentUser.sie_id) return false;
    } else if (sieFilter !== 'ALL' && e.sie_id !== sieFilter) {
      return false;
    }

    if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;

    if (startDate && e.date < startDate) return false;
    if (endDate && e.date > endDate) return false;

    return true;
  });

  const filteredIncomes = incomes.filter((i) => {
    if (i.deleted_at) return false;
    if (categoryFilter !== 'ALL' && i.category !== categoryFilter) return false;
    if (startDate && i.date < startDate) return false;
    if (endDate && i.date > endDate) return false;
    return true;
  });

  const totalFilteredExpense = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleExportExcel = () => {
    if (reportType === 'EXPENSE') {
      const headers = [
        'No. Transaksi',
        'Tanggal',
        'Seksi',
        'Nama Barang / Jasa',
        'Kategori',
        'Nominal (Rp)',
        'Metode Bayar',
      ];
      const rows = filteredExpenses.map((e) => {
        const isBendahara = e.sie_id === 'sie-bendahara' || e.sie_id === 'BENDAHARA';
        const sie = sies.find((s) => s.id === e.sie_id) || (isBendahara ? { name: 'Bendahara (Kas Pusat)' } : undefined);
        return [
          e.transaction_no,
          e.date,
          sie?.name || (isBendahara ? 'Bendahara (Kas Pusat)' : e.sie_id),
          e.item_name,
          e.category,
          e.amount,
          e.payment_method,
        ];
      });
      exportToExcelXLSX(`Laporan_Pengeluaran_Wisuda_STIBHA_${new Date().toISOString().slice(0, 10)}`, headers, rows, 'Pengeluaran');
    } else {
      const headers = ['No. Transaksi', 'Tanggal', 'Sumber Dana', 'Kategori', 'Nominal (Rp)', 'Uraian', 'Catatan'];
      const rows = filteredIncomes.map((i) => [
        i.transaction_no,
        i.date,
        i.source,
        i.category,
        i.amount,
        i.description,
        i.notes || '',
      ]);
      exportToExcelXLSX(`Laporan_Pemasukan_Wisuda_STIBHA_${new Date().toISOString().slice(0, 10)}`, headers, rows, 'Pemasukan Kas');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            Laporan Keuangan &amp; Akuntabilitas Wisuda
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ekspor rekapitulasi realisasi anggaran, arus kas, dan rincian transaksi panitia wisuda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Download className="w-4 h-4" /> Ekspor Excel (.xlsx)
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" /> Cetak / PDF Resmi
          </button>
        </div>
      </div>

      {/* Official Print Header (Visible only when printed) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6 text-center">
        <h2 className="text-lg font-black uppercase tracking-wider text-slate-900">
          PANITIA WISUDA SARJANA STIBHA TAHUN 2026
        </h2>
        <h3 className="text-sm font-bold text-slate-700">
          LAPORAN PERTANGGUNGJAWABAN KEUANGAN &amp; REALISASI ANGGARAN
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 space-y-3 print:hidden text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Tipe:</span>
            <div className="flex rounded-xl bg-slate-100 p-0.5">
              <button
                onClick={() => setReportType('EXPENSE')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  reportType === 'EXPENSE' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                Pengeluaran
              </button>
              <button
                onClick={() => setReportType('INCOME')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  reportType === 'INCOME' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Rentang Tanggal:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 text-xs"
            />
            <span className="text-slate-400">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 text-xs"
            />
          </div>

          {currentUser.role !== 'koordinator_sie' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Seksi:</span>
              <select
                value={sieFilter}
                onChange={(e) => setSieFilter(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 text-xs font-medium"
              >
                <option value="ALL">Seluruh Seksi</option>
                {sies.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Financial Snapshot Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            Total Pemasukan Kas
          </span>
          <span className="text-base sm:text-lg font-black font-mono text-slate-900 mt-1 block">
            {formatRupiah(centralSummary.total_income)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            Dana Dicairkan
          </span>
          <span className="text-base sm:text-lg font-black font-mono text-blue-700 mt-1 block">
            {formatRupiah(centralSummary.total_disbursed)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            Pengeluaran Terverifikasi
          </span>
          <span className="text-base sm:text-lg font-black font-mono text-rose-700 mt-1 block">
            {formatRupiah(centralSummary.total_expenses_approved)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 bg-emerald-50/50">
          <span className="text-[10px] text-emerald-800 font-bold uppercase block">
            Saldo Kas Tersedia
          </span>
          <span className="text-base sm:text-lg font-black font-mono text-emerald-700 mt-1 block">
            {formatRupiah(centralSummary.central_cash_balance)}
          </span>
        </div>
      </div>

      {/* Detailed Transaction Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            {reportType === 'EXPENSE' ? 'Rincian Pengeluaran Terfilter' : 'Rincian Pemasukan Kas'}
          </h3>
          <span className="font-mono font-bold text-slate-900 text-xs">
            Total: {reportType === 'EXPENSE' ? formatRupiah(totalFilteredExpense) : formatRupiah(centralSummary.total_income)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">No. Transaksi</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Seksi / Sumber</th>
                <th className="py-3 px-3">Item / Uraian</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportType === 'EXPENSE' ? (
                filteredExpenses.map((exp) => {
                  const isBendahara = exp.sie_id === 'sie-bendahara' || exp.sie_id === 'BENDAHARA';
                  const sie = sies.find((s) => s.id === exp.sie_id) || (isBendahara ? { name: 'Bendahara (Kas Pusat)' } : undefined);
                  return (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                        {exp.transaction_no}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">{formatDateIndo(exp.date)}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        <span className="flex items-center gap-1.5">
                          {sie?.name || (isBendahara ? 'Bendahara (Kas Pusat)' : exp.sie_id)}
                          {isBendahara && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                              Kas Pusat
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{exp.item_name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{exp.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(exp.amount)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                filteredIncomes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                      {inc.transaction_no}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{formatDateIndo(inc.date)}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{inc.source}</td>
                    <td className="py-2.5 px-3">{inc.description}</td>
                    <td className="py-2.5 px-3 text-slate-600">{inc.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                      {formatRupiah(inc.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Signatures for Print Mode */}
      <div className="hidden print:grid grid-cols-3 gap-6 pt-12 text-center text-xs text-slate-800">
        <div>
          <p className="font-medium">Mengetahui,</p>
          <p className="font-bold mt-1">Ketua Panitia Wisuda</p>
          <div className="h-16"></div>
          <p className="font-bold underline">Dr. H. Muhammad Zaki, M.Pd.</p>
          <p className="text-[10px] text-slate-500">NIDN. 210892019</p>
        </div>
        <div></div>
        <div>
          <p className="font-medium">Makassar, 08 Oktober 2026</p>
          <p className="font-bold mt-1">Bendahara Utama</p>
          <div className="h-16"></div>
          <p className="font-bold underline uppercase">{bendaharaName || 'MAHRUS'}</p>
          <p className="text-[10px] text-slate-500">NIP. 198504122010011002</p>
        </div>
      </div>
    </div>
  );
};
