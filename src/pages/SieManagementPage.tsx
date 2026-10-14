import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building,
  Plus,
  Edit,
  Power,
  Users2,
  Search,
  Key,
  User,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { Sie } from '../types';
import { SieAvatar } from '../components/SieAvatar';

export const SieManagementPage: React.FC = () => {
  const { sies, addSie, updateSie, toggleSieStatus, users, currentUser } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSie, setEditingSie] = useState<Sie | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Wisuda2026!');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password visibility map for list items
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const isSuperAdmin = currentUser.role === 'super_admin';

  const filteredSies = sies.filter((s) => {
    const isBendaharaSie = s.id === 'sie-bendahara' || s.code === 'BENDAHARA';
    const coord = users.find(
      (u) =>
        (u.sie_id === s.id && u.role === 'koordinator_sie') ||
        (isBendaharaSie && u.role === 'super_admin')
    );
    return (
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coord?.username && coord.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (coord?.full_name && coord.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const togglePasswordVisibility = (sieId: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [sieId]: !prev[sieId] }));
  };

  const handleCopyCredentials = (uName: string, pass: string, sieId: string) => {
    navigator.clipboard.writeText(`User Login: ${uName}\nPassword: ${pass}`);
    setCopiedId(sieId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama Seksi wajib diisi.');
      return;
    }

    if (!username.trim()) {
      setErrorMsg('User Login (Username) wajib diisi untuk koordinator seksi.');
      return;
    }

    // Check duplicate username
    const normalizedUsername = username.trim().toLowerCase();
    if (users.some((u) => u.username?.toLowerCase() === normalizedUsername)) {
      setErrorMsg(`User Login "${username}" sudah digunakan oleh akun lain. Gunakan username berbeda.`);
      return;
    }

    addSie({
      name: name.trim(),
      code: code.trim().toUpperCase() || `SIE-${name.trim().toUpperCase().replace(/\s+/g, '-')}`,
      description: description.trim(),
      username: normalizedUsername,
      password: password.trim() || 'Wisuda2026!',
      coordinator_name: coordinatorName.trim() || `${name.trim()} (Koordinator)`,
      is_active: true,
    });

    setShowAddModal(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSie) return;
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama Seksi tidak boleh kosong.');
      return;
    }

    if (!username.trim()) {
      setErrorMsg('User Login (Username) tidak boleh kosong.');
      return;
    }

    // Check duplicate username on another user
    const currentCoord = users.find((u) => u.sie_id === editingSie.id && u.role === 'koordinator_sie');
    const normalizedUsername = username.trim().toLowerCase();
    const duplicate = users.find(
      (u) => u.username?.toLowerCase() === normalizedUsername && u.id !== currentCoord?.id
    );

    if (duplicate) {
      setErrorMsg(`User Login "${username}" sudah digunakan oleh akun lain.`);
      return;
    }

    updateSie(editingSie.id, {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      username: normalizedUsername,
      password: password.trim() !== '' ? password.trim() : undefined,
      coordinator_name: coordinatorName.trim() || `${name.trim()} (Koordinator)`,
      coordinator_id: currentCoord?.id || editingSie.coordinator_id,
    });

    setEditingSie(null);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setCode('');
    setDescription('');
    setUsername('');
    setPassword('Wisuda2026!');
    setCoordinatorName('');
    setErrorMsg('');
    setShowPasswordInModal(false);
  };

  const startEdit = (s: Sie) => {
    const coord = users.find((u) => u.sie_id === s.id && u.role === 'koordinator_sie');
    setEditingSie(s);
    setName(s.name);
    setCode(s.code);
    setDescription(s.description || '');
    setUsername(coord?.username || s.code.toLowerCase().replace('sie-', ''));
    setPassword(coord?.password || 'Wisuda2026!');
    setCoordinatorName(coord?.full_name || '');
    setErrorMsg('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-emerald-600" />
            Manajemen Seksi (Sie) &amp; Akun Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tambah seksi baru, edit nama seksi, serta atur User Login &amp; Kata Sandi koordinator (tanpa perlu email).
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 self-start"
          >
            <Plus className="w-4 h-4" /> + Tambah Seksi &amp; Akun Login
          </button>
        )}
      </div>

      {/* Search & Info Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama seksi, kode, atau username..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 text-xs"
          />
        </div>
        <div className="text-slate-500 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Login koordinator seksi menggunakan <strong>Username</strong> &amp; <strong>Password</strong> langsung.</span>
        </div>
      </div>

      {/* Sies Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSies.map((s) => {
          const isBendaharaSie = s.id === 'sie-bendahara' || s.code === 'BENDAHARA';
          const coordinator = users.find(
            (u) =>
              (u.sie_id === s.id && u.role === 'koordinator_sie') ||
              (isBendaharaSie && u.role === 'super_admin')
          );
          const isPasswordVisible = visiblePasswords[s.id] || false;
          const currentPassword = coordinator?.password || 'Wisuda2026!';
          const currentUsername = coordinator?.username || (isBendaharaSie ? 'bendahara' : s.code.toLowerCase().replace('sie-', ''));

          return (
            <div
              key={s.id}
              className={`p-5 rounded-2xl border bg-white shadow-xs transition-all flex flex-col justify-between ${
                s.is_active ? 'border-slate-200 hover:border-emerald-300' : 'border-slate-200 bg-slate-50/70 opacity-75'
              }`}
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <SieAvatar sie={s} size="lg" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                      <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                        {s.code}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      s.is_active
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {s.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {s.description || 'Tidak ada deskripsi tambahan.'}
                </p>

                {/* Coordinator Login Credentials Box */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-emerald-600" /> Akun Login Koordinator
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCredentials(currentUsername, currentPassword, s.id)}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded hover:bg-emerald-100 transition-colors"
                      title="Salin kredensial login"
                    >
                      {copiedId === s.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Salin Akun
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-slate-200/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Penanggung Jawab:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                        {coordinator?.full_name || 'Belum diisi'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">User Login:</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        @{currentUsername}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Kata Sandi:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                          {isPasswordVisible ? currentPassword : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(s.id)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title={isPasswordVisible ? 'Sembunyikan' : 'Tampilkan sandi'}
                        >
                          {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isSuperAdmin && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                  {!isBendaharaSie ? (
                    <button
                      onClick={() => toggleSieStatus(s.id)}
                      className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-colors ${
                        s.is_active
                          ? 'text-slate-500 hover:bg-slate-100'
                          : 'text-emerald-700 hover:bg-emerald-50 font-bold'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {s.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                      Kas Pusat Utama
                    </span>
                  )}
                  <button
                    onClick={() => startEdit(s)}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Nama &amp; Akun
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Sie */}
      {(showAddModal || editingSie) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingSie ? 'Edit Nama Seksi & Akun Login' : 'Tambah Seksi & Akun Login Baru'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {editingSie
                    ? 'Ubah nama seksi, kode, dan ubah username/kata sandi koordinator.'
                    : 'Buat seksi baru beserta user login koordinator secara langsung (tanpa email).'}
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            <form
              onSubmit={editingSie ? handleEditSubmit : handleAddSubmit}
              className="mt-4 space-y-4"
            >
              {/* Part 1: Sie Information */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  1. Informasi Seksi (Sie)
                </span>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nama Seksi *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingSie && !username) {
                        setUsername(
                          e.target.value
                            .toLowerCase()
                            .replace(/sie\s*/i, '')
                            .replace(/[^a-z0-9]/g, '')
                        );
                      }
                      if (!editingSie && !code) {
                        setCode(`SIE-${e.target.value.toUpperCase().replace(/\s+/g, '-')}`);
                      }
                    }}
                    placeholder="Contoh: Sie Konsumsi, Sie Acara, Sie Logistik"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-semibold text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Kode Seksi *</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Contoh: SIE-KONSUMSI"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-emerald-500 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Nama Penanggung Jawab</label>
                    <input
                      type="text"
                      value={coordinatorName}
                      onChange={(e) => setCoordinatorName(e.target.value)}
                      placeholder="Nama orang / koordinator"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Deskripsi Tugas</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Uraian ruang lingkup belanja atau tanggung jawab..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-xs"
                  />
                </div>

                {/* Live Preview Foto Profil Avatar Orang */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <SieAvatar sieName={name || 'Seksi Baru'} size="lg" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {name.trim() || 'Nama Seksi Baru'}
                    </div>
                    <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium mt-0.5">
                      <User className="w-3.5 h-3.5" />
                      Foto profil otomatis: Icon avatar orang
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 2: Login Credentials (NO EMAIL) */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> 2. Kredensial Login Koordinator (Tanpa Email)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      User Login / Username *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                        placeholder="Contoh: konsumsi"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-emerald-500 bg-white"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Huruf kecil, tanpa spasi</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Kata Sandi (Password) *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswordInModal ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-emerald-500 bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPasswordInModal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Dapat diubah kapan saja</span>
                  </div>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSie(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all active:scale-95"
                >
                  {editingSie ? 'Simpan Perubahan Seksi' : 'Simpan Seksi & Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
