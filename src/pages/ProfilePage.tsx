import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { User, Shield, Building, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';
import { SieAvatar } from '../components/SieAvatar';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUser, sies, getSieSummary } = useApp();
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const assignedSie = sies.find((s) => s.id === currentUser.sie_id);
  const sieSummary = currentUser.sie_id ? getSieSummary(currentUser.sie_id) : null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, { phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-600" />
          Profil Pengguna Panitia
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Informasi identitas akun dan hak akses Anda dalam kepanitiaan Wisuda STIBHA 2026.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <SieAvatar user={currentUser} sie={assignedSie} size="xl" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{currentUser.full_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                @{currentUser.username}
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                {currentUser.role.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {assignedSie && sieSummary && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-600" />
                Seksi Ditugaskan: {assignedSie.name} ({assignedSie.code})
              </span>
              <span className="text-emerald-700 font-bold font-mono">
                Sisa Kas: {formatRupiah(sieSummary.remaining_balance)}
              </span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {assignedSie.description || 'Anda memiliki hak kelola pengeluaran dan permintaan dana untuk seksi ini.'}
            </p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs border-t border-slate-100 pt-5">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Nomor WhatsApp / Kontak</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Berhasil disimpan!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
            >
              Simpan Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
