import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users2,
  Building,
  UserCog,
  Plus,
  Edit,
  Power,
  Search,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle,
  ShieldCheck,
  Shield,
  User,
  Phone,
  Lock,
} from 'lucide-react';
import { Sie, UserProfile, UserRole } from '../types';
import { SieAvatar } from '../components/SieAvatar';

export const ManagementPage: React.FC = () => {
  const {
    sies,
    addSie,
    updateSie,
    toggleSieStatus,
    users,
    addUser,
    updateUser,
    toggleUserStatus,
    currentUser,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'sies' | 'users'>('sies');

  // Sie Form states
  const [showAddSieModal, setShowAddSieModal] = useState(false);
  const [editingSie, setEditingSie] = useState<Sie | null>(null);
  const [sieName, setSieName] = useState('');
  const [sieCode, setSieCode] = useState('');
  const [sieDescription, setSieDescription] = useState('');
  const [sieUsername, setSieUsername] = useState('');
  const [siePassword, setSiePassword] = useState('Wisuda2026!');
  const [sieCoordinatorName, setSieCoordinatorName] = useState('');
  const [showSiePasswordInModal, setShowSiePasswordInModal] = useState(false);
  const [sieErrorMsg, setSieErrorMsg] = useState('');

  // User Form states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [userFullName, setUserFullName] = useState('');
  const [userUsername, setUserUsername] = useState('');
  const [userPassword, setUserPassword] = useState('Wisuda2026!');
  const [userRole, setUserRole] = useState<UserRole>('koordinator_sie');
  const [userSieId, setUserSieId] = useState<string>(sies[0]?.id || '');
  const [userPhone, setUserPhone] = useState('');
  const [userIsActive, setUserIsActive] = useState(true);
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userErrorMsg, setUserErrorMsg] = useState('');
  const [showUserPasswordInModal, setShowUserPasswordInModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Password visibility maps
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search terms
  const [sieSearchTerm, setSieSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Helper to reliably find the coordinator user for any Sie
  const getCoordinatorForSie = (s: Sie) => {
    const isBendaharaSie = s.id === 'sie-bendahara' || s.code === 'BENDAHARA';
    return (
      users.find((u) => s.coordinator_id && u.id === s.coordinator_id) ||
      users.find((u) => isBendaharaSie && (u.role === 'super_admin' || u.id === 'user-admin')) ||
      users.find((u) => u.sie_id === s.id && u.role === 'koordinator_sie') ||
      users.find((u) => u.sie_id === s.id)
    );
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCredentials = (uName: string, pass: string, id: string) => {
    navigator.clipboard.writeText(`User Login: ${uName}\nPassword: ${pass}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Sies filtered
  const filteredSies = sies.filter((s) => {
    const coord = getCoordinatorForSie(s);
    return (
      s.name.toLowerCase().includes(sieSearchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(sieSearchTerm.toLowerCase()) ||
      (coord?.username && coord.username.toLowerCase().includes(sieSearchTerm.toLowerCase())) ||
      (coord?.full_name && coord.full_name.toLowerCase().includes(sieSearchTerm.toLowerCase()))
    );
  });

  // Users filtered
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.full_name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(userSearchTerm));
    const matchRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchSearch && matchRole;
  });

  // Sie submit handlers
  const handleAddSieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSieErrorMsg('');

    if (!sieName.trim()) {
      setSieErrorMsg('Nama Seksi wajib diisi.');
      return;
    }

    if (!sieUsername.trim()) {
      setSieErrorMsg('User Login (Username) wajib diisi untuk koordinator seksi.');
      return;
    }

    const normalizedUsername = sieUsername.trim().toLowerCase();
    if (users.some((u) => u.username?.toLowerCase() === normalizedUsername)) {
      setSieErrorMsg(`User Login "${sieUsername}" sudah digunakan akun lain.`);
      return;
    }

    addSie({
      name: sieName.trim(),
      code: sieCode.trim().toUpperCase() || `SIE-${sieName.trim().toUpperCase().replace(/\s+/g, '-')}`,
      description: sieDescription.trim(),
      username: normalizedUsername,
      password: siePassword.trim() || 'Wisuda2026!',
      coordinator_name: sieCoordinatorName.trim() || `${sieName.trim()} (Koordinator)`,
      is_active: true,
    });

    setToastMsg(`Seksi baru "${sieName.trim()}" berhasil disimpan & ditambahkan!`);
    setTimeout(() => setToastMsg(''), 3000);
    setShowAddSieModal(false);
    resetSieForm();
  };

  const handleEditSieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSie) return;
    setSieErrorMsg('');

    if (!sieName.trim()) {
      setSieErrorMsg('Nama Seksi wajib diisi.');
      return;
    }

    const normalizedUsername = sieUsername.trim().toLowerCase();
    const currentCoord = getCoordinatorForSie(editingSie);

    const duplicateUsername = users.find(
      (u) => u.username?.toLowerCase() === normalizedUsername && u.id !== currentCoord?.id
    );

    if (duplicateUsername) {
      setSieErrorMsg(`User Login "${sieUsername}" sudah digunakan akun lain.`);
      return;
    }

    updateSie(editingSie.id, {
      name: sieName.trim(),
      code: sieCode.trim().toUpperCase(),
      description: sieDescription.trim(),
      coordinator_name: sieCoordinatorName.trim(),
      username: normalizedUsername,
      password: siePassword.trim(),
      coordinator_id: currentCoord?.id || editingSie.coordinator_id,
    });

    setToastMsg(`Perubahan data Seksi "${sieName.trim()}" berhasil disimpan!`);
    setTimeout(() => setToastMsg(''), 3000);
    setEditingSie(null);
    resetSieForm();
  };

  const openEditSieModal = (s: Sie) => {
    const coord = getCoordinatorForSie(s);
    setEditingSie(s);
    setSieName(s.name);
    setSieCode(s.code);
    setSieDescription(s.description || '');
    setSieCoordinatorName(coord?.full_name || '');
    setSieUsername(coord?.username || '');
    setSiePassword(coord?.password || 'Wisuda2026!');
    setSieErrorMsg('');
  };

  const resetSieForm = () => {
    setSieName('');
    setSieCode('');
    setSieDescription('');
    setSieUsername('');
    setSiePassword('Wisuda2026!');
    setSieCoordinatorName('');
    setSieErrorMsg('');
  };

  // User submit handlers
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserErrorMsg('');

    if (!userFullName.trim() || !userUsername.trim()) {
      setUserErrorMsg('Nama lengkap dan User Login (username) wajib diisi.');
      return;
    }

    if (userRole === 'koordinator_sie' && !userSieId) {
      setUserErrorMsg('Koordinator Sie wajib memilih salah satu Seksi.');
      return;
    }

    const normalizedUser = userUsername.trim().toLowerCase();
    if (users.some((u) => u.username?.toLowerCase() === normalizedUser)) {
      setUserErrorMsg(`User Login "${userUsername}" sudah digunakan oleh akun lain.`);
      return;
    }

    addUser({
      username: normalizedUser,
      password: userPassword.trim() || 'Wisuda2026!',
      full_name: userFullName.trim(),
      role: userRole,
      sie_id: userRole === 'koordinator_sie' ? userSieId : null,
      phone: userPhone.trim() || undefined,
      is_active: userIsActive,
    });

    setToastMsg(`Akun pengguna "${userFullName.trim()}" berhasil dibuat & disimpan!`);
    setTimeout(() => setToastMsg(''), 3000);
    setShowAddUserModal(false);
    resetUserForm();
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUserErrorMsg('');

    if (!userFullName.trim() || !userUsername.trim()) {
      setUserErrorMsg('Nama lengkap dan User Login wajib diisi.');
      return;
    }

    const normalizedUser = userUsername.trim().toLowerCase();
    if (users.some((u) => u.username?.toLowerCase() === normalizedUser && u.id !== editingUser.id)) {
      setUserErrorMsg(`User Login "${userUsername}" sudah digunakan akun lain.`);
      return;
    }

    updateUser(editingUser.id, {
      full_name: userFullName.trim(),
      username: normalizedUser,
      password: userPassword.trim(),
      role: userRole,
      sie_id: userRole === 'koordinator_sie' ? userSieId : null,
      phone: userPhone.trim() || undefined,
      is_active: userIsActive,
    });

    setToastMsg(`Perubahan akun pengguna "${userFullName.trim()}" berhasil disimpan!`);
    setTimeout(() => setToastMsg(''), 3000);
    setEditingUser(null);
    resetUserForm();
  };

  const openEditUserModal = (user: UserProfile) => {
    setEditingUser(user);
    setUserFullName(user.full_name);
    setUserUsername(user.username || '');
    setUserPassword(user.password || 'Wisuda2026!');
    setUserRole(user.role);
    setUserSieId(user.sie_id || sies[0]?.id || '');
    setUserPhone(user.phone || '');
    setUserIsActive(user.is_active);
    setUserErrorMsg('');
  };

  const resetUserForm = () => {
    setUserFullName('');
    setUserUsername('');
    setUserPassword('Wisuda2026!');
    setUserRole('koordinator_sie');
    setUserSieId(sies[0]?.id || '');
    setUserPhone('');
    setUserIsActive(true);
    setUserErrorMsg('');
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in border border-emerald-500">
          <CheckCircle className="w-4 h-4 text-white shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <Users2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Manajemen Sie & Pengguna
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Pusat pengelolaan seluruh Seksi kepanitiaan, koordinator, akun login, dan hak akses sistem
              </p>
            </div>
          </div>
        </div>

        {/* Action Button depending on subtab */}
        {isSuperAdmin && (
          <div className="flex items-center gap-2">
            {activeSubTab === 'sies' ? (
              <button
                onClick={() => {
                  resetSieForm();
                  setShowAddSieModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Tambah Seksi Baru
              </button>
            ) : (
              <button
                onClick={() => {
                  resetUserForm();
                  setShowAddUserModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Tambah Pengguna Baru
              </button>
            )}
          </div>
        )}
      </div>

      {/* Segmented Subtab Switcher */}
      <div className="flex p-1 bg-slate-200/80 rounded-xl max-w-md">
        <button
          onClick={() => setActiveSubTab('sies')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'sies'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Daftar Seksi (Sie)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {sies.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'users'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCog className="w-4 h-4" />
          <span>Semua Pengguna & Akses</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {users.length}
          </span>
        </button>
      </div>

      {/* SUBTAB 1: SIES & KOORDINATOR */}
      {activeSubTab === 'sies' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={sieSearchTerm}
                onChange={(e) => setSieSearchTerm(e.target.value)}
                placeholder="Cari nama seksi, koordinator, username..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Menampilkan {filteredSies.length} dari {sies.length} Seksi
            </div>
          </div>

          {/* Sies Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSies.map((s) => {
              const isBendaharaSie = s.id === 'sie-bendahara' || s.code === 'BENDAHARA';
              const coord = getCoordinatorForSie(s);
              const isPassVisible = !!visiblePasswords[s.id];
              const isCopied = copiedId === s.id;

              return (
                <div
                  key={s.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                    s.is_active ? 'border-slate-200 hover:border-emerald-300' : 'border-slate-200 opacity-60 bg-slate-50'
                  }`}
                >
                  <div>
                    {/* Header: Avatar, Name & Status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <SieAvatar
                          sie={s}
                          role={isBendaharaSie ? 'super_admin' : 'koordinator_sie'}
                          size="lg"
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold border border-slate-200">
                              {s.code}
                            </span>
                            {isBendaharaSie && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                                Kas Pusat
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {s.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                      {s.description || 'Tidak ada deskripsi tambahan.'}
                    </p>

                    {/* Account Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Koordinator:
                        </span>
                        <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                          {coord?.full_name || 'Belum diatur'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Key className="w-3.5 h-3.5 text-slate-400" />
                          User Login:
                        </span>
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                          {coord?.username || '-'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          Password:
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs">
                            {isPassVisible ? coord?.password || 'Wisuda2026!' : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(s.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                            title={isPassVisible ? 'Sembunyikan' : 'Tampilkan'}
                          >
                            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyCredentials(coord?.username || '', coord?.password || 'Wisuda2026!', s.id)
                            }
                            className="p-1 text-slate-400 hover:text-emerald-600 rounded-md"
                            title="Salin Akun Login"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  {isSuperAdmin && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditSieModal(s)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Ubah Data & Akun
                      </button>
                      {!isBendaharaSie && (
                        <button
                          onClick={() => toggleSieStatus(s.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            s.is_active
                              ? 'border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title={s.is_active ? 'Nonaktifkan Seksi' : 'Aktifkan Seksi'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ALL USERS & ROLES */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                placeholder="Cari nama, user login, no HP..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium">Peran:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Semua Peran</option>
                <option value="super_admin">Bendahara (Super Admin)</option>
                <option value="koordinator_sie">Koordinator Sie</option>
                <option value="viewer">Ketua / Viewer</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs">
                  <tr>
                    <th className="py-3 px-4">Pengguna</th>
                    <th className="py-3 px-4">Peran & Seksi</th>
                    <th className="py-3 px-4">User Login (Username)</th>
                    <th className="py-3 px-4">Password</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    {isSuperAdmin && <th className="py-3 px-4 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const uSie = sies.find((s) => s.id === u.sie_id);
                    const isPassVisible = !!visiblePasswords[u.id];
                    const isCopied = copiedId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <SieAvatar user={u} sie={uSie} size="md" />
                            <div>
                              <div className="font-bold text-slate-900">{u.full_name}</div>
                              {u.phone && (
                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3 h-3" />
                                  {u.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div>
                              {u.role === 'super_admin' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  <ShieldCheck className="w-3 h-3" /> Bendahara Utama
                                </span>
                              )}
                              {u.role === 'koordinator_sie' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                  <User className="w-3 h-3" /> Koordinator Sie
                                </span>
                              )}
                              {u.role === 'viewer' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                  <Shield className="w-3 h-3" /> Ketua / Viewer
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {uSie ? uSie.name : u.role === 'super_admin' ? 'Bendahara (Kas Pusat)' : 'Panitia Inti'}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-md border border-slate-200">
                            {u.username || '-'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-xs">
                              {isPassVisible ? u.password || 'Wisuda2026!' : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(u.id)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                              title={isPassVisible ? 'Sembunyikan' : 'Tampilkan'}
                            >
                              {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyCredentials(u.username || '', u.password || 'Wisuda2026!', u.id)
                              }
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded-md"
                              title="Salin Akun Login"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.is_active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {u.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>

                        {isSuperAdmin && (
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditUserModal(u)}
                                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Ubah Pengguna"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {u.id !== currentUser.id && (
                                <button
                                  onClick={() => toggleUserStatus(u.id)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    u.is_active
                                      ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                      : 'text-emerald-600 hover:bg-emerald-50'
                                  }`}
                                  title={u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                >
                                  <Power className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Seksi Baru */}
      {showAddSieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900">Tambah Seksi Baru</h3>
              </div>
              <button
                onClick={() => setShowAddSieModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {sieErrorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {sieErrorMsg}
              </div>
            )}

            <form onSubmit={handleAddSieSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Seksi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sieName}
                  onChange={(e) => {
                    setSieName(e.target.value);
                    if (!sieCode) {
                      setSieCode(`SIE-${e.target.value.toUpperCase().replace(/\s+/g, '-').slice(0, 8)}`);
                    }
                    if (!sieUsername) {
                      setSieUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                    }
                  }}
                  placeholder="Contoh: Sie Transportasi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kode Seksi (Singkatan)
                </label>
                <input
                  type="text"
                  value={sieCode}
                  onChange={(e) => setSieCode(e.target.value.toUpperCase())}
                  placeholder="SIE-TRANS"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi / Tugas Seksi
                </label>
                <textarea
                  rows={2}
                  value={sieDescription}
                  onChange={(e) => setSieDescription(e.target.value)}
                  placeholder="Tugas dan cakupan kerja seksi wisuda ini..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
                  Akun Koordinator & Login (Otomatis Dibuat)
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Koordinator
                    </label>
                    <input
                      type="text"
                      value={sieCoordinatorName}
                      onChange={(e) => setSieCoordinatorName(e.target.value)}
                      placeholder="Nama lengkap koordinator"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        User Login (Username) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={sieUsername}
                        onChange={(e) => setSieUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                        placeholder="username"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password Login
                      </label>
                      <div className="relative">
                        <input
                          type={showSiePasswordInModal ? 'text' : 'password'}
                          value={siePassword}
                          onChange={(e) => setSiePassword(e.target.value)}
                          placeholder="Password"
                          className="w-full px-3 py-2 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSiePasswordInModal(!showSiePasswordInModal)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showSiePasswordInModal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSieModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  Simpan & Buat Seksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ubah Seksi & Akun */}
      {editingSie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900">Ubah Seksi & Akun Login</h3>
              </div>
              <button
                onClick={() => setEditingSie(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {sieErrorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {sieErrorMsg}
              </div>
            )}

            <form onSubmit={handleEditSieSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Seksi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sieName}
                  onChange={(e) => setSieName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kode Seksi
                </label>
                <input
                  type="text"
                  value={sieCode}
                  onChange={(e) => setSieCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  value={sieDescription}
                  onChange={(e) => setSieDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Data Koordinator & Kredensial Login
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Koordinator
                  </label>
                  <input
                    type="text"
                    value={sieCoordinatorName}
                    onChange={(e) => setSieCoordinatorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      User Login (Username)
                    </label>
                    <input
                      type="text"
                      required
                      value={sieUsername}
                      onChange={(e) => setSieUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password Login
                    </label>
                    <div className="relative">
                      <input
                        type={showSiePasswordInModal ? 'text' : 'password'}
                        value={siePassword}
                        onChange={(e) => setSiePassword(e.target.value)}
                        className="w-full px-3 py-2 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSiePasswordInModal(!showSiePasswordInModal)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showSiePasswordInModal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSie(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Pengguna Baru */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserCog className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900">Tambah Akun Pengguna</h3>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {userErrorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {userErrorMsg}
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userFullName}
                  onChange={(e) => setUserFullName(e.target.value)}
                  placeholder="Contoh: Muhammad Ihsan, S.T."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    User Login (Username) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userUsername}
                    onChange={(e) => setUserUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="username"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password Login
                  </label>
                  <div className="relative">
                    <input
                      type={showUserPasswordInModal ? 'text' : 'password'}
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-3 py-2 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserPasswordInModal(!showUserPasswordInModal)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showUserPasswordInModal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Peran / Hak Akses
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="koordinator_sie">Koordinator Sie</option>
                    <option value="super_admin">Bendahara (Super Admin)</option>
                    <option value="viewer">Ketua Panitia / Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {userRole === 'koordinator_sie' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Afiliasi Seksi (Sie) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={userSieId}
                    onChange={(e) => setUserSieId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {sies.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ubah Pengguna */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900">Ubah Akun Pengguna</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {userErrorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {userErrorMsg}
              </div>
            )}

            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userFullName}
                  onChange={(e) => setUserFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    User Login (Username) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userUsername}
                    onChange={(e) => setUserUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password Login
                  </label>
                  <div className="relative">
                    <input
                      type={showUserPasswordInModal ? 'text' : 'password'}
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserPasswordInModal(!showUserPasswordInModal)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showUserPasswordInModal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Peran / Hak Akses
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="koordinator_sie">Koordinator Sie</option>
                    <option value="super_admin">Bendahara (Super Admin)</option>
                    <option value="viewer">Ketua Panitia / Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {userRole === 'koordinator_sie' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Afiliasi Seksi (Sie) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={userSieId}
                    onChange={(e) => setUserSieId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {sies.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
