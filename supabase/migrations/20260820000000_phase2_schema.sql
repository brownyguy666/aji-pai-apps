-- =================================================================
-- PHASE 2 MIGRATION SCRIPT - AJI PAI APPS
-- Features: Tags, Comments, Subscribers, Riwayat, Testimoni, FAQ,
-- Postgres Full-Text Search (TSVector), & RLS Policies.
-- =================================================================

-- 1. TAGS & MATERI_TAG
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.materi_tag (
    materi_id UUID REFERENCES public.materi_pai(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (materi_id, tag_id)
);

-- 2. KOMENTAR ARTIKEL (Status: pending | approved | rejected)
CREATE TABLE IF NOT EXISTS public.komentar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    materi_id UUID REFERENCES public.materi_pai(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    email TEXT NOT NULL,
    konten TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.subscriber (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RIWAYAT & ORGANISASI (Pendidikan, Organisasi, Pengalaman, Sertifikasi)
CREATE TABLE IF NOT EXISTS public.riwayat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    instansi_organisasi TEXT NOT NULL,
    jenis TEXT NOT NULL DEFAULT 'pendidikan', -- 'pendidikan', 'organisasi', 'pengalaman', 'sertifikasi'
    tahun_mulai INT NOT NULL,
    tahun_selesai INT,
    deskripsi TEXT,
    link_verifikasi TEXT,
    badge_url TEXT,
    certificate_url TEXT,
    accredible_id TEXT,
    urutan INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TESTIMONI (Status: pending | approved | rejected)
CREATE TABLE IF NOT EXISTS public.testimoni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    peran_instansi TEXT NOT NULL,
    konten TEXT NOT NULL,
    foto_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    rating INT NOT NULL DEFAULT 5,
    urutan INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FAQ (Tanya Jawab Seputar Pembelajaran & Modul)
CREATE TABLE IF NOT EXISTS public.faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pertanyaan TEXT NOT NULL,
    jawaban TEXT NOT NULL,
    kategori TEXT DEFAULT 'Umum',
    urutan INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materi_tag ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komentar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriber ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riwayat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimoni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;

-- Tags policies
DROP POLICY IF EXISTS "Public can read tags" ON public.tags;
DROP POLICY IF EXISTS "Admin can manage tags" ON public.tags;
CREATE POLICY "Public can read tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admin can manage tags" ON public.tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Materi Tag policies
DROP POLICY IF EXISTS "Public can read materi_tag" ON public.materi_tag;
DROP POLICY IF EXISTS "Admin can manage materi_tag" ON public.materi_tag;
CREATE POLICY "Public can read materi_tag" ON public.materi_tag FOR SELECT USING (true);
CREATE POLICY "Admin can manage materi_tag" ON public.materi_tag FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Komentar policies: Publik boleh insert komentar baru (status default pending) & baca yg approved
DROP POLICY IF EXISTS "Public can read approved comments" ON public.komentar;
DROP POLICY IF EXISTS "Public can insert comments" ON public.komentar;
DROP POLICY IF EXISTS "Admin can manage comments" ON public.komentar;
CREATE POLICY "Public can read approved comments" ON public.komentar FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can insert comments" ON public.komentar FOR INSERT WITH CHECK (status = 'pending');
CREATE POLICY "Admin can manage comments" ON public.komentar FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Subscriber policies: Publik boleh insert email newsletter, hanya Admin yg boleh select/kelola
DROP POLICY IF EXISTS "Public can subscribe" ON public.subscriber;
DROP POLICY IF EXISTS "Admin can view and manage subscribers" ON public.subscriber;
CREATE POLICY "Public can subscribe" ON public.subscriber FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view and manage subscribers" ON public.subscriber FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Riwayat policies
DROP POLICY IF EXISTS "Public can read riwayat" ON public.riwayat;
DROP POLICY IF EXISTS "Admin can manage riwayat" ON public.riwayat;
CREATE POLICY "Public can read riwayat" ON public.riwayat FOR SELECT USING (true);
CREATE POLICY "Admin can manage riwayat" ON public.riwayat FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Testimoni policies: Publik boleh submit testimoni baru & baca yg approved
DROP POLICY IF EXISTS "Public can read approved testimoni" ON public.testimoni;
DROP POLICY IF EXISTS "Public can submit testimoni" ON public.testimoni;
DROP POLICY IF EXISTS "Admin can manage testimoni" ON public.testimoni;
CREATE POLICY "Public can read approved testimoni" ON public.testimoni FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can submit testimoni" ON public.testimoni FOR INSERT WITH CHECK (status = 'pending');
CREATE POLICY "Admin can manage testimoni" ON public.testimoni FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- FAQ policies
DROP POLICY IF EXISTS "Public can read active faqs" ON public.faq;
DROP POLICY IF EXISTS "Admin can manage faqs" ON public.faq;
CREATE POLICY "Public can read active faqs" ON public.faq FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage faqs" ON public.faq FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. DAFTARKAN SECTION MODULAR BARU KE TABEL SECTIONS
INSERT INTO public.sections (key, label, urutan, is_active) VALUES
    ('statistik', 'Statistik & Angka Pembelajaran', 3, true),
    ('riwayat', 'Riwayat Pendidikan & Organisasi', 5, true),
    ('testimoni', 'Testimoni Siswa & Rekan Guru', 8, true),
    ('faq', 'Tanya Jawab & Bantuan (FAQ)', 9, true)
ON CONFLICT (key) DO UPDATE SET is_active = true;

-- 9. FULL TEXT SEARCH INDEX (PostgreSQL tsvector & GIN Index)
CREATE INDEX IF NOT EXISTS idx_materi_fts ON public.materi_pai USING gin(to_tsvector('indonesian', coalesce(judul, '') || ' ' || coalesce(deskripsi_singkat, '') || ' ' || coalesce(konten, '')));
CREATE INDEX IF NOT EXISTS idx_terjemahan_fts ON public.proyek_terjemahan USING gin(to_tsvector('indonesian', coalesce(judul, '') || ' ' || coalesce(deskripsi, '')));
CREATE INDEX IF NOT EXISTS idx_karya_fts ON public.karya USING gin(to_tsvector('indonesian', coalesce(judul, '') || ' ' || coalesce(deskripsi, '')));
