# Portal Edukasi & Portofolio Guru PAI (Pendidikan Agama Islam)

Website pribadi, portofolio akademik, dan platform edukasi Pendidikan Agama Islam (PAI) modern yang dibangun menggunakan **React (Vite + TypeScript)**, **Tailwind CSS**, dan backend **Supabase** (PostgreSQL + Auth + Storage).

---

## 🌟 Fitur Utama

1. **Modular Landing Page Dinamis**:
   - Urutan dan visibilitas setiap section diatur langsung dari database.
   - Panel Admin dilengkapi kontrol **Drag-and-Drop (@dnd-kit)** dan switch aktif/nonaktif dengan sinkronisasi langsung.
2. **Pustaka Materi PAI Bertingkat**:
   - Kategori hierarki: **Fase/Kelas ➔ Bidang Keilmuan (Fiqih, Aqidah, SKI, Al-Quran) ➔ Sub-topik**.
   - Halaman artikel dengan tipografi islami estetik, ayat, hadits, dan kutipan.
   - **Multi-File Attachment**: Unduh modul ajar format **PDF, PPT/PPTX, Word (DOCX), Excel**.
3. **Proyek Terjemahan Kitab Turats**:
   - Dokumentasi alih bahasa naskah klasik Arab ke Indonesia beserta tahun rilis dan link naskah.
4. **Galeri Portofolio & Publikasi**:
   - Galeri infografis syariat beresolusi tinggi, e-book, modul ajar, dan media animasi dengan modal lightbox interaktif.
5. **Kurasi Video YouTube Edukatif**:
   - Grid video kajian dengan popup video player interaktif tanpa meninggalkan halaman.
6. **Panel Admin Lengkap (`/admin`)**:
   - Dilindungi **Supabase Auth**.
   - Pengaturan Drag-and-Drop urutan landing page.
   - CRUD penuh Materi PAI + Upload file lampiran ke Supabase Storage.
   - Manajemen hierarki kategori bertingkat.
   - CRUD Proyek Terjemahan, Galeri Karya, Video YouTube, dan Edit Profil Guru.
7. **Mode Demo Lokal Cerdas**:
   - Jika Supabase belum dikonfigurasi di `.env.local`, aplikasi otomatis beralih ke data seed & lokal demo sehingga semua fitur dan UI dapat langsung diuji.

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

Isi kredensial Supabase Anda pada file `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
> *Catatan: `.env.local` sudah otomatis masuk ke dalam `.gitignore` sehingga aman dari commit GitHub.*

---

## 🗄️ Setup Backend Supabase (Database & Storage)

### Langkah 1: Jalankan Migration SQL
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) ➔ Masuk ke project Anda.
2. Buka menu **SQL Editor** di sidebar kiri.
3. Buka file [`supabase/migrations/20260819000000_initial_schema.sql`](./supabase/migrations/20260819000000_initial_schema.sql).
4. Salin seluruh isi file SQL tersebut dan tempel ke SQL Editor Supabase, lalu klik **Run**.
5. Skema database (tabel `profile`, `sections`, `kategori_materi`, `materi_pai`, `materi_file`, `proyek_terjemahan`, `karya`, `youtube_videos`), RLS Policies, dan data awal (seed data) akan terbuat otomatis.

### Langkah 2: Buat Akun Admin
1. Di Supabase Dashboard, buka menu **Authentication** ➔ **Users**.
2. Klik **Add User** ➔ **Create User**.
3. Masukkan email dan password untuk akun admin Anda.
4. Gunakan akun tersebut untuk login di `/admin/login`.

---

## 💻 Menjalankan Server Development

```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

Untuk mengakses dashboard admin, kunjungi:
`http://localhost:5173/admin/login`

---

## 📦 Siap Deploy ke Vercel

Project ini sudah dilengkapi konfigurasi `vercel.json` untuk menangani Single Page Application (SPA) routing.

### Cara Deploy ke Vercel:
1. Push repository ke GitHub Anda:
   ```bash
   git add .
   git commit -m "feat: complete PAI educational & portfolio website"
   git push origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com) ➔ Klik **Add New Project** ➔ Pilih repository GitHub Anda.
3. Pada bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` = (URL Supabase Anda)
   - `VITE_SUPABASE_ANON_KEY` = (Anon key Supabase Anda)
4. Klik **Deploy**. Vercel akan otomatis melakukan auto-deploy setiap kali ada push baru ke branch `main`.

---

## 📁 Struktur Folder Project

```
aji-pai-apps/
├── .env.example
├── .gitignore
├── vercel.json
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── supabase/
│   └── migrations/
│       └── 20260819000000_initial_schema.sql
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── database.ts
    ├── lib/
    │   ├── supabase.ts
    │   ├── seedData.ts
    │   └── utils.ts
    ├── context/
    │   └── AuthContext.tsx
    ├── hooks/
    │   ├── useProfile.ts
    │   ├── useSections.ts
    │   ├── useMateri.ts
    │   ├── useCategories.ts
    │   ├── useTerjemahan.ts
    │   ├── useKarya.ts
    │   └── useYouTube.ts
    ├── components/
    │   ├── layout/ (Navbar, Footer, Layout)
    │   ├── ui/ (Button, Badge, Card, Modal, Input, Select, Switch, Toast)
    │   ├── sections/ (Hero, Materi, YouTube, Terjemahan, Karya, Kontak, DynamicRenderer)
    │   └── materi/ (CategoryTreeFilter, MateriCard, FileAttachmentList)
    ├── pages/ (Home, MateriList, MateriDetail, Terjemahan, Karya, NotFound)
    └── admin/
        ├── AdminLayout.tsx
        ├── AdminLoginPage.tsx
        ├── AdminDashboardPage.tsx
        ├── SectionManager.tsx       # Drag & Drop reordering @dnd-kit
        ├── ProfileEditor.tsx        # Profile & photo upload
        ├── MateriManager.tsx        # Article list & actions
        ├── MateriFormPage.tsx       # Rich editor + file attachment upload
        ├── KategoriManager.tsx      # Hierarchical category tree manager
        ├── TerjemahanManager.tsx    # Translation projects CRUD
        ├── KaryaManager.tsx         # Portfolio CRUD
        └── YouTubeManager.tsx       # YouTube video curation
```

---
*Barakallahu fiikum. Dibuat dengan cinta untuk kemajuan pendidikan Islam.*
