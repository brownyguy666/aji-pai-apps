# Portal Edukasi & Portofolio Guru PAI (Pendidikan Agama Islam)

Website pribadi, portofolio akademik, dan platform edukasi Pendidikan Agama Islam (PAI) modern untuk guru PAI Fase D (SMP Kelas 7, 8, 9) yang dibangun menggunakan **React 18 (Vite + TypeScript)**, **Tailwind CSS**, dan backend **Supabase** (PostgreSQL + Auth + Storage).

---

## 🌟 Fitur Utama (Phase 1 & Phase 2)

### 1. 🔍 Search Global & Filter Multi-Kategori
- **Global Search Bar**: Mencari lintas Materi PAI, Proyek Terjemahan, dan Galeri Karya dengan *300ms debounce*, pintasan keyboard (`Ctrl+K` / `⌘K`), dan Postgres Full-Text Search.
- **Filter Tag & Kategori**: Filter dinamis berdasarkan tag topik, elemen PAI (Al-Qur'an Hadis, Akidah, Akhlak, Fikih, SKI), tahun rilis naskah, dan kategori media.

### 2. ⚡ SEO Lanjutan & Generator Sitemap Otomatis
- **Dynamic Meta Tags (`react-helmet-async`)**: Judul dinamis, deskripsi meta, Open Graph image, dan Twitter Cards di setiap halaman dan artikel materi.
- **Structured Data JSON-LD**: Skema schema.org `Article` untuk rich snippets di hasil pencarian Google.
- **Prebuild Sitemap & Robots.txt**: Script generator otomatis (`scripts/generate-sitemap.js`) yang menghasilkan `public/sitemap.xml` dan `public/robots.txt` setiap build.

### 3. 💬 Sistem Komentar & Newsletter Langganan
- **Moderasi Komentar**: Form komentar artikel publik dengan status otomatis *Pending*, dilindungi *Honeypot Anti-Spam*, dan panel moderasi admin (`/admin/komentar`) untuk Approve/Reject.
- **Langganan Newsletter**: Formulir pendaftaran email di footer dan artikel dengan validasi, honeypot spam protection, dan fitur **Ekspor CSV / Excel** di dashboard admin (`/admin/subscriber`).

### 4. ♿ Aksesibilitas Terstandar (WCAG 2.1 AA)
- **Skip to Content Link**: Navigasi keyboard langsung melompat ke konten utama (`#main-content`).
- **Focus Rings Nyata & ARIA**: Semua elemen interaktif memiliki `focus:ring-2`, `aria-label`, `aria-expanded` (FAQ accordion), dan `aria-live="polite"` (status form komentar).
- **Aksesibilitas Drag & Drop**: Pengurutan landing page mendukung keyboard sensor serta tombol alternatif Naik/Turun (Up/Down).
- **Atribut Bahasa HTML**: `lang="id"` terpasang baku di dokumen root.

### 5. 📚 Konten Modular & Kredensial Resmi
- **Urutan Landing Page Dinamis**: Urutan section diatur melalui drag & drop dan disimpan di database.
- **Live Counter Statistik**: Angka live modul diterbitkan, video kajian, karya portofolio, dan jam pelatihan guru.
- **Rekam Jejak 4 Kategori**: Tab linimasa Pendidikan, Pengalaman Mengajar, Organisasi Guru, dan Kredensial Resmi (Google Certified Educator Level 1, Level 2, Certified Trainer dengan verifikasi Accredible).
- **Penyimpanan Cloud Multi-Platform**: Embed langsung Google Drive, OneDrive, Canva, dan Google Slides di dalam modul ajar.
- **Testimoni & Tanya Jawab (FAQ)**: Ulasan siswa & rekan guru serta accordion FAQ terstruktur.

### 6. 🛡️ Panel Admin Lengkap (`/admin`)
- Dilindungi **Supabase Authentication**.
- **Moderasi Komentar**: Filter status (Pending, Disetujui, Ditolak) dan hapus komentar.
- **Manajemen Testimoni & FAQ**: Tambah, edit, dan atur visibilitas pertanyaan.
- **Manajemen Riwayat & Kredensial**: Kelola jejak pendidikan formal, PPG, organisasi, dan badge kredensial.
- **Pelanggan Newsletter**: Manajemen email subscriber dan ekspor data ke file `.csv`.
- **Manajemen Materi & File**: Editor Markdown dengan live preview, cover uploader, dan pengait multi-tag.

### 7. ⏱️ Cron Keep-Alive Supabase (Gratis)
- File alur kerja GitHub Actions (`.github/workflows/keep-alive.yml`) yang berjalan otomatis setiap 3 hari (`0 0 */3 * *`) untuk mengirim ping curl ke endpoint Supabase, menjaga project Free Tier tetap aktif dan bebas dari auto-pause.

---

## 🚀 Panduan Setup & Menjalankan Lokal

### 1. Clone & Instal Dependensi
```bash
cd aji-pai-apps
npm install
```

### 2. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi kredensial Supabase Anda pada `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🗄️ Database & Storage Migration (Supabase)

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) ➔ Masuk ke project Anda.
2. Buka menu **SQL Editor** di sidebar kiri.
3. Buka file [`supabase/migrations/20260820000000_phase2_schema.sql`](./supabase/migrations/20260820000000_phase2_schema.sql).
4. Jalankan script SQL tersebut. Skema tabel (`riwayat`, `testimoni`, `faq`, `tags`, `materi_tags`, `komentar_materi`, `subscribers_newsletter`), RLS policies, dan indeks full-text search akan terpasang otomatis.

---

## 💻 Menjalankan Server Development & Build

```bash
# Menjalankan dev server Vite
npm run dev

# Membangun bundle produksi (otomatis generate sitemap.xml & robots.txt)
npm run build

# Menjalankan script sitemap generator secara manual
npm run sitemap
```

---

## 📁 Struktur Folder Project

```
aji-pai-apps/
├── .github/
│   └── workflows/
│       └── keep-alive.yml         # GitHub Actions cron keep-alive ping
├── scripts/
│   └── generate-sitemap.js        # Script prebuild sitemap & robots.txt
├── supabase/
│   └── migrations/
│       ├── 20260819000000_initial_schema.sql
│       └── 20260820000000_phase2_schema.sql
├── src/
│   ├── components/
│   │   ├── layout/                # Navbar, Footer, Layout, Skip-link
│   │   ├── search/                # GlobalSearchModal (Ctrl+K)
│   │   ├── seo/                   # SEOHead (react-helmet-async & JSON-LD)
│   │   ├── sections/              # Hero, Statistik, Riwayat, Testimoni, FAQ, dll.
│   │   ├── materi/                # MateriComments, CategoryTreeFilter, MateriCard
│   │   └── ui/                    # Button, Badge, Card, Modal, Input, Switch, Toast
│   ├── hooks/                     # useGlobalSearch, useKomentar, useSubscriber, useRiwayat, useTestimoni, useFAQ, useTags, useStatistik
│   ├── pages/                     # HomePage, MateriListPage, MateriDetailPage, TerjemahanPage, KaryaPage
│   └── admin/
│       ├── AdminLayout.tsx        # Sidebar dengan badge pending live
│       ├── AdminDashboardPage.tsx # Matriks metrik dan pintasan cepat
│       ├── KomentarManager.tsx    # Moderasi komentar artikel
│       ├── TestimoniManager.tsx   # Moderasi & CRUD testimoni
│       ├── FaqManager.tsx         # CRUD tanya jawab & toggle aktif
│       ├── SubscriberManager.tsx  # Daftar newsletter & ekspor CSV
│       ├── RiwayatManager.tsx     # 4 Kategori riwayat & sertifikasi Google
│       ├── SectionManager.tsx     # Drag & Drop landing page sections
│       ├── MateriManager.tsx      # Manajemen artikel & badge komentar
│       └── MateriFormPage.tsx     # Editor markdown, cloud embed, dan tag selector
```

---
*Barakallahu fiikum. Dibuat dengan dedikasi tinggi untuk kemajuan syiar pendidikan Islam digital.*
