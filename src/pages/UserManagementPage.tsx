import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCog,
  Plus,
  Edit,
  Power,
  Shield,
  Search,
  Key,
  Eye,
  EyeOff,
  User,
  Copy,
  Check,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { SieAvatar } from '../components/SieAvatar';

export const UserManagementPage: React.FC = () => {
  const { users, sies, addUser, updateUser, toggleUserStatus, currentUser } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Wisuda2026!');
  const [role, setRole] = useState<UserRole>('koordinator_sie');
  const [sieId, setSieId] = useState<string>(sies[0]?.id || '');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [errorMsg, setErrorMsg] = useState('');
  const [showModalPassword, setShowModalPassword] = useState(false);

  // Table password visibility
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isSuperAdmin = currentUser.role === 'super_admin';

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(searchTerm));
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCredentials = (uName: string, pass: string, id: string) => {
    navigator.clipboard.writeText(`User Login: ${uName}\nPassword: ${pass}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !username.trim()) {
      setErrorMsg('Nama lengkap dan User Login (username) wajib diisi.');
      return;
    }

    if (role === 'koordinator_sie' && !sieId) {
      setErrorMsg('Koordinator Sie wajib memilih salah satu Seksi.');
      return;
    }

    // Check duplicate username
    const normalizedUser = username.trim().toLowerCase();
    if (users.some((u) => u.username?.toLowerCase() === normalizedUser)) {
      setErrorMsg(`User Login "${username}" sudah digunakan oleh akun lain.`);
      return;
    }

    addUser({
      username: normalizedUser,
      password: password.trim() || 'Wisuda2026!',
      full_name: fullName.trim(),
      role,
      sie_id: role === 'koordinator_sie' ? sieId : null,
      phone: phone.trim() || undefined,
      is_active: isActive,
    });

    setShowAddModal(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setErrorMsg('');

    if (!fullName.trim() || !username.trim()) {
      setErrorMsg('Nama lengkap dan User Login (username) wajib diisi.');
      return;
    }

    if (role === 'koordinator_sie' && !sieId) {
      setErrorMsg('Koordinator Sie wajib memilih salah satu Seksi.');
      return;
    }

    const normalizedUser = username.trim().toLowerCase();
    if (users.some((u) => u.username?.toLowerCase() === normalizedUser && u.id !== editingUser.id)) {
      setErrorMsg(`User Login "${username}" sudah digunakan oleh akun lain.`);
      return;
    }

    updateUser(editingUser.id, {
      full_name: fullName.trim(),
      username: normalizedUser,
      password: password.trim() !== '' ? password.trim() : editingUser.password,
      role,
      sie_id: role === 'koordinator_sie' ? sieId : null,
      phone: phone.trim() || undefined,
      is_active: isActive,
    });

    setEditingUser(null);
    resetForm();
  };

  const startEdit = (u: UserProfile) => {
    setEditingUser(u);
    setFullName(u.full_name);
    setUsername(u.username || u.email?.split('@')[0] || '');
    setPassword(u.password || 'Wisuda2026!');
    setRole(u.role);
    setSieId(u.sie_id || sies[0]?.id || '');
    setPhone(u.phone || '');
    setIsActive(u.is_active);
    setErrorMsg('');
  };

  const resetForm = () => {
    setFullName('');
    setUsername('');
    setPassword('Wisuda2026!');
    setRole('koordinator_sie');
    setSieId(sies[0]?.id || '');
    setPhone('');
    setIsActive(true);
    setErrorMsg('');
    setShowModalPassword(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UserCog className="w-6 h-6 text-emerald-600" />
            Manajemen Pengguna &amp; Akun Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pengelolaan User Login (Username) &amp; Kata Sandi seluruh panitia wisuda tanpa email.
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
            <Plus className="w-4 h-4" /> + Tambah Pengguna Baru
          </button>
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
            placeholder="Cari nama, user login, no HP..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-emerald-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 whitespace-nowrap">Filter Peran:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
          >
            <option value="ALL">Semua Peran</option>
            <option value="super_admin">Super Admin / Bendahara</option>
            <option value="koordinator_sie">Koordinator Sie</option>
            <option value="viewer">Viewer / Ketua</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Nama Lengkap</th>
                <th className="py-3.5 px-4">User Login (Username)</th>
                <th className="py-3.5 px-4">Kata Sandi</th>
                <th className="py-3.5 px-4">Peran Akses</th>
                <th className="py-3.5 px-4">Seksi Ditugaskan</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const assignedSie = sies.find((s) => s.id === u.sie_id);
                const isPassVisible = visiblePasswords[u.id] || false;
                const currentPass = u.password || 'Wisuda2026!';
                const currentUName = u.username || u.email?.split('@')[0] || 'user';

                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <SieAvatar user={u} sie={assignedSie} size="sm" />
                        <span className="font-bold text-slate-900">{u.full_name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                        @{currentUName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-800 font-semibold bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {isPassVisible ? currentPass : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(u.id)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title={isPassVisible ? 'Sembunyikan' : 'Lihat kata sandi'}
                        >
                          {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyCredentials(currentUName, currentPass, u.id)}
                          className="text-slate-400 hover:text-emerald-700 p-0.5 ml-1"
                          title="Salin kredensial"
                        >
                          {copiedId === u.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          u.role === 'super_admin'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : u.role === 'koordinator_sie'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {u.role === 'super_admin'
                          ? 'Super Admin'
                          : u.role === 'koordinator_sie'
                          ? 'Koordinator'
                          : 'Viewer'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {assignedSie ? (
                        <div>
                          <span className="font-semibold text-slate-800 block">{assignedSie.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{assignedSie.code}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {u.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => startEdit(u)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit Pengguna"
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
                            title={u.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 text-base">
              {editingUser ? 'Edit Pengguna & Akun Login' : 'Tambah Pengguna Panitia Baru'}
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Atur nama, user login (username), dan kata sandi tanpa memerlukan email.
            </p>

            <form onSubmit={editingUser ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Sinta Nurhaliza"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 font-medium text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">User Login / Username *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="Contoh: konsumsi, bendahara, acara"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-emerald-500"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Digunakan untuk masuk ke sistem (huruf kecil tanpa spasi)
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Kata Sandi (Password) *</label>
                <div className="relative">
                  <input
                    type={showModalPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata sandi akun"
                    className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPassword(!showModalPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showModalPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Peran (Role) *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-emerald-500 text-xs"
                  >
                    <option value="koordinator_sie">Koordinator Sie</option>
                    <option value="super_admin">Super Admin / Bendahara</option>
                    <option value="viewer">Viewer / Ketua Panitia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status Akun *</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-emerald-500 text-xs"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
              </div>

              {/* Sie selection (MANDATORY if role is koordinator_sie) */}
              {role === 'koordinator_sie' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Tugaskan ke Seksi *
                  </label>
                  <select
                    value={sieId}
                    onChange={(e) => setSieId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/40 font-semibold text-emerald-950 focus:outline-emerald-500 text-xs"
                    required
                  >
                    {sies.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-emerald-700 mt-1 block">
                    User hanya dapat mengakses kas dan mencatat pengeluaran seksi ini.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890 (opsional)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:outline-emerald-500 text-xs"
                />
              </div>

              {/* Live Preview Foto Profil Avatar Orang */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <SieAvatar
                  user={{ full_name: fullName || 'Nama Pengguna', role, sie_id: sieId }}
                  sieName={sies.find((s) => s.id === sieId)?.name}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {fullName.trim() || 'Nama Pengguna'}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    Foto profil otomatis: Icon avatar orang
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Buat Akun Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
