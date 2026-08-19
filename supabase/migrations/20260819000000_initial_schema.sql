-- ==============================================================================
-- SCHEMA MIGRATION: Website Portofolio & Edukasi PAI
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABEL: profile
CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    tagline TEXT NOT NULL,
    bio TEXT NOT NULL,
    foto_url TEXT,
    email TEXT,
    youtube_channel_id TEXT,
    socials JSONB DEFAULT '{"youtube": "", "instagram": "", "facebook": "", "whatsapp": "", "github": "", "telegram": ""}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL: sections (Kontrol Urutan & Visibilitas Modular Landing Page)
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    urutan INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL: kategori_materi (Kategori Bertingkat: Kelas > Topik > Sub-topik)
CREATE TABLE IF NOT EXISTS public.kategori_materi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    parent_id UUID REFERENCES public.kategori_materi(id) ON DELETE CASCADE,
    urutan INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL: materi_pai (Artikel / Blog Pembelajaran PAI)
CREATE TABLE IF NOT EXISTS public.materi_pai (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    deskripsi_singkat TEXT,
    konten TEXT NOT NULL,
    gambar_cover_url TEXT,
    kategori_id UUID REFERENCES public.kategori_materi(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL: materi_file (File Lampiran: PDF / PPT / Word / Excel)
CREATE TABLE IF NOT EXISTS public.materi_file (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    materi_id UUID NOT NULL REFERENCES public.materi_pai(id) ON DELETE CASCADE,
    nama_file TEXT NOT NULL,
    file_url TEXT NOT NULL,
    tipe TEXT NOT NULL DEFAULT 'pdf',
    ukuran_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL: proyek_terjemahan
CREATE TABLE IF NOT EXISTS public.proyek_terjemahan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    bahasa_asal TEXT NOT NULL DEFAULT 'Bahasa Arab',
    bahasa_tujuan TEXT NOT NULL DEFAULT 'Bahasa Indonesia',
    deskripsi TEXT,
    link_file TEXT,
    tahun INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    urutan INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL: karya (Galeri Portofolio & Publikasi)
CREATE TABLE IF NOT EXISTS public.karya (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    deskripsi TEXT,
    gambar_url TEXT NOT NULL,
    link_eksternal TEXT,
    kategori TEXT DEFAULT 'Infografis',
    urutan INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL: youtube_videos (Video Pilihan / Channel Embed)
CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    video_id TEXT NOT NULL,
    thumbnail_url TEXT,
    published_at TEXT,
    urutan INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategori_materi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materi_pai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materi_file ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyek_terjemahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karya ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent duplicate policy errors
DROP POLICY IF EXISTS "Publik dapat membaca profile" ON public.profile;
DROP POLICY IF EXISTS "Admin dapat mengelola profile" ON public.profile;
DROP POLICY IF EXISTS "Publik dapat membaca sections" ON public.sections;
DROP POLICY IF EXISTS "Admin dapat mengelola sections" ON public.sections;
DROP POLICY IF EXISTS "Publik dapat membaca kategori_materi" ON public.kategori_materi;
DROP POLICY IF EXISTS "Admin dapat mengelola kategori_materi" ON public.kategori_materi;
DROP POLICY IF EXISTS "Publik dapat membaca materi published" ON public.materi_pai;
DROP POLICY IF EXISTS "Admin dapat mengelola semua materi_pai" ON public.materi_pai;
DROP POLICY IF EXISTS "Publik dapat membaca materi_file" ON public.materi_file;
DROP POLICY IF EXISTS "Admin dapat mengelola materi_file" ON public.materi_file;
DROP POLICY IF EXISTS "Publik dapat membaca proyek_terjemahan" ON public.proyek_terjemahan;
DROP POLICY IF EXISTS "Admin dapat mengelola proyek_terjemahan" ON public.proyek_terjemahan;
DROP POLICY IF EXISTS "Publik dapat membaca karya" ON public.karya;
DROP POLICY IF EXISTS "Admin dapat mengelola karya" ON public.karya;
DROP POLICY IF EXISTS "Publik dapat membaca youtube_videos" ON public.youtube_videos;
DROP POLICY IF EXISTS "Admin dapat mengelola youtube_videos" ON public.youtube_videos;

CREATE POLICY "Publik dapat membaca profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Admin dapat mengelola profile" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Publik dapat membaca sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Admin dapat mengelola sections" ON public.sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Publik dapat membaca kategori_materi" ON public.kategori_materi FOR SELECT USING (true);
CREATE POLICY "Admin dapat mengelola kategori_materi" ON public.kategori_materi FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Publik dapat membaca materi published" ON public.materi_pai FOR SELECT USING (status = 'published');
CREATE POLICY "Admin dapat mengelola semua materi_pai" ON public.materi_pai FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Publik dapat membaca materi_file" ON public.materi_file FOR SELECT USING (true);
CREATE POLICY "Admin dapat mengelola materi_file" ON public.materi_file FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Publik dapat membaca proyek_terjemahan" ON public.proyek_terjemahan FOR SELECT USING (true);
CREATE POLICY "Admin dapat mengelola proyek_terjemahan" ON public.proyek_terjemahan FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Publik dapat membaca karya" ON public.karya FOR SELECT USING (true);
CREATE POLICY "Admin dapat mengelola karya" ON public.karya FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Publik dapat membaca youtube_videos" ON public.youtube_videos FOR SELECT USING (true);
CREATE POLICY "Admin dapat mengelola youtube_videos" ON public.youtube_videos FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('images', 'images', true),
    ('materi-files', 'materi-files', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Publik dapat melihat images" ON storage.objects;
DROP POLICY IF EXISTS "Admin dapat mengelola images" ON storage.objects;
DROP POLICY IF EXISTS "Publik dapat mengunduh materi-files" ON storage.objects;
DROP POLICY IF EXISTS "Admin dapat mengelola materi-files" ON storage.objects;

CREATE POLICY "Publik dapat melihat images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Admin dapat mengelola images" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

CREATE POLICY "Publik dapat mengunduh materi-files" ON storage.objects FOR SELECT USING (bucket_id = 'materi-files');
CREATE POLICY "Admin dapat mengelola materi-files" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'materi-files') WITH CHECK (bucket_id = 'materi-files');

-- ==============================================================================
-- SEED DATA AWAL (Valid Hexadecimal UUIDs: 0-9, a-f)
-- ==============================================================================
INSERT INTO public.profile (id, nama, tagline, bio, foto_url, email, youtube_channel_id, socials)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Aji Bagus Khoiri',
    'Pendidik Agama Islam, Penerjemah Kitab Turats & Kreator Konten Edukasi',
    'Mengabdi dalam dunia pendidikan Islam dengan memadukan khazanah keilmuan klasik (turats) dan pendekatan pedagogis modern abad 21.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'ajibaguskhoiri@gmail.com',
    'UC_example_youtube_id',
    '{"youtube": "https://youtube.com/@edukasipai", "instagram": "https://instagram.com", "facebook": "https://facebook.com", "whatsapp": "https://wa.me/6281234567890", "telegram": "https://t.me"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.sections (key, label, urutan, is_active) VALUES
    ('hero', 'Profil & Pengantar Utama', 1, true),
    ('materi', 'Materi & Modul PAI Terbaru', 2, true),
    ('youtube', 'Channel & Video YouTube Edukasi', 3, true),
    ('terjemahan', 'Proyek Terjemahan Kitab & Buku', 4, true),
    ('karya', 'Galeri Karya & Publikasi Digital', 5, true),
    ('kontak', 'Kontak & Kolaborasi', 6, true)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.kategori_materi (id, nama, parent_id, urutan) VALUES
    ('c1000000-0000-0000-0000-000000000001', 'Kelas X (Fase E)', NULL, 1),
    ('c1000000-0000-0000-0000-000000000002', 'Kelas XI (Fase F)', NULL, 2),
    ('c1000000-0000-0000-0000-000000000003', 'Kelas XII (Fase F+)', NULL, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.kategori_materi (id, nama, parent_id, urutan) VALUES
    ('c2000000-0000-0000-0000-000000000001', 'Al-Qur''an & Hadits', 'c1000000-0000-0000-0000-000000000001', 1),
    ('c2000000-0000-0000-0000-000000000002', 'Aqidah & Akhlak', 'c1000000-0000-0000-0000-000000000001', 2),
    ('c2000000-0000-0000-0000-000000000003', 'Fiqih Ibadah & Muamalah', 'c1000000-0000-0000-0000-000000000001', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.materi_pai (id, judul, slug, deskripsi_singkat, konten, gambar_cover_url, kategori_id, status, view_count) VALUES
(
    'e0000000-0000-0000-0000-000000000001',
    'Memahami Konsep Fastabiqul Khairat: Kajian Mendalam Q.S. Al-Maidah Ayat 48',
    'memahami-konsep-fastabiqul-khairat-al-maidah-48',
    'Kajian tafsir tematik tentang anjuran berlomba-lomba dalam kebaikan dan etos kerja islami.',
    '# Memahami Konsep Fastabiqul Khairat (Q.S. Al-Ma''idah: 48)

> *"Maka berlomba-lombalah kamu dalam kebaikan."* (Q.S. Al-Ma''idah [5]: 48)

## 1. Makna Etimologis
Secara bahasa, **Fastabiqul Khairat** berakar dari kata *sabaqa* yang berarti mendahului atau berlomba, dan *al-khairat* yang merupakan kebaikan.

Silakan unduh modul ajar PDF pada lampiran di bawah.',
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    'c2000000-0000-0000-0000-000000000001',
    'published',
    428
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.materi_file (materi_id, nama_file, file_url, tipe, ukuran_bytes) VALUES
    ('e0000000-0000-0000-0000-000000000001', 'Modul_Ajar_PAI_Fastabiqul_Khairat_Kelas_X.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'pdf', 2450000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.proyek_terjemahan (judul, bahasa_asal, bahasa_tujuan, deskripsi, link_file, tahun, urutan) VALUES
(
    'Terjemahan & Syarah Matan Al-Ghayah wa At-Taqrib (Matan Abi Syuja'')',
    'Bahasa Arab',
    'Bahasa Indonesia',
    'Terjemahan lengkap disertai anotasi mazhab Syafi''i untuk bab Thaharah hingga Bab Jinayat.',
    'https://archive.org',
    2024,
    1
);

INSERT INTO public.karya (judul, deskripsi, gambar_url, link_eksternal, kategori, urutan) VALUES
(
    'Infografis Alur Pensyariatan Ibadah Shalat & Wudhu Sesuai Sunnah',
    'Desain infografis beresolusi tinggi yang merangkum rukun dan syarat sah ibadah.',
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    'https://behance.net',
    'Infografis',
    1
);

INSERT INTO public.youtube_videos (title, video_id, thumbnail_url, published_at, urutan, is_featured) VALUES
(
    'Kajian Tafsir Al-Maidah Ayat 48 - Semangat Kompetisi dalam Kebaikan',
    'dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=640&q=80',
    '2024-05-12',
    1,
    true
);
