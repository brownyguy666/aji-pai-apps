-- =================================================================
-- PHASE 2.5 MIGRATION SCRIPT - E-BOOK & PUSTAKA DIGITAL
-- Multi-format reader support: EPUB, MOBI, AZW3, PDF & OneDrive
-- =================================================================

CREATE TABLE IF NOT EXISTS public.ebooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul TEXT NOT NULL,
    penulis_pengarang TEXT NOT NULL,
    penerbit_pentahqiq TEXT,
    kategori TEXT NOT NULL DEFAULT 'Fikih & Ushul Fikih',
    deskripsi TEXT,
    cover_url TEXT,
    format_file TEXT NOT NULL DEFAULT 'pdf', -- 'pdf', 'epub', 'mobi', 'azw3', 'onedrive', 'gdrive'
    file_url TEXT,
    onedrive_embed_url TEXT,
    tahun_terbit TEXT,
    jumlah_halaman INT,
    bahasa TEXT NOT NULL DEFAULT 'Indonesia', -- 'Indonesia', 'Arab', 'Pegon', 'Bilingual'
    is_downloadable BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT TRUE,
    urutan INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read ebooks" ON public.ebooks;
DROP POLICY IF EXISTS "Admin can manage ebooks" ON public.ebooks;

CREATE POLICY "Public can read ebooks" ON public.ebooks FOR SELECT USING (true);
CREATE POLICY "Admin can manage ebooks" ON public.ebooks FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- REGISTER SECTION
INSERT INTO public.sections (key, label, urutan, is_active) VALUES
    ('ebook', 'Pustaka E-Book & Kitab Digital', 7, true)
ON CONFLICT (key) DO UPDATE SET is_active = true;

-- FTS INDEX
CREATE INDEX IF NOT EXISTS idx_ebooks_fts ON public.ebooks USING gin(to_tsvector('indonesian', coalesce(judul, '') || ' ' || coalesce(penulis_pengarang, '') || ' ' || coalesce(deskripsi, '') || ' ' || coalesce(kategori, '')));

-- INITIAL SEED DATA
INSERT INTO public.ebooks (judul, penulis_pengarang, penerbit_pentahqiq, kategori, deskripsi, cover_url, format_file, file_url, onedrive_embed_url, tahun_terbit, jumlah_halaman, bahasa, is_featured, urutan) VALUES
  (
    'Matan Al-Ghayah wa At-Taqrib (Matan Abu Syuja'')',
    'Al-Qadhi Abu Syuja'' Ahmad bin Al-Hasan Al-Ishfahani',
    'Tahqiq & Terjemah: Aji Bagus Khoiri, S.Pd., Gr.',
    'Fikih Syafi''i',
    'Naskah rujukan induk fikih mazhab Syafi''i tingkat dasar yang memuat bab Thaharah, Shalat, Zakat, Puasa, hingga Muamalah dengan bahasa yang padat, ringkas, dan sistematis.',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    'epub',
    'https://raw.githubusercontent.com/IDPF/epub3-samples/master/30/moby-dick/moby-dick.epub',
    'https://onedrive.live.com/embed?resid=sample_matan_abu_syuja',
    '2024',
    124,
    'Bilingual',
    true,
    1
  ),
  (
    'Modul Ajar PAI & Budi Pekerti Fase D (Kelas 7, 8, 9)',
    'Aji Bagus Khoiri, S.Pd., Gr.',
    'Komunitas Guru Berbagi & MGMP PAI SMP',
    'Modul Kurikulum Merdeka',
    'Kumpulan modul ajar lengkap berbasis Kurikulum Merdeka Fase D mencakup 5 elemen (Al-Qur''an Hadis, Akidah, Akhlak, Fikih, SKI) dilengkapi LKPD interaktif dan rubrik asesmen.',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80',
    'pdf',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'https://onedrive.live.com/embed?resid=sample_modul_pai_fased',
    '2024',
    210,
    'Indonesia',
    true,
    2
  ),
  (
    'Bulughul Maram min Adillatil Ahkam (E-Book Terjemah)',
    'Al-Hafizh Ibnu Hajar Al-Asqalani',
    'Darul Hadits & Maktabah Turats',
    'Hadits Ahkam',
    'Kompilasi hadits-hadits hukum fikih tematis karya Ibnu Hajar Al-Asqalani dengan takhrij derajat hadits dan syarah ringkas.',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'mobi',
    'https://onedrive.live.com/download?resid=sample_bulughul_maram',
    'https://onedrive.live.com/embed?resid=sample_bulughul_maram',
    '2023',
    480,
    'Indonesia',
    true,
    3
  ),
  (
    'Safinatun Naja fi Ushulid Din wa Fiqhih',
    'Salim bin Sumair Al-Hadhrami',
    'Maktabah PAI Digital',
    'Akidah & Fikih',
    'Kitab pegangan dasar santri dan pelajar pemula tentang rukun iman, rukun Islam, tanda-tanda baligh, dan syarat sah shalat.',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    'azw3',
    'https://onedrive.live.com/download?resid=sample_safinatun_naja',
    'https://onedrive.live.com/embed?resid=sample_safinatun_naja',
    '2023',
    85,
    'Arab',
    true,
    4
  );
