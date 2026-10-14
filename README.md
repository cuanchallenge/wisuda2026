# WISUDA STIBHA 2026 - SISTEM MANAJEMEN KEUANGAN ACARA

Sistem Manajemen Keuangan Acara Wisuda modern, aman, responsif (mobile-first), dan realtime. Dirancang untuk bendahara dan panitia pelaksana wisuda STIBHA dengan arsitektur production-ready untuk deployment di **Vercel**, **GitHub**, dan **Supabase**.

---

## 🌟 FITUR UTAMA

1. **Multi-Role & Hak Akses Ketat (RBAC)**
   - **Super Admin / Bendahara:** Akses penuh seluruh pemasukan, pengeluaran, saldo pusat, pencairan ke seksi, verifikasi kwitansi, manajemen seksi & user, audit log, dan ekspor laporan.
   - **Koordinator Sie:** Terisolasi hanya pada Seksi miliknya. Dapat melihat dana diterima, saldo sisa, input nota langsung dari kamera ponsel / galeri, dan mengajukan dana tambahan.
   - **Viewer / Ketua Panitia:** Akses monitoring eksekutif, matriks penyerapan anggaran seksi, transparansi kas, dan cetak laporan.

2. **Kalkulasi Saldo Terpadu Otomatis (Anti Kesalahan Manual)**
   - **Saldo Kas Pusat:** `Total Pemasukan Kas - Total Dana yang Dicairkan ke Seksi`
   - **Saldo Kas Seksi:** `Dana Diterima - Pengeluaran yang Telah Disetujui (DITERIMA)`
   - Format mata uang konsisten: `Rp50.000.000` (Rupiah Indonesia standar).
   - Penomoran otomatis: `IN-YYYYMMDD-XXXX`, `OUT-YYYYMMDD-XXXX`, `EXP-YYYYMMDD-XXXX`, `REQ-YYYYMMDD-XXXX`.

3. **Workflow Verifikasi Pengeluaran & Audit Trail**
   - Status: `DRAFT` ➔ `DIAJUKAN` ➔ `DITERIMA` / `DITOLAK` / `REVISI`.
   - Bendahara dapat menolak (dengan alasan wajib) atau meminta revisi (koordinator dapat mengunggah nota baru).
   - Seluruh tindakan dicatat di tabel **Audit Logs** secara permanen.

4. **Mobile-First & Upload Bukti Nota**
   - Mendukung pengambilan gambar langsung dari kamera smartphone (`capture="environment"`) atau memilih file gambar/PDF dari galeri.
   - Struktur penyimpanan bucket privat:
     ```
     bukti-transaksi/2026/10/sie-konsumsi/EXP-20261008-0001/nota.jpg
     ```

5. **Laporan & Ekspor**
   - Ekspor data transaksi ke **Excel / CSV**.
   - Mode cetak **PDF Resmi** lengkap dengan Kop Surat Panitia Wisuda STIBHA 2026 dan kolom tanda tangan Ketua Panitia & Bendahara Utama.

---

## 🛠️ TECH STACK

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Bundler / Dev Environment:** Vite 6 / 8
- **Backend & Database:** Supabase PostgreSQL 15+, Supabase Auth, Supabase Storage
- **Security:** PostgreSQL Row Level Security (RLS) & UUID Primary Keys
- **Deployment Target:** Vercel
- **Version Control:** GitHub

---

## 🚀 PANDUAN MENJALANKAN SECARA LOKAL

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/username/wisuda-stibha-finance.git
cd wisuda-stibha-finance
npm install
```

### 2. Jalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🗄️ KONFIGURASI SUPABASE DATABASE (5 MENIT)

Aplikasi dapat langsung digunakan dalam mode Interactive High-Performance Sandbox, atau dihubungkan ke instance Supabase live Anda:

1. **Buat Proyek Baru di Supabase:**
   - Kunjungi [https://supabase.com](https://supabase.com) dan buat project baru gratis.
2. **Jalankan Schema Migration:**
   - Buka menu **SQL Editor** di dashboard Supabase.
   - Buka file `src/database/schema.sql` pada repository ini, salin seluruh kodenya, lalu klik **Run**.
   - Skrip ini otomatis membuat:
     - Tabel: `sie`, `profiles`, `income_transactions`, `budgets`, `fund_disbursements`, `expense_transactions`, `expense_receipts`, `fund_requests`, `audit_logs`, `notifications`.
     - Kebijakan Row Level Security (RLS) lengkap.
     - Storage Bucket `bukti-transaksi`.
     - Seed data awal panitia wisuda STIBHA 2026.
3. **Atur Environment Variables:**
   - Salin file `.env.example` menjadi `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Masukkan kunci dari **Project Settings > API**:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

---

## ☁️ DEPLOYMENT KE VERCEL

1. Push kode repository ini ke GitHub:
   ```bash
   git add .
   git commit -m "feat: initial release wisuda finance stibha 2026"
   git push origin main
   ```
2. Buka [https://vercel.com](https://vercel.com), pilih **Add New Project**, lalu impor repository GitHub Anda.
3. Di bagian **Environment Variables** Vercel, tambahkan:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Klik **Deploy**. Aplikasi akan online dalam waktu kurang dari 1 menit!

---

## 👥 AKUN SIMULASI BAWAAN (DEMO PERSONAS)

| Nama Pengguna | Email | Peran (Role) | Seksi (Sie) |
|---|---|---|---|
| **Ahmad Fauzi, S.E.** | bendahara@wisuda-stibha.ac.id | `super_admin` | Bendahara Utama (Pusat) |
| **Sinta Nurhaliza** | sinta@wisuda-stibha.ac.id | `koordinator_sie` | Sie Konsumsi |
| **Budi Santoso** | budi@wisuda-stibha.ac.id | `koordinator_sie` | Sie Perlengkapan |
| **Rian Pratama** | rian@wisuda-stibha.ac.id | `koordinator_sie` | Sie Acara |
| **Dr. H. M. Zaki, M.Pd.**| ketua@wisuda-stibha.ac.id | `viewer` | Ketua Panitia (Pengawas) |

*Password demo untuk seluruh akun di atas:* `Wisuda2026!` (tersedia juga tombol 1-klik Quick Persona di pojok atas & halaman login).

---

## 🔒 KEBIJAKAN KEAMANAN & DATA INTEGRITY

- **Strict RLS:** Koordinator Sie dibatasi pada level database PostgreSQL sehingga tidak dapat membaca atau memodifikasi pengeluaran seksi lain.
- **Plafon Kas:** Pengeluaran seksi divalidasi tidak boleh melebihi sisa dana riil yang telah dicairkan oleh bendahara.
- **Soft Delete:** Transaksi keuangan tidak langsung dihapus permanen melainkan ditandai `deleted_at` dengan rekam jejak audit trail yang utuh.
- **Service Role Key:** Kunci rahasia service role tidak pernah diexpose di sisi frontend.

---
© 2026 Panitia Wisuda STIBHA. Dilindungi Hak Cipta.
