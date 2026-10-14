-- ============================================================================
-- WISUDA STIBHA 2026 - SISTEM MANAJEMEN KEUANGAN ACARA WISUDA
-- DATABASE SCHEMA, ROW LEVEL SECURITY (RLS), STORAGE BUCKETS, & SEED DATA
-- Target DBMS: Supabase / PostgreSQL 15+
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUMS & CONSTANTS
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('super_admin', 'koordinator_sie', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE expense_status_enum AS ENUM ('DRAFT', 'DIAJUKAN', 'DITERIMA', 'DITOLAK', 'REVISI');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fund_request_status_enum AS ENUM ('DIAJUKAN', 'DISETUJUI', 'DITOLAK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_enum AS ENUM ('TRANSFER', 'TUNAI', 'KARTU_DEBIT', 'QRIS', 'LAINNYA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 2. TABEL: SIE (Divisi Panitia Wisuda)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sie (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(30) UNIQUE NOT NULL,
    description TEXT,
    coordinator_id UUID,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. TABEL: PROFILES (User Panitia, terikat dengan auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role_enum DEFAULT 'koordinator_sie' NOT NULL,
    sie_id UUID REFERENCES public.sie(id) ON DELETE SET NULL,
    phone VARCHAR(30),
    is_active BOOLEAN DEFAULT true NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Constraint: Koordinator Sie HARUS memiliki sie_id jika aktif
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS check_koordinator_must_have_sie;

ALTER TABLE public.profiles
ADD CONSTRAINT check_koordinator_must_have_sie
CHECK (role != 'koordinator_sie' OR sie_id IS NOT NULL);

-- ----------------------------------------------------------------------------
-- 4. TABEL: INCOME_TRANSACTIONS (Pemasukan Kas Pusat)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.income_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_no VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    source VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    receipt_url TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 5. TABEL: BUDGETS (Alokasi Plafon Anggaran per Sie)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sie_id UUID UNIQUE NOT NULL REFERENCES public.sie(id) ON DELETE CASCADE,
    fiscal_year INT DEFAULT 2026 NOT NULL,
    allocated_amount NUMERIC(15, 2) NOT NULL CHECK (allocated_amount >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 6. TABEL: FUND_DISBURSEMENTS (Pencairan Dana dari Bendahara ke Sie)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fund_disbursements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_no VARCHAR(50) UNIQUE NOT NULL,
    sie_id UUID NOT NULL REFERENCES public.sie(id) ON DELETE RESTRICT,
    date DATE NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    phase VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    proof_url TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 7. TABEL: EXPENSE_TRANSACTIONS (Pengeluaran per Sie)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expense_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_no VARCHAR(50) UNIQUE NOT NULL,
    sie_id UUID NOT NULL REFERENCES public.sie(id) ON DELETE RESTRICT,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    vendor VARCHAR(255),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    payment_method payment_method_enum DEFAULT 'TRANSFER' NOT NULL,
    description TEXT NOT NULL,
    status expense_status_enum DEFAULT 'DIAJUKAN' NOT NULL,
    rejection_reason TEXT,
    admin_notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 8. TABEL: EXPENSE_RECEIPTS (Metadata Bukti / Nota Transaksi)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expense_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES public.expense_transactions(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 9. TABEL: FUND_REQUESTS (Permintaan Dana Tambahan oleh Sie)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fund_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_no VARCHAR(50) UNIQUE NOT NULL,
    sie_id UUID NOT NULL REFERENCES public.sie(id) ON DELETE RESTRICT,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    reason TEXT NOT NULL,
    description TEXT,
    proof_url TEXT,
    status fund_request_status_enum DEFAULT 'DIAJUKAN' NOT NULL,
    admin_notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id)
);

-- ----------------------------------------------------------------------------
-- 10. TABEL: AUDIT_LOGS (Catatan Jejak Audit Aktivitas Finansial)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 11. TABEL: NOTIFICATIONS (Notifikasi Internal Panitia)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role user_role_enum,
    target_sie_id UUID REFERENCES public.sie(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info' NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    link_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 12. INDEXES UNTUK PERFORMA QUERY
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_expense_sie_id ON public.expense_transactions(sie_id);
CREATE INDEX IF NOT EXISTS idx_expense_status ON public.expense_transactions(status);
CREATE INDEX IF NOT EXISTS idx_expense_deleted_at ON public.expense_transactions(deleted_at);
CREATE INDEX IF NOT EXISTS idx_disbursement_sie_id ON public.fund_disbursements(sie_id);
CREATE INDEX IF NOT EXISTS idx_disbursement_deleted_at ON public.fund_disbursements(deleted_at);
CREATE INDEX IF NOT EXISTS idx_income_date ON public.income_transactions(date);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_target ON public.notifications(target_role, is_read);

-- ----------------------------------------------------------------------------
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.sie ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_disbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper functions to get current user role and sie_id
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role_enum AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.current_user_sie()
RETURNS UUID AS $$
  SELECT sie_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS: SIE
CREATE POLICY "Semua user terotentikasi dapat melihat sie"
ON public.sie FOR SELECT TO authenticated USING (true);

CREATE POLICY "Hanya Super Admin dapat memodifikasi sie"
ON public.sie FOR ALL TO authenticated
USING (public.current_user_role() = 'super_admin');

-- RLS: PROFILES
CREATE POLICY "User dapat membaca profil mereka sendiri atau Admin melihat semua"
ON public.profiles FOR SELECT TO authenticated
USING (public.current_user_role() IN ('super_admin', 'viewer') OR id = auth.uid());

CREATE POLICY "Admin dapat mengelola seluruh user"
ON public.profiles FOR ALL TO authenticated
USING (public.current_user_role() = 'super_admin');

-- RLS: INCOME_TRANSACTIONS
CREATE POLICY "Admin & Viewer dapat melihat pemasukan"
ON public.income_transactions FOR SELECT TO authenticated
USING (public.current_user_role() IN ('super_admin', 'viewer'));

CREATE POLICY "Hanya Super Admin dapat menambah/mengubah pemasukan"
ON public.income_transactions FOR ALL TO authenticated
USING (public.current_user_role() = 'super_admin');

-- RLS: BUDGETS
CREATE POLICY "Semua role dapat melihat alokasi anggaran"
ON public.budgets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Hanya Super Admin dapat mengatur anggaran"
ON public.budgets FOR ALL TO authenticated
USING (public.current_user_role() = 'super_admin');

-- RLS: FUND_DISBURSEMENTS
CREATE POLICY "Admin & Viewer melihat semua, Koordinator hanya sie-nya"
ON public.fund_disbursements FOR SELECT TO authenticated
USING (
  public.current_user_role() IN ('super_admin', 'viewer') OR
  sie_id = public.current_user_sie()
);

CREATE POLICY "Hanya Super Admin dapat mencairkan dana"
ON public.fund_disbursements FOR ALL TO authenticated
USING (public.current_user_role() = 'super_admin');

-- RLS: EXPENSE_TRANSACTIONS
CREATE POLICY "Admin & Viewer melihat semua, Koordinator hanya sie-nya"
ON public.expense_transactions FOR SELECT TO authenticated
USING (
  public.current_user_role() IN ('super_admin', 'viewer') OR
  sie_id = public.current_user_sie()
);

CREATE POLICY "Koordinator dapat mengajukan pengeluaran ke sie-nya"
ON public.expense_transactions FOR INSERT TO authenticated
WITH CHECK (
  public.current_user_role() = 'super_admin' OR
  (public.current_user_role() = 'koordinator_sie' AND sie_id = public.current_user_sie())
);

CREATE POLICY "Koordinator dapat update saat DRAFT/REVISI, Admin verifikasi"
ON public.expense_transactions FOR UPDATE TO authenticated
USING (
  public.current_user_role() = 'super_admin' OR
  (public.current_user_role() = 'koordinator_sie' AND sie_id = public.current_user_sie() AND status IN ('DRAFT', 'REVISI'))
);

-- RLS: EXPENSE_RECEIPTS
CREATE POLICY "Melihat nota sesuai relasi transaksi pengeluaran"
ON public.expense_receipts FOR SELECT TO authenticated
USING (
  public.current_user_role() IN ('super_admin', 'viewer') OR
  EXISTS (
    SELECT 1 FROM public.expense_transactions e
    WHERE e.id = expense_receipts.expense_id AND e.sie_id = public.current_user_sie()
  )
);

CREATE POLICY "Upload nota"
ON public.expense_receipts FOR INSERT TO authenticated
WITH CHECK (
  public.current_user_role() = 'super_admin' OR
  EXISTS (
    SELECT 1 FROM public.expense_transactions e
    WHERE e.id = expense_receipts.expense_id AND e.sie_id = public.current_user_sie()
  )
);

-- RLS: FUND_REQUESTS
CREATE POLICY "Melihat permohonan dana"
ON public.fund_requests FOR SELECT TO authenticated
USING (
  public.current_user_role() IN ('super_admin', 'viewer') OR
  sie_id = public.current_user_sie()
);

CREATE POLICY "Koordinator mengajukan dana tambahan"
ON public.fund_requests FOR INSERT TO authenticated
WITH CHECK (
  public.current_user_role() = 'koordinator_sie' AND sie_id = public.current_user_sie()
);

CREATE POLICY "Admin dapat meninjau dana tambahan"
ON public.fund_requests FOR UPDATE TO authenticated
USING (public.current_user_role() = 'super_admin');

-- RLS: AUDIT_LOGS
CREATE POLICY "Admin & Viewer dapat membaca audit log"
ON public.audit_logs FOR SELECT TO authenticated
USING (public.current_user_role() IN ('super_admin', 'viewer'));

CREATE POLICY "Sistem & Admin dapat mencatat audit log"
ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 14. SUPABASE STORAGE BUCKET: 'bukti-transaksi'
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bukti-transaksi',
  'bukti-transaksi',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760;

-- ----------------------------------------------------------------------------
-- 15. SEED DATA INISIAL (WISUDA STIBHA 2026)
-- ----------------------------------------------------------------------------
-- Sie Data
INSERT INTO public.sie (id, name, code, description, is_active) VALUES
('11111111-1111-1111-1111-111111111101', 'Sie Perlengkapan', 'SIE-PERLENGKAPAN', 'Logistik panggung, sound system, tenda, kursi, dan peralatan wisuda', true),
('11111111-1111-1111-1111-111111111102', 'Sie Konsumsi', 'SIE-KONSUMSI', 'Konsumsi tamu VVIP, wisudawan, orang tua, panitia, snack box & makan siang', true),
('11111111-1111-1111-1111-111111111103', 'Sie Acara', 'SIE-ACARA', 'Protokoler wisuda, MC, paduan suara, plakat, selempang, toga, sertifikat', true),
('11111111-1111-1111-1111-111111111104', 'Sie Dokumentasi', 'SIE-DOKUMENTASI', 'Fotografi, videografi, live streaming YouTube, photobooth wisuda', true),
('11111111-1111-1111-1111-111111111105', 'Sie Humas & Publikasi', 'SIE-HUMAS', 'Undangan pimpinan, banner baliho, publikasi media sosial, buku kenangan', true),
('11111111-1111-1111-1111-111111111106', 'Sie Keamanan & Parkir', 'SIE-KEAMANAN', 'Pengamanan gedung, pengaturan lalulintas, koordinasi kepolisian & dishub', true),
('11111111-1111-1111-1111-111111111107', 'Sie Dekorasi', 'SIE-DEKORASI', 'Dekorasi bunga segar panggung kehormatan, backdrop, karpet merah, gate masuk', true)
ON CONFLICT (code) DO NOTHING;

-- Budgets Initial Allocation
INSERT INTO public.budgets (sie_id, fiscal_year, allocated_amount, notes) VALUES
('11111111-1111-1111-1111-111111111101', 2026, 12000000, 'Sewa lighting panggung, kursi lipat 800 pcs, genset backup 60kVA'),
('11111111-1111-1111-1111-111111111102', 2026, 18500000, 'Snack box 1.000 pax, prasmanan senat 50 pax, nasi box panitia 120 pax'),
('11111111-1111-1111-1111-111111111103', 2026, 8500000, 'Honor MC profesional, pelatih paduan suara, map ijazah & Gordon STIBHA'),
('11111111-1111-1111-1111-111111111104', 2026, 6000000, 'Sewa multicam streaming switcher, operator drone, album cetak wisuda'),
('11111111-1111-1111-1111-111111111105', 2026, 4500000, 'Cetak buku wisuda hard cover 300 eks, spanduk ucapan, akrilik plakat'),
('11111111-1111-1111-1111-111111111106', 2026, 2500000, 'Konsumsi dan rompi petugas parkir, koordinasi Babinsa & Polsek'),
('11111111-1111-1111-1111-111111111107', 2026, 7500000, 'Bunga segar rostrum senat, karpet merah 100m, photo booth 360 spin')
ON CONFLICT (sie_id) DO NOTHING;
