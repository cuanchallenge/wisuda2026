import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, ShieldCheck, Server, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const isConfigured = isSupabaseConfigured();

  if (!isOpen) return null;

  const copyEnvSnippet = () => {
    const snippet = `VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Status Database & Supabase Integration</h3>
              <p className="text-xs text-slate-500">Arsitektur Production-Ready untuk Vercel & Supabase</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-600">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isConfigured
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isConfigured ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-sm">
                {isConfigured
                  ? 'Koneksi Supabase Aktif'
                  : 'Mode Interaktif Realtime Aktif (Local High-Performance Store)'}
              </div>
              <p className="text-xs mt-1 leading-relaxed">
                {isConfigured
                  ? 'Aplikasi terhubung ke instance Supabase PostgreSQL Anda. Semua data dan file tersinkronisasi.'
                  : 'Aplikasi saat ini berjalan mulus dengan pre-seeded data wisuda & localStorage engine. Seluruh fitur (pemasukan, pencairan, pengeluaran, nota, verifikasi, audit log) siap 100% dan langsung dapat dipasang ke Supabase tanpa mengubah kode.'}
              </p>
            </div>
          </div>

          {/* Quick Steps */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              Langkah Menghubungkan ke Supabase (5 Menit)
            </h4>
            <ol className="space-y-3 list-decimal list-inside text-xs leading-relaxed text-slate-700">
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900">Buat Proyek di Supabase:</span> Kunjungi{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  supabase.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                dan buat project baru gratis.
              </li>
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900">Jalankan Skrip Database:</span> Buka menu{' '}
                <span className="font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-800">SQL Editor</span> di Supabase, copy seluruh isi file{' '}
                <span className="font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-800">src/database/schema.sql</span> lalu klik <span className="font-semibold text-emerald-700">Run</span>. File ini otomatis membuat tabel, RLS, Storage Bucket, dan seed data.
              </li>
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900">Salin API Keys ke .env atau Vercel:</span> Buka <span className="font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-800">Project Settings → API</span> di Supabase dan masukkan kuncinya:
                <div className="mt-2 relative">
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
                  </pre>
                  <button
                    onClick={copyEnvSnippet}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
              </li>
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900">Deploy ke Vercel:</span> Hubungkan repository GitHub Anda ke Vercel, lalu tambahkan Environment Variables di atas. Deployment selesai otomatis!
              </li>
            </ol>
          </div>

          {/* Security Features */}
          <div className="border-t border-slate-200 pt-4">
            <h5 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-2">Standar Keamanan yang Terpasang:</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Row Level Security (RLS) PostgreSQL
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Isolasi Role Sie & Super Admin
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Storage Bucket Private Bukti Transaksi
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Audit Trail & Jejak Transaksi Lengkap
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
