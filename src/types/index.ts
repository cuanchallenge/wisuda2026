export type UserRole = 'super_admin' | 'koordinator_sie' | 'viewer';

export type ExpenseStatus = 'DRAFT' | 'DIAJUKAN' | 'DITERIMA' | 'DITOLAK' | 'REVISI';

export type FundRequestStatus = 'DIAJUKAN' | 'DISETUJUI' | 'DITOLAK';

export type PaymentMethod = 'TRANSFER' | 'TUNAI' | 'KARTU_DEBIT' | 'QRIS' | 'LAINNYA';

export interface Sie {
  id: string;
  name: string;
  code: string;
  description?: string;
  coordinator_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  password?: string;
  email?: string;
  full_name: string;
  role: UserRole;
  sie_id?: string | null;
  phone?: string;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface IncomeTransaction {
  id: string;
  transaction_no: string;
  date: string;
  source: string;
  category: string;
  amount: number;
  description: string;
  receipt_url?: string;
  notes?: string;
  created_by: string;
  created_by_name?: string;
  created_at: string;
  deleted_at?: string | null;
}

export interface Budget {
  id: string;
  sie_id: string;
  fiscal_year: number;
  allocated_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FundDisbursement {
  id: string;
  transaction_no: string;
  sie_id: string;
  date: string;
  amount: number;
  phase: string; // e.g., 'Tahap 1', 'Tahap 2', 'Uang Muka'
  description: string;
  proof_url?: string;
  notes?: string;
  created_by: string;
  created_by_name?: string;
  created_at: string;
  deleted_at?: string | null;
}

export interface ExpenseReceipt {
  id: string;
  expense_id: string;
  file_path: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  uploaded_at: string;
}

export interface ExpenseTransaction {
  id: string;
  transaction_no: string;
  sie_id: string;
  date: string;
  category: string;
  item_name: string;
  vendor?: string;
  amount: number;
  payment_method: PaymentMethod;
  description: string;
  status: ExpenseStatus;
  rejection_reason?: string;
  admin_notes?: string;
  receipts: ExpenseReceipt[];
  created_by: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface FundRequest {
  id: string;
  request_no: string;
  sie_id: string;
  amount: number;
  reason: string;
  description?: string;
  proof_url?: string;
  status: FundRequestStatus;
  admin_notes?: string;
  created_by: string;
  created_by_name?: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  target_user_id?: string;
  target_role?: UserRole;
  target_sie_id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  link_to?: string;
  created_at: string;
}

export interface SieFinancialSummary {
  sie: Sie;
  budget: number;
  disbursed: number;
  total_expenses_approved: number;
  total_expenses_pending: number;
  remaining_balance: number; // Disbursed - Approved
  budget_utilization_rate: number; // (Approved / Budget) * 100
  status: 'safe' | 'warning' | 'danger';
}

export interface CentralFinancialSummary {
  total_income: number;
  total_disbursed: number;
  central_cash_balance: number; // Income - Disbursed
  total_budget_allocated: number;
  total_expenses_approved: number;
  total_pending_verifications: number;
  unused_disbursed_funds: number; // Disbursed - Approved across all Sies
}
