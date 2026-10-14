import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Database,
  RotateCcw,
  Download,
  ShieldCheck,
  Server,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SettingsPageProps {
  onOpenSupabaseGuide: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenSupabaseGuide }) => {
  const { resetToDefaultData, incomes, expenses, disbursements, sies, users } = useApp();
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const isConfigured = isSupabaseConfigured();

  const handleConfirmReset = () => {
    resetToDefaultData();
    setShowResetModal(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 4000);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      app: 'WISUDA STIBHA 2026 FINANCE',
      exported_at: new Date().toISOString(),
      sies,
      users,
      incomes,
      disbursements,
      expenses,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_wisuda_finance_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700" />
          Pengaturan Sistem &amp; Koneksi Database
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kelola konfigurasi Supabase PostgreSQL, cadangan data, dan pemulihan sistem.
        </p>
      </div>

      {/* Success Banner if reset just completed */}
      {resetDone && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-start gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Data Berhasil Di-Reset ke Data Bawaan!</h4>
            <p className="text-xs text-emerald-700 mt-0.5">
              Seluruh data bawaan (Akun Bendahara &amp; Seksi, Anggaran Pagu, Transaksi Pemasukan, Pencairan, dan Pengeluaran bawaan) tetap utuh dan tersedia.
            </p>
          </div>
        </div>
      )}

      {/* Supabase Connection Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Status Supabase PostgreSQL</h3>
              <p className="text-xs text-slate-500">
                {isConfigured ? 'Terhubung ke instance Supabase Cloud' : 'Mode Interaktif Realtime Aktif (Pre-seeded Demo)'}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isConfigured
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isConfigured ? 'Online' : 'Siap Di-Deploy'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Skrip SQL schema lengkap, relasi foreign keys, Row Level Security (RLS), dan trigger otomatis sudah disiapkan di dalam direktori{' '}
          <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">
            src/database/schema.sql
          </span>
          .
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onOpenSupabaseGuide}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Server className="w-4 h-4 text-emerald-400" /> Buka Panduan Supabase &amp; Vercel
          </button>
        </div>
      </div>

      {/* Backup & Reset Data Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-slate-600" />
          Cadangan Data (Backup) &amp; Reset Simulasi
        </h3>
        <p className="text-xs text-slate-600">
          Unduh seluruh data transaksi wisuda dalam format JSON untuk arsip atau reset kembali ke data awal bawaan.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadBackup}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Unduh Cadangan JSON
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> {resetDone ? 'Data Ter-Reset!' : 'Reset ke Data Bawaan'}
          </button>
        </div>

        {/* Informative Assurance Note */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong className="text-slate-800">Data Bawaan Tidak Hilang:</strong> Saat Anda melakukan reset, data bawaan (seperti Seksi bawaan termasuk Bendahara, Akun login bawaan, Pagu Anggaran, dan Transaksi awal) akan tetap utuh dan dipulihkan secara otomatis.
          </span>
        </div>
      </div>

      {/* Custom Reset Confirmation Modal (safe for iframes) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kembalikan ke Data Bawaan?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fitur ini memulihkan sistem kembali ke data awal simulasi yang lengkap dan bersih.
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Data Bawaan Tidak Akan Hilang:
              </div>
              <ul className="text-emerald-700 space-y-1 list-disc list-inside">
                <li>Seksi bawaan (Bendahara, Perlengkapan, Konsumsi, Acara, Dok, Humas, Keamanan, Dekorasi) tetap utuh.</li>
                <li>Akun pengguna dan hak akses login panitia tetap utuh.</li>
                <li>Seluruh data transaksi (pencairan, pemasukan, anggaran, pengeluaran) dikosongkan bersih siap pakai.</li>
              </ul>
            </div>

            <p className="text-xs text-slate-500">
              Perubahan lokal atau data percobaan tambahan yang Anda buat selama simulasi akan dibersihkan kembali ke standar bawaan awal.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Ya, Reset ke Data Bawaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
