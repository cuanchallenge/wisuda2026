import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Sie,
  Budget,
  IncomeTransaction,
  FundDisbursement,
  ExpenseTransaction,
  ExpenseReceipt,
  FundRequest,
  AuditLog,
  NotificationItem,
  SieFinancialSummary,
  CentralFinancialSummary,
} from '../types';
import { generateTransactionNo } from '../utils/formatters';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export const BENDAHARA_SIE: Sie = {
  id: 'sie-bendahara',
  name: 'Bendahara (Kas Pusat)',
  code: 'BENDAHARA',
  description: 'Pengeluaran operasional umum dan belanja langsung bersumber dari Kas Bendahara Pusat',
  coordinator_id: 'user-admin',
  is_active: true,
  created_at: '2026-09-01T00:00:00Z',
};

// Initial Mock Seed Data
const INITIAL_SIES: Sie[] = [
  BENDAHARA_SIE,
  {
    id: 'sie-001',
    name: 'Sie Perlengkapan',
    code: 'SIE-PERLENGKAPAN',
    description: 'Logistik panggung, sound system, tenda, kursi, dan kelistrikan wisuda',
    coordinator_id: 'user-perlengkapan',
    is_active: true,
    created_at: '2026-09-15T08:00:00Z',
  },
  {
    id: 'sie-002',
    name: 'Sie Konsumsi',
    code: 'SIE-KONSUMSI',
    description: 'Konsumsi tamu VIP/VVIP, wisudawan, orang tua, panitia, snack box & makan siang',
    coordinator_id: 'user-konsumsi',
    is_active: true,
    created_at: '2026-09-15T08:00:00Z',
  },
  {
    id: 'sie-003',
    name: 'Sie Acara',
    code: 'SIE-ACARA',
    description: 'Protokoler wisuda, MC, paduan suara, plakat, selempang, toga, sertifikat',
    coordinator_id: 'user-acara',
    is_active: true,
    created_at: '2026-09-15T08:00:00Z',
  },
  {
    id: 'sie-004',
    name: 'Sie Dokumentasi',
    code: 'SIE-DOKUMENTASI',
    description: 'Fotografi, videografi, live streaming YouTube, photobooth wisuda',
    coordinator_id: 'user-dok',
    is_active: true,
    created_at: '2026-09-15T08:00:00Z',
  },
  {
    id: 'sie-005',
    name: 'Sie Humas & Publikasi',
    code: 'SIE-HUMAS',
    description: 'Undangan pimpinan, banner baliho, publikasi media sosial, buku kenangan',
    coordinator_id: 'user-humas',
    is_active: true,
    created_at: '2026-09-15T08:00:00Z',
  },
  {
    id: 'sie-006',
    name: 'Sie Keamanan & Parkir',
    code: 'SIE-KEAMANAN',
    description: 'Pengamanan gedung, pengaturan lalulintas, koordinasi aparat & dishub',
    coordinator_id: undefined,
    is_active: true,
    created_at: '2026-09-15T08:00:00Z',
  },
  {
    id: 'sie-007',
    name: 'Sie Dekorasi',
    code: 'SIE-DEKORASI',
    description: 'Dekorasi bunga segar panggung kehormatan, backdrop, karpet merah, gate masuk',
    coordinator_id: undefined,
    is_active: true,
    created_at: '2026-09-15T08:00:00Z',
  },
];

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin',
    username: 'bendahara',
    password: 'Wisuda2026!',
    email: 'bendahara@wisuda-stibha.ac.id',
    full_name: 'MAHRUS',
    role: 'super_admin',
    sie_id: null,
    phone: '081234567890',
    is_active: true,
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'user-konsumsi',
    username: 'konsumsi',
    password: 'Wisuda2026!',
    email: 'sinta@wisuda-stibha.ac.id',
    full_name: 'Sinta Nurhaliza (Sie Konsumsi)',
    role: 'koordinator_sie',
    sie_id: 'sie-002',
    phone: '085712345678',
    is_active: true,
    created_at: '2026-09-02T08:00:00Z',
  },
  {
    id: 'user-perlengkapan',
    username: 'perlengkapan',
    password: 'Wisuda2026!',
    email: 'budi@wisuda-stibha.ac.id',
    full_name: 'Budi Santoso (Sie Perlengkapan)',
    role: 'koordinator_sie',
    sie_id: 'sie-001',
    phone: '081398765432',
    is_active: true,
    created_at: '2026-09-02T09:00:00Z',
  },
  {
    id: 'user-acara',
    username: 'acara',
    password: 'Wisuda2026!',
    email: 'rian@wisuda-stibha.ac.id',
    full_name: 'Rian Pratama (Sie Acara)',
    role: 'koordinator_sie',
    sie_id: 'sie-003',
    phone: '082155667788',
    is_active: true,
    created_at: '2026-09-03T09:00:00Z',
  },
  {
    id: 'user-dok',
    username: 'dokumentasi',
    password: 'Wisuda2026!',
    email: 'dok@wisuda-stibha.ac.id',
    full_name: 'Faisal Akbar (Sie Dokumentasi)',
    role: 'koordinator_sie',
    sie_id: 'sie-004',
    phone: '082233445566',
    is_active: true,
    created_at: '2026-09-03T10:00:00Z',
  },
  {
    id: 'user-humas',
    username: 'humas',
    password: 'Wisuda2026!',
    email: 'humas@wisuda-stibha.ac.id',
    full_name: 'Nadia Rahma (Sie Humas)',
    role: 'koordinator_sie',
    sie_id: 'sie-005',
    phone: '087788990011',
    is_active: true,
    created_at: '2026-09-03T11:00:00Z',
  },
  {
    id: 'user-viewer',
    username: 'ketua',
    password: 'Wisuda2026!',
    email: 'ketua@wisuda-stibha.ac.id',
    full_name: 'Dr. H. Muhammad Zaki, M.Pd. (Ketua Panitia)',
    role: 'viewer',
    sie_id: null,
    phone: '081122334455',
    is_active: true,
    created_at: '2026-09-01T07:00:00Z',
  },
];

const INITIAL_BUDGETS: Budget[] = [];

const INITIAL_INCOMES: IncomeTransaction[] = [];

const INITIAL_DISBURSEMENTS: FundDisbursement[] = [];

const INITIAL_EXPENSES: ExpenseTransaction[] = [];

const INITIAL_REQUESTS: FundRequest[] = [];

const INITIAL_AUDITS: AuditLog[] = [];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  sies: Sie[];
  budgets: Budget[];
  incomes: IncomeTransaction[];
  disbursements: FundDisbursement[];
  expenses: ExpenseTransaction[];
  fundRequests: FundRequest[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  isUsingSupabase: boolean;

  // Actions: User Management
  addUser: (userData: Omit<UserProfile, 'id' | 'created_at'>) => void;
  updateUser: (id: string, updates: Partial<UserProfile>) => void;
  toggleUserStatus: (id: string) => void;

  // Actions: Sie Management
  addSie: (sieData: Omit<Sie, 'id' | 'created_at'> & { username?: string; password?: string; coordinator_name?: string }) => void;
  updateSie: (id: string, updates: Partial<Sie> & { username?: string; password?: string; coordinator_name?: string }) => void;
  toggleSieStatus: (id: string) => void;

  // Actions: Budgets
  updateBudget: (sieId: string, amount: number, notes?: string) => void;

  // Actions: Income
  addIncome: (incomeData: Omit<IncomeTransaction, 'id' | 'transaction_no' | 'created_at' | 'created_by' | 'created_by_name'>) => void;
  deleteIncome: (id: string) => void;

  // Actions: Disbursement
  addDisbursement: (disbursementData: Omit<FundDisbursement, 'id' | 'transaction_no' | 'created_at' | 'created_by' | 'created_by_name'>) => { success: boolean; error?: string };
  deleteDisbursement: (id: string) => void;

  // Actions: Expense
  addExpense: (expenseData: Omit<ExpenseTransaction, 'id' | 'transaction_no' | 'created_at' | 'updated_at' | 'created_by' | 'created_by_name'>) => { success: boolean; error?: string };
  updateExpense: (id: string, updates: Partial<ExpenseTransaction>) => void;
  verifyExpense: (id: string, status: 'DITERIMA' | 'DITOLAK' | 'REVISI', notes?: string, reason?: string) => void;
  deleteExpense: (id: string) => void;

  // Actions: Fund Requests
  addFundRequest: (requestData: Omit<FundRequest, 'id' | 'request_no' | 'status' | 'created_at' | 'created_by' | 'created_by_name'>) => void;
  reviewFundRequest: (id: string, status: 'DISETUJUI' | 'DITOLAK', adminNotes?: string) => void;
  deleteFundRequest: (id: string) => void;

  // Actions: Notifications & Audits
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDefaultData: () => void;

  // Calculations
  centralSummary: CentralFinancialSummary;
  getSieSummary: (sieId: string) => SieFinancialSummary | undefined;
  allSieSummaries: SieFinancialSummary[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'wisuda_stibha_finance_state_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage if available
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [sies, setSies] = useState<Sie[]>(INITIAL_SIES);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [incomes, setIncomes] = useState<IncomeTransaction[]>(INITIAL_INCOMES);
  const [disbursements, setDisbursements] = useState<FundDisbursement[]>(INITIAL_DISBURSEMENTS);
  const [expenses, setExpenses] = useState<ExpenseTransaction[]>(INITIAL_EXPENSES);
  const [fundRequests, setFundRequests] = useState<FundRequest[]>(INITIAL_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDITS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const isUsingSupabase = isSupabaseConfigured();

  // Load saved state
  useEffect(() => {
    try {
      // Clear legacy storages
      localStorage.removeItem('wisuda_stibha_finance_state_v1');
      localStorage.removeItem('wisuda_stibha_finance_state_v2');
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.users && Array.isArray(parsed.users) && parsed.users.length > 0) {
          const existingUserIds = new Set(parsed.users.map((u: any) => u.id));
          const missingUsers = INITIAL_USERS.filter((init) => !existingUserIds.has(init.id));
          const mergedUsers = [...parsed.users, ...missingUsers].map((u: any) => {
            let fullName = u.full_name;
            if (u.id === 'user-admin' || u.username === 'bendahara' || u.role === 'super_admin') {
              if (!fullName || fullName.includes('Ahmad Fauzi')) {
                fullName = 'MAHRUS';
              }
            }
            return {
              ...u,
              full_name: fullName,
              username: u.username || (u.email ? u.email.split('@')[0] : `user_${u.id}`),
              password: u.password || 'Wisuda2026!',
            };
          });
          setUsers(mergedUsers);
        } else {
          setUsers(INITIAL_USERS);
        }

        if (parsed.currentUser) {
          let currFullName = parsed.currentUser.full_name;
          if (
            parsed.currentUser.id === 'user-admin' ||
            parsed.currentUser.username === 'bendahara' ||
            parsed.currentUser.role === 'super_admin'
          ) {
            if (!currFullName || currFullName.includes('Ahmad Fauzi')) {
              currFullName = 'MAHRUS';
            }
          }
          setCurrentUser({
            ...parsed.currentUser,
            full_name: currFullName,
            username: parsed.currentUser.username || (parsed.currentUser.email ? parsed.currentUser.email.split('@')[0] : 'user'),
            password: parsed.currentUser.password || 'Wisuda2026!',
          });
        }

        if (parsed.sies && Array.isArray(parsed.sies) && parsed.sies.length > 0) {
          const existingIds = new Set(parsed.sies.map((s: any) => s.id));
          const missingSies = INITIAL_SIES.filter((init) => !existingIds.has(init.id));
          const mergedSies = [...parsed.sies, ...missingSies].map((s: any) =>
            s.id === 'sie-bendahara' || s.code === 'BENDAHARA'
              ? { ...BENDAHARA_SIE, ...s, name: s.name || 'Bendahara (Kas Pusat)', code: 'BENDAHARA' }
              : s
          );
          setSies(mergedSies);
        } else {
          setSies(INITIAL_SIES);
        }

        if (parsed.budgets && Array.isArray(parsed.budgets)) {
          setBudgets(parsed.budgets);
        } else {
          setBudgets(INITIAL_BUDGETS);
        }

        if (parsed.incomes && Array.isArray(parsed.incomes)) setIncomes(parsed.incomes);
        if (parsed.disbursements && Array.isArray(parsed.disbursements)) setDisbursements(parsed.disbursements);
        if (parsed.expenses && Array.isArray(parsed.expenses)) {
          setExpenses(parsed.expenses.map((e: ExpenseTransaction) => ({ ...e, status: 'DITERIMA' })));
        }
        if (parsed.fundRequests && Array.isArray(parsed.fundRequests)) setFundRequests(parsed.fundRequests);
        if (parsed.auditLogs && Array.isArray(parsed.auditLogs)) setAuditLogs(parsed.auditLogs);
        if (parsed.notifications && Array.isArray(parsed.notifications)) setNotifications(parsed.notifications);
      }
    } catch (e) {
      console.warn('Failed to load saved state from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Persist state
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        users,
        currentUser,
        sies,
        budgets,
        incomes,
        disbursements,
        expenses,
        fundRequests,
        auditLogs,
        notifications,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }, [
    isLoaded,
    users,
    currentUser,
    sies,
    budgets,
    incomes,
    disbursements,
    expenses,
    fundRequests,
    auditLogs,
    notifications,
  ]);

  const logAudit = (action: string, entity_type: string, entity_id: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_role: currentUser.role,
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // User Actions
  const addUser = (userData: Omit<UserProfile, 'id' | 'created_at'>) => {
    const id = `user-${Date.now().toString(36)}`;
    const newUser: UserProfile = {
      ...userData,
      id,
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    logAudit('CREATE_USER', 'USER', id, `Membuat akun pengguna: ${userData.full_name} (@${userData.username}) role ${userData.role}`);
  };

  const updateUser = (id: string, updates: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
    // If user has sie_id assigned as koordinator_sie, keep sie.coordinator_id aligned
    if (updates.sie_id) {
      setSies((prev) =>
        prev.map((s) => (s.id === updates.sie_id ? { ...s, coordinator_id: id } : s))
      );
    }
    logAudit('UPDATE_USER', 'USER', id, `Mengubah data pengguna ID ${id}`);
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, is_active: !u.is_active };
          logAudit(
            updated.is_active ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
            'USER',
            id,
            `${updated.is_active ? 'Mengaktifkan' : 'Menonaktifkan'} user ${u.full_name}`
          );
          return updated;
        }
        return u;
      })
    );
  };

  // Sie Actions
  const addSie = (
    sieData: Omit<Sie, 'id' | 'created_at'> & { username?: string; password?: string; coordinator_name?: string }
  ) => {
    const id = `sie-${Date.now().toString(36)}`;
    let coordinatorId = sieData.coordinator_id;

    // If username is provided, create coordinator account for this Sie
    if (sieData.username && sieData.username.trim()) {
      const uId = `user-${Date.now().toString(36)}`;
      const newUser: UserProfile = {
        id: uId,
        username: sieData.username.trim().toLowerCase(),
        password: sieData.password?.trim() || 'Wisuda2026!',
        full_name: sieData.coordinator_name?.trim() || `${sieData.name} (Koordinator)`,
        role: 'koordinator_sie',
        sie_id: id,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      coordinatorId = uId;
      logAudit('CREATE_USER', 'USER', uId, `Membuat akun login koordinator [@${newUser.username}] untuk ${sieData.name}`);
    }

    const newSie: Sie = {
      name: sieData.name,
      code: sieData.code,
      description: sieData.description,
      coordinator_id: coordinatorId,
      is_active: sieData.is_active !== undefined ? sieData.is_active : true,
      id,
      created_at: new Date().toISOString(),
    };

    setSies((prev) => [...prev, newSie]);

    // Also create initial budget entry
    setBudgets((prev) => [
      ...prev,
      {
        id: `b-${id}`,
        sie_id: id,
        fiscal_year: 2026,
        allocated_amount: 0,
        notes: `Alokasi plafon untuk ${newSie.name}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    logAudit('CREATE_SIE', 'SIE', id, `Membuat Sie baru: ${sieData.name} (${sieData.code})`);
  };

  const updateSie = (
    id: string,
    updates: Partial<Sie> & { username?: string; password?: string; coordinator_name?: string }
  ) => {
    const isBendahara = id === 'sie-bendahara' || updates.code === 'BENDAHARA';

    // 1. Resolve and update coordinator user
    let updatedCoordId = updates.coordinator_id;

    // Look for matching user across multiple criteria
    const currentSie = sies.find((s) => s.id === id);
    const existingCoordUser = users.find(
      (u) =>
        (updates.coordinator_id && u.id === updates.coordinator_id) ||
        (currentSie?.coordinator_id && u.id === currentSie.coordinator_id) ||
        (isBendahara && (u.role === 'super_admin' || u.id === 'user-admin')) ||
        (u.sie_id === id && u.role === 'koordinator_sie') ||
        (u.sie_id === id)
    );

    if (existingCoordUser) {
      updatedCoordId = existingCoordUser.id;
      const userUpdates: Partial<UserProfile> = {};
      if (updates.coordinator_name !== undefined && updates.coordinator_name.trim() !== '') {
        userUpdates.full_name = updates.coordinator_name.trim();
      }
      if (updates.username !== undefined && updates.username.trim() !== '') {
        userUpdates.username = updates.username.trim().toLowerCase();
      }
      if (updates.password !== undefined && updates.password.trim() !== '') {
        userUpdates.password = updates.password.trim();
      }
      userUpdates.sie_id = isBendahara ? 'sie-bendahara' : id;

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === existingCoordUser.id ? { ...u, ...userUpdates } : u))
      );

      if (currentUser.id === existingCoordUser.id) {
        setCurrentUser((prev) => ({ ...prev, ...userUpdates }));
      }
    } else if (updates.username && updates.username.trim()) {
      // Create new coordinator user if none existed
      const newUId = `user-${Date.now().toString(36)}`;
      updatedCoordId = newUId;
      const newUser: UserProfile = {
        id: newUId,
        username: updates.username.trim().toLowerCase(),
        password: updates.password?.trim() || 'Wisuda2026!',
        full_name: updates.coordinator_name?.trim() || `Koordinator ${updates.name || 'Sie'}`,
        role: isBendahara ? 'super_admin' : 'koordinator_sie',
        sie_id: id,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setUsers((prevUsers) => [...prevUsers, newUser]);
    }

    // 2. Update Sie in sies state
    setSies((prevSies) =>
      prevSies.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            name: updates.name !== undefined ? updates.name : s.name,
            code: updates.code !== undefined ? updates.code : s.code,
            description: updates.description !== undefined ? updates.description : s.description,
            coordinator_id: updatedCoordId !== undefined ? updatedCoordId : s.coordinator_id,
            is_active: updates.is_active !== undefined ? updates.is_active : s.is_active,
          };
        }
        return s;
      })
    );

    logAudit('UPDATE_SIE', 'SIE', id, `Mengubah informasi Sie & Akun Login ID ${id}`);
  };

  const toggleSieStatus = (id: string) => {
    setSies((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, is_active: !s.is_active };
          logAudit('TOGGLE_SIE', 'SIE', id, `Status Sie ${s.name} diubah menjadi ${updated.is_active ? 'Aktif' : 'Nonaktif'}`);
          return updated;
        }
        return s;
      })
    );
  };

  // Budget Actions
  const updateBudget = (sieId: string, amount: number, notes?: string) => {
    const sie = sies.find((s) => s.id === sieId);
    setBudgets((prev) => {
      const exists = prev.find((b) => b.sie_id === sieId);
      if (exists) {
        return prev.map((b) =>
          b.sie_id === sieId
            ? { ...b, allocated_amount: amount, notes: notes || b.notes, updated_at: new Date().toISOString() }
            : b
        );
      }
      return [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sie_id: sieId,
          fiscal_year: 2026,
          allocated_amount: amount,
          notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    });
    logAudit('UPDATE_BUDGET', 'BUDGET', sieId, `Mengatur anggaran untuk ${sie?.name || sieId} menjadi Rp${amount.toLocaleString('id-ID')}`);
  };

  // Calculations
  const calculateCentral = (): CentralFinancialSummary => {
    const total_income = incomes
      .filter((i) => !i.deleted_at)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const total_disbursed = disbursements
      .filter((d) => !d.deleted_at)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const direct_bendahara_expenses = expenses
      .filter((e) => !e.deleted_at && (e.sie_id === 'sie-bendahara' || e.sie_id === 'BENDAHARA'))
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const central_cash_balance = total_income - total_disbursed - direct_bendahara_expenses;

    const total_budget_allocated = budgets.reduce((acc, b) => acc + Number(b.allocated_amount), 0);

    const total_expenses_approved = expenses
      .filter((e) => !e.deleted_at)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const total_pending_verifications = 0;

    const total_sie_expenses = expenses
      .filter((e) => !e.deleted_at && e.sie_id !== 'sie-bendahara' && e.sie_id !== 'BENDAHARA')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const unused_disbursed_funds = Math.max(0, total_disbursed - total_sie_expenses);

    return {
      total_income,
      total_disbursed,
      central_cash_balance,
      total_budget_allocated,
      total_expenses_approved,
      total_pending_verifications,
      unused_disbursed_funds,
    };
  };

  const getSieSummary = (sieId: string): SieFinancialSummary | undefined => {
    let sie = sies.find((s) => s.id === sieId);
    if (!sie && (sieId === 'sie-bendahara' || sieId === 'BENDAHARA')) {
      sie = BENDAHARA_SIE;
    }
    if (!sie) return undefined;

    // Special handling for Bendahara (Kas Pusat)
    if (sie.id === 'sie-bendahara' || sie.code === 'BENDAHARA') {
      const total_income = incomes
        .filter((i) => !i.deleted_at)
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      const total_disbursed = disbursements
        .filter((d) => !d.deleted_at)
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      const direct_bendahara_expenses = expenses
        .filter((e) => !e.deleted_at && (e.sie_id === 'sie-bendahara' || e.sie_id === 'BENDAHARA'))
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      const central_cash_balance = total_income - total_disbursed - direct_bendahara_expenses;

      return {
        sie,
        budget: total_income,
        disbursed: total_income - total_disbursed,
        total_expenses_approved: direct_bendahara_expenses,
        total_expenses_pending: 0,
        remaining_balance: Math.max(0, central_cash_balance),
        budget_utilization_rate: total_income > 0 ? Number(((direct_bendahara_expenses / total_income) * 100).toFixed(1)) : 0,
        status: central_cash_balance < 0 ? 'danger' : 'safe',
      };
    }

    const budget = budgets.find((b) => b.sie_id === sieId)?.allocated_amount || 0;

    const disbursed = disbursements
      .filter((d) => !d.deleted_at && d.sie_id === sieId)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const total_expenses_approved = expenses
      .filter((e) => !e.deleted_at && e.sie_id === sieId)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const total_expenses_pending = 0;

    const remaining_balance = disbursed - total_expenses_approved;

    const utilization = budget > 0 ? (total_expenses_approved / budget) * 100 : 0;

    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (utilization >= 90 || total_expenses_approved > budget) {
      status = 'danger';
    } else if (utilization >= 75) {
      status = 'warning';
    }

    return {
      sie,
      budget,
      disbursed,
      total_expenses_approved,
      total_expenses_pending,
      remaining_balance,
      budget_utilization_rate: Number(utilization.toFixed(1)),
      status,
    };
  };

  const centralSummary = calculateCentral();

  const allSieSummaries: SieFinancialSummary[] = sies
    .filter((sie) => sie.id !== 'sie-bendahara' && sie.code !== 'BENDAHARA')
    .map((sie) => {
      return getSieSummary(sie.id)!;
    })
    .filter(Boolean);

  // Income Action
  const addIncome = (incomeData: Omit<IncomeTransaction, 'id' | 'transaction_no' | 'created_at' | 'created_by' | 'created_by_name'>) => {
    const txNo = generateTransactionNo('IN');
    const newIncome: IncomeTransaction = {
      ...incomeData,
      id: `inc-${Date.now()}`,
      transaction_no: txNo,
      created_by: currentUser.id,
      created_by_name: currentUser.full_name,
      created_at: new Date().toISOString(),
    };
    setIncomes((prev) => [newIncome, ...prev]);
    logAudit('INPUT_PEMASUKAN', 'INCOME', txNo, `Mencatat pemasukan [${txNo}] dari "${incomeData.source}" sebesar Rp${Number(incomeData.amount).toLocaleString('id-ID')}`);
  };

  const deleteIncome = (id: string) => {
    const target = incomes.find((i) => i.id === id);
    if (!target) return;

    setIncomes((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, deleted_at: new Date().toISOString() } : i
      )
    );
    logAudit(
      'DELETE_PEMASUKAN_SOFT',
      'INCOME',
      target.transaction_no,
      `Melakukan penghapusan (batal/koreksi input) pemasukan [${target.transaction_no}] dari "${target.source}" sebesar Rp${Number(target.amount).toLocaleString('id-ID')}`
    );
  };

  // Disbursement Action
  const addDisbursement = (disbursementData: Omit<FundDisbursement, 'id' | 'transaction_no' | 'created_at' | 'created_by' | 'created_by_name'>) => {
    // Validate that Central Cash balance has enough funds
    if (disbursementData.amount > centralSummary.central_cash_balance) {
      return {
        success: false,
        error: `Saldo Kas Pusat tidak mencukupi! Tersedia: Rp${centralSummary.central_cash_balance.toLocaleString('id-ID')}, Diminta: Rp${Number(disbursementData.amount).toLocaleString('id-ID')}`,
      };
    }

    const txNo = generateTransactionNo('OUT');
    const newDisb: FundDisbursement = {
      ...disbursementData,
      id: `disb-${Date.now()}`,
      transaction_no: txNo,
      created_by: currentUser.id,
      created_by_name: currentUser.full_name,
      created_at: new Date().toISOString(),
    };
    setDisbursements((prev) => [newDisb, ...prev]);

    const sie = sies.find((s) => s.id === disbursementData.sie_id);
    logAudit('PENCAIRAN_DANA', 'DISBURSEMENT', txNo, `Mencairkan dana [${txNo}] ke ${sie?.name} sebesar Rp${Number(disbursementData.amount).toLocaleString('id-ID')} (${disbursementData.phase})`);

    // Add internal notification for the Sie
    addNotification({
      target_role: 'koordinator_sie',
      target_sie_id: disbursementData.sie_id,
      title: 'Dana Telah Dicairkan!',
      message: `Bendahara telah mencairkan dana ${disbursementData.phase} sebesar Rp${Number(disbursementData.amount).toLocaleString('id-ID')} untuk ${sie?.name}.`,
      type: 'success',
      link_to: 'budget',
    });

    return { success: true };
  };

  const deleteDisbursement = (id: string) => {
    const target = disbursements.find((d) => d.id === id);
    if (!target) return;

    setDisbursements((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, deleted_at: new Date().toISOString() } : d
      )
    );
    const sie = sies.find((s) => s.id === target.sie_id);
    logAudit(
      'DELETE_PENCAIRAN_SOFT',
      'DISBURSEMENT',
      target.transaction_no,
      `Melakukan penghapusan (batal/koreksi input) pencairan dana [${target.transaction_no}] ke ${sie?.name || target.sie_id} sebesar Rp${Number(target.amount).toLocaleString('id-ID')}`
    );
  };

  // Expense Action
  const addExpense = (expenseData: Omit<ExpenseTransaction, 'id' | 'transaction_no' | 'created_at' | 'updated_at' | 'created_by' | 'created_by_name'>) => {
    const isBendaharaExpense = expenseData.sie_id === 'sie-bendahara' || expenseData.sie_id === 'BENDAHARA';
    const sieSummary = getSieSummary(expenseData.sie_id);
    if (!sieSummary) {
      return { success: false, error: 'Seksi pemilik transaksi tidak ditemukan.' };
    }

    // Safety check: Cannot exceed current available balance of Sie or Central Cash
    if (expenseData.amount > sieSummary.remaining_balance) {
      if (isBendaharaExpense) {
        return {
          success: false,
          error: `Saldo Kas Bendahara (Pusat) tidak mencukupi! Sisa dana riil Kas Pusat saat ini adalah Rp${sieSummary.remaining_balance.toLocaleString('id-ID')}, sedangkan pengeluaran sebesar Rp${Number(expenseData.amount).toLocaleString('id-ID')}.`,
        };
      }
      return {
        success: false,
        error: `Saldo kas ${sieSummary.sie.name} tidak mencukupi! Sisa dana riil saat ini adalah Rp${sieSummary.remaining_balance.toLocaleString('id-ID')}, sedangkan pengeluaran sebesar Rp${Number(expenseData.amount).toLocaleString('id-ID')}. Silakan ajukan Permintaan Dana Tambahan terlebih dahulu.`,
      };
    }

    const txNo = generateTransactionNo('EXP');
    const newExpense: ExpenseTransaction = {
      ...expenseData,
      status: 'DITERIMA',
      id: `exp-${Date.now()}`,
      transaction_no: txNo,
      created_by: currentUser.id,
      created_by_name: currentUser.full_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);

    const sourceLabel = isBendaharaExpense ? 'Kas Bendahara (Kas Pusat)' : sieSummary.sie.name;
    logAudit(
      'CATAT_PENGELUARAN',
      'EXPENSE',
      txNo,
      `Mencatat pengeluaran [${txNo}] untuk "${expenseData.item_name}" sebesar Rp${Number(expenseData.amount).toLocaleString('id-ID')} (Sumber: ${sourceLabel})`
    );

    // Notify Admins
    addNotification({
      target_role: 'super_admin',
      title: 'Pengeluaran Baru Dicatat',
      message: `${isBendaharaExpense ? 'Bendahara (Kas Pusat)' : sieSummary.sie.name} mencatat pengeluaran [${txNo}] "${expenseData.item_name}" sebesar Rp${Number(expenseData.amount).toLocaleString('id-ID')}.`,
      type: 'info',
      link_to: 'expenses',
    });

    return { success: true };
  };

  const updateExpense = (id: string, updates: Partial<ExpenseTransaction>) => {
    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const updated = { ...e, ...updates, updated_at: new Date().toISOString() };
          logAudit('UPDATE_PENGELUARAN', 'EXPENSE', e.transaction_no, `Memperbarui rincian pengeluaran [${e.transaction_no}]`);
          return updated;
        }
        return e;
      })
    );
  };

  const verifyExpense = (
    id: string,
    status: 'DITERIMA' | 'DITOLAK' | 'REVISI',
    notes?: string,
    reason?: string
  ) => {
    const target = expenses.find((e) => e.id === id);
    if (!target) return;

    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            status,
            admin_notes: notes || e.admin_notes,
            rejection_reason: reason || e.rejection_reason,
            updated_at: new Date().toISOString(),
          };
        }
        return e;
      })
    );

    const actionText = status === 'DITERIMA' ? 'VERIFIKASI_SETUJU' : status === 'DITOLAK' ? 'VERIFIKASI_TOLAK' : 'VERIFIKASI_REVISI';
    logAudit(actionText, 'EXPENSE', target.transaction_no, `Status pengeluaran [${target.transaction_no}] "${target.item_name}" diubah menjadi ${status}. ${reason ? 'Alasan: ' + reason : ''}`);

    // Notify coordinator
    const sie = sies.find((s) => s.id === target.sie_id);
    let notifTitle = 'Pengeluaran Disetujui';
    let notifType: 'success' | 'error' | 'warning' = 'success';
    let notifMsg = `Pengeluaran [${target.transaction_no}] "${target.item_name}" sebesar Rp${Number(target.amount).toLocaleString('id-ID')} telah diverifikasi dan disetujui.`;

    if (status === 'DITOLAK') {
      notifTitle = 'Pengeluaran Ditolak';
      notifType = 'error';
      notifMsg = `Pengeluaran [${target.transaction_no}] ditolak. Alasan: ${reason || 'Tidak memenuhi kriteria'}`;
    } else if (status === 'REVISI') {
      notifTitle = 'Pengeluaran Butuh Revisi Bukti';
      notifType = 'warning';
      notifMsg = `Pengeluaran [${target.transaction_no}] memerlukan revisi. Catatan: ${notes || reason || 'Perbaiki bukti nota/kwitansi'}`;
    }

    addNotification({
      target_user_id: target.created_by,
      target_role: 'koordinator_sie',
      target_sie_id: target.sie_id,
      title: notifTitle,
      message: notifMsg,
      type: notifType,
      link_to: 'expenses',
    });
  };

  const deleteExpense = (id: string) => {
    const target = expenses.find((e) => e.id === id);
    if (!target) return;

    // Soft delete policy as required in #28
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, deleted_at: new Date().toISOString() } : e
      )
    );
    logAudit('DELETE_PENGELUARAN_SOFT', 'EXPENSE', target.transaction_no, `Melakukan penghapusan (soft-delete) pengeluaran [${target.transaction_no}]`);
  };

  // Fund Requests
  const addFundRequest = (requestData: Omit<FundRequest, 'id' | 'request_no' | 'status' | 'created_at' | 'created_by' | 'created_by_name'>) => {
    const reqNo = generateTransactionNo('REQ');
    const newReq: FundRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      request_no: reqNo,
      status: 'DIAJUKAN',
      created_by: currentUser.id,
      created_by_name: currentUser.full_name,
      created_at: new Date().toISOString(),
    };
    setFundRequests((prev) => [newReq, ...prev]);

    const sie = sies.find((s) => s.id === requestData.sie_id);
    logAudit('PENGAJUAN_DANA_TAMBAHAN', 'FUND_REQUEST', reqNo, `Mengajukan dana tambahan [${reqNo}] sebesar Rp${Number(requestData.amount).toLocaleString('id-ID')} untuk ${sie?.name}`);

    // Notify admin
    addNotification({
      target_role: 'super_admin',
      title: 'Permintaan Dana Tambahan Baru',
      message: `${sie?.name} mengajukan tambahan dana sebesar Rp${Number(requestData.amount).toLocaleString('id-ID')}. Alasan: ${requestData.reason}`,
      type: 'info',
      link_to: 'fund-requests',
    });
  };

  const reviewFundRequest = (id: string, status: 'DISETUJUI' | 'DITOLAK', adminNotes?: string) => {
    const target = fundRequests.find((r) => r.id === id);
    if (!target) return;

    setFundRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              admin_notes: adminNotes,
              reviewed_at: new Date().toISOString(),
              reviewed_by: currentUser.id,
            }
          : r
      )
    );

    const sie = sies.find((s) => s.id === target.sie_id);

    // If approved, automatically disburse into Sie funds!
    if (status === 'DISETUJUI') {
      const txNo = generateTransactionNo('OUT');
      const autoDisb: FundDisbursement = {
        id: `disb-auto-${Date.now()}`,
        transaction_no: txNo,
        sie_id: target.sie_id,
        date: new Date().toISOString().split('T')[0],
        amount: target.amount,
        phase: 'Dana Tambahan Disetujui',
        description: `Pencairan dana tambahan atas permohonan [${target.request_no}]: ${target.reason}`,
        notes: adminNotes || 'Disetujui oleh Bendahara',
        created_by: currentUser.id,
        created_by_name: currentUser.full_name,
        created_at: new Date().toISOString(),
      };
      setDisbursements((prev) => [autoDisb, ...prev]);

      // Increase budget ceiling too so utilization stays transparent
      setBudgets((prev) =>
        prev.map((b) =>
          b.sie_id === target.sie_id
            ? { ...b, allocated_amount: b.allocated_amount + target.amount, updated_at: new Date().toISOString() }
            : b
        )
      );

      logAudit('APPROVE_DANA_TAMBAHAN', 'FUND_REQUEST', target.request_no, `Menyetujui permohonan dana tambahan [${target.request_no}] dan mencairkan Rp${Number(target.amount).toLocaleString('id-ID')}`);
    } else {
      logAudit('REJECT_DANA_TAMBAHAN', 'FUND_REQUEST', target.request_no, `Menolak permohonan dana tambahan [${target.request_no}]. Catatan: ${adminNotes || '-'}`);
    }

    addNotification({
      target_user_id: target.created_by,
      target_role: 'koordinator_sie',
      target_sie_id: target.sie_id,
      title: status === 'DISETUJUI' ? 'Dana Tambahan Disetujui & Dicairkan!' : 'Permintaan Dana Ditolak',
      message: `Permintaan dana tambahan [${target.request_no}] sebesar Rp${Number(target.amount).toLocaleString('id-ID')} telah ${status}. ${adminNotes ? 'Catatan: ' + adminNotes : ''}`,
      type: status === 'DISETUJUI' ? 'success' : 'error',
      link_to: 'fund-requests',
    });
  };

  const deleteFundRequest = (id: string) => {
    const target = fundRequests.find((r) => r.id === id);
    if (!target) return;

    setFundRequests((prev) => prev.filter((r) => r.id !== id));
    logAudit(
      'DELETE_PERMINTAAN_DANA',
      'FUND_REQUEST',
      target.request_no,
      `Menghapus permohonan dana tambahan [${target.request_no}]`
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const resetToDefaultData = () => {
    // Deep clone initial datasets to prevent reference mutations and ensure default data is never lost
    const defaultUsers = JSON.parse(JSON.stringify(INITIAL_USERS));
    const defaultCurrentUser = defaultUsers[0];
    const defaultSies = JSON.parse(JSON.stringify(INITIAL_SIES));
    const defaultBudgets = JSON.parse(JSON.stringify(INITIAL_BUDGETS));
    const defaultIncomes = JSON.parse(JSON.stringify(INITIAL_INCOMES));
    const defaultDisbursements = JSON.parse(JSON.stringify(INITIAL_DISBURSEMENTS));
    const defaultExpenses = JSON.parse(JSON.stringify(INITIAL_EXPENSES));
    const defaultRequests = JSON.parse(JSON.stringify(INITIAL_REQUESTS));
    const defaultAudits = JSON.parse(JSON.stringify(INITIAL_AUDITS));
    const defaultNotifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));

    setUsers(defaultUsers);
    setCurrentUser(defaultCurrentUser);
    setSies(defaultSies);
    setBudgets(defaultBudgets);
    setIncomes(defaultIncomes);
    setDisbursements(defaultDisbursements);
    setExpenses(defaultExpenses);
    setFundRequests(defaultRequests);
    setAuditLogs(defaultAudits);
    setNotifications(defaultNotifications);

    // Immediately save complete default data to localStorage so it is never blank on reload
    const stateToSave = {
      users: defaultUsers,
      currentUser: defaultCurrentUser,
      sies: defaultSies,
      budgets: defaultBudgets,
      incomes: defaultIncomes,
      disbursements: defaultDisbursements,
      expenses: defaultExpenses,
      fundRequests: defaultRequests,
      auditLogs: defaultAudits,
      notifications: defaultNotifications,
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save default state to localStorage:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        sies,
        budgets,
        incomes,
        disbursements,
        expenses,
        fundRequests,
        auditLogs,
        notifications,
        isUsingSupabase,
        addUser,
        updateUser,
        toggleUserStatus,
        addSie,
        updateSie,
        toggleSieStatus,
        updateBudget,
        addIncome,
        deleteIncome,
        addDisbursement,
        deleteDisbursement,
        addExpense,
        updateExpense,
        verifyExpense,
        deleteExpense,
        addFundRequest,
        reviewFundRequest,
        deleteFundRequest,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDefaultData,
        centralSummary,
        getSieSummary,
        allSieSummaries,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
