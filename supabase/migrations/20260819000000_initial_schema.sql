-- ==============================================================================
-- SCHEMA MIGRATION: Website Portofolio & Edukasi PAI
-- ==============================================================================

-- 1. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL: profile
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

-- 3. TABEL: sections (Kontrol Urutan & Visibilitas Modular Landing Page)
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    urutan INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL: kategori_materi (Kategori Bertingkat / Hierarki: Kelas > Topik > Sub-topik)
CREATE TABLE IF NOT EXISTS public.kategori_materi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    parent_id UUID REFERENCES public.kategori_materi(id) ON DELETE CASCADE,
    urutan INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL: materi_pai (Artikel / Blog Pembelajaran PAI)
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

-- 6. TABEL: materi_file (File Lampiran untuk diunduh: PDF / PPT / Word)
CREATE TABLE IF NOT EXISTS public.materi_file (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    materi_id UUID NOT NULL REFERENCES public.materi_pai(id) ON DELETE CASCADE,
    nama_file TEXT NOT NULL,
    file_url TEXT NOT NULL,
    tipe TEXT NOT NULL DEFAULT 'pdf',
    ukuran_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL: proyek_terjemahan
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

-- 8. TABEL: karya (Galeri Karya / Portofolio)
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

-- 9. TABEL: youtube_videos (Video Pilihan / Channel Embed)
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

-- Enable RLS on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategori_materi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materi_pai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materi_file ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyek_terjemahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karya ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- 1. profile RLS
CREATE POLICY "Publik dapat membaca profil" ON public.profile
    FOR SELECT USING (true);

CREATE POLICY "Admin dapat mengelola profil" ON public.profile
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. sections RLS
CREATE POLICY "Publik dapat membaca sections" ON public.sections
    FOR SELECT USING (true);

CREATE POLICY "Admin dapat mengelola sections" ON public.sections
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. kategori_materi RLS
CREATE POLICY "Publik dapat membaca kategori_materi" ON public.kategori_materi
    FOR SELECT USING (true);

CREATE POLICY "Admin dapat mengelola kategori_materi" ON public.kategori_materi
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. materi_pai RLS
CREATE POLICY "Publik dapat membaca materi published" ON public.materi_pai
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admin dapat mengelola semua materi_pai" ON public.materi_pai
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. materi_file RLS
CREATE POLICY "Publik dapat membaca materi_file" ON public.materi_file
    FOR SELECT USING (true);

CREATE POLICY "Admin dapat mengelola materi_file" ON public.materi_file
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. proyek_terjemahan RLS
CREATE POLICY "Publik dapat membaca proyek_terjemahan" ON public.proyek_terjemahan
    FOR SELECT USING (true);

CREATE POLICY "Admin dapat mengelola proyek_terjemahan" ON public.proyek_terjemahan
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. karya RLS
CREATE POLICY "Publik dapat membaca karya" ON public.karya
    FOR SELECT USING (true);

CREATE POLICY "Admin dapat mengelola karya" ON public.karya
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. youtube_videos RLS
CREATE POLICY "Publik dapat membaca youtube_videos" ON public.youtube_videos
    FOR SELECT USING (true);

CREATE POLICY "Admin dapat mengelola youtube_videos" ON public.youtube_videos
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- STORAGE BUCKETS SETUP (Run via Supabase Dashboard / SQL)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('images', 'images', true),
    ('materi-files', 'materi-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public Read, Authenticated Write
CREATE POLICY "Publik dapat melihat images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Admin dapat mengunggah images" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');

CREATE POLICY "Admin dapat memperbarui images" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'images');

CREATE POLICY "Admin dapat menghapus images" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'images');

CREATE POLICY "Publik dapat mengunduh materi-files" ON storage.objects
    FOR SELECT USING (bucket_id = 'materi-files');

CREATE POLICY "Admin dapat mengunggah materi-files" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'materi-files');

CREATE POLICY "Admin dapat memperbarui materi-files" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'materi-files');

CREATE POLICY "Admin dapat menghapus materi-files" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'materi-files');


-- ==============================================================================
-- SEED DATA (DATA AWAL LENGKAP & REALISTIS)
-- ==============================================================================

-- 1. Seed Profile
INSERT INTO public.profile (id, nama, tagline, bio, foto_url, email, youtube_channel_id, socials)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Ahmad Fauzi, S.Pd.I., M.Ag.',
    'Pendidik Agama Islam, Penerjemah Kitab Kuning & Kreator Konten Edukasi',
    'Mengabdi dalam dunia pendidikan Islam dengan memadukan khazanah keilmuan klasik (turats) dan pendekatan pedagogis modern abad 21. Berpengalaman lebih dari 10 tahun sebagai guru PAI, penerjemah kitab turats berbahasa Arab, dan perancang materi ajar digital interaktif.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'ahmad.fauzi.pai@gmail.com',
    'UC_example_youtube_id',
    '{"youtube": "https://youtube.com/@edukasipai", "instagram": "https://instagram.com/ahmadfauzi.pai", "facebook": "https://facebook.com/ahmadfauzipai", "whatsapp": "https://wa.me/6281234567890", "telegram": "https://t.me/ahmadfauzipai"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 2. Seed Sections (Kontrol Dinamis Urutan Landing Page)
INSERT INTO public.sections (key, label, urutan, is_active) VALUES
    ('hero', 'Profil & Pengantar Utama', 1, true),
    ('materi', 'Materi & Modul PAI Terbaru', 2, true),
    ('youtube', 'Channel & Video YouTube Edukasi', 3, true),
    ('terjemahan', 'Proyek Terjemahan Kitab & Buku', 4, true),
    ('karya', 'Galeri Karya & Publikasi Digital', 5, true),
    ('kontak', 'Kontak & Kolaborasi', 6, true)
ON CONFLICT (key) DO UPDATE SET 
    label = EXCLUDED.label,
    urutan = EXCLUDED.urutan,
    is_active = EXCLUDED.is_active;

-- 3. Seed Kategori Materi (Hierarki: Kelas > Bidang Ilmu > Topik)
-- Level 1: Kelas
INSERT INTO public.kategori_materi (id, nama, parent_id, urutan) VALUES
    ('c1000000-0000-0000-0000-000000000001', 'Kelas X (Fase E)', NULL, 1),
    ('c1000000-0000-0000-0000-000000000002', 'Kelas XI (Fase F)', NULL, 2),
    ('c1000000-0000-0000-0000-000000000003', 'Kelas XII (Fase F+)', NULL, 3)
ON CONFLICT (id) DO NOTHING;

-- Level 2: Bidang Ilmu (di bawah Kelas X)
INSERT INTO public.kategori_materi (id, nama, parent_id, urutan) VALUES
    ('c2000000-0000-0000-0000-000000000001', 'Al-Qur''an & Hadits', 'c1000000-0000-0000-0000-000000000001', 1),
    ('c2000000-0000-0000-0000-000000000002', 'Aqidah & Akhlak', 'c1000000-0000-0000-0000-000000000001', 2),
    ('c2000000-0000-0000-0000-000000000003', 'Fiqih Ibadah & Muamalah', 'c1000000-0000-0000-0000-000000000001', 3),
    ('c2000000-0000-0000-0000-000000000004', 'Sejarah Kebudayaan Islam (SKI)', 'c1000000-0000-0000-0000-000000000001', 4)
ON CONFLICT (id) DO NOTHING;

-- Level 3: Topik Spesifik
INSERT INTO public.kategori_materi (id, nama, parent_id, urutan) VALUES
    ('c3000000-0000-0000-0000-000000000001', 'Tafsir Q.S. Al-Maidah: 48 (Kompetisi Kebaikan)', 'c2000000-0000-0000-0000-000000000001', 1),
    ('c3000000-0000-0000-0000-000000000002', 'Syu''abul Iman (Cabang-cabang Iman)', 'c2000000-0000-0000-0000-000000000002', 2),
    ('c3000000-0000-0000-0000-000000000003', 'Fiqih Mawaris & Pembagian Harta Waris', 'c2000000-0000-0000-0000-000000000003', 3)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Materi PAI
INSERT INTO public.materi_pai (id, judul, slug, deskripsi_singkat, konten, gambar_cover_url, kategori_id, status, view_count) VALUES
(
    'm0000000-0000-0000-0000-000000000001',
    'Memahami Konsep Fastabiqul Khairat: Kajian Mendalam Q.S. Al-Maidah Ayat 48',
    'memahami-konsep-fastabiqul-khairat-al-maidah-48',
    'Kajian tafsir tematik tentang anjuran berlomba-lomba dalam kebaikan, etos kerja islami, dan menjunjung tinggi integritas dalam kehidupan sehari-hari.',
    '# Memahami Konsep Fastabiqul Khairat (Q.S. Al-Ma''idah: 48)

Dalam era globalisasi yang sarat akan tantangan moral dan kompetisi global, nilai-nilai Al-Qur''an memberikan pedoman yang sangat tegas dan relevan mengenai bagaimana seorang Muslim harus memposisikan dirinya.

> *"Dan Kami telah menurunkan Kitab (Al-Qur''an) kepadamu (Muhammad) dengan membawa kebenaran, yang membenarkan kitab-kitab yang diturunkan sebelumnya dan menjaganya... Maka berlomba-lombalah kamu dalam kebaikan."* (Q.S. Al-Ma''idah [5]: 48)

## 1. Makna Etimologis dan Terminologis
Secara bahasa, **Fastabiqul Khairat** (*فَاسْتَبِقُوا الْخَيْرَاتِ*) berakar dari kata *sabaqa* yang berarti mendahului atau berlomba, dan *al-khairat* yang merupakan bentuk jamak dari *khair* (kebaikan).

Konsep ini menuntut tindakan proaktif, bukan pasif. Seorang pelajar dan pendidik muslim tidak sekadar menghindari keburukan, melainkan secara aktif menciptakan kebaikan yang berdampak luas bagi umat manusia (*rahmatan lil ''alamin*).

## 2. Kandungan Pokok Ayat
1. **Keabsahan dan Keaslian Al-Qur''an**: Al-Qur''an menjadi batu uji (*muhaimin*) dan penyempurna kitab-kitab samawi sebelumnya.
2. **Ketetapan Syariat yang Proporsional**: Allah SWT menetapkan syariat dan jalan terang (*syir''atan wa minhajan*) yang sesuai bagi setiap zaman.
3. **Ujian atas Keragaman Manusia**: Perbedaan latar belakang manusia dijadikan arena untuk menguji siapa yang terbaik amal perbuatannya.

## 3. Implementasi Pedagogis dalam Kehidupan Siswa
- **Dalam Akademik**: Menuntut ilmu bukan untuk menyombongkan diri, melainkan untuk memperluas manfaat dan memecahkan permasalahan masyarakat.
- **Dalam Sosial**: Bersikap empati, saling tolong-menolong (*ta''awun*), dan menjadi pelopor solusi kebajikan di lingkungan sekitar.
- **Dalam Era Digital**: Memproduksi konten edukatif, menyebarkan narasi damai, dan memerangi disinformasi serta ujaran kebencian.

Unduh file rangkuman materi dan lembar kerja peserta didik (LKPD) pada lampiran di bawah.',
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    'c3000000-0000-0000-0000-000000000001',
    'published',
    428
),
(
    'm0000000-0000-0000-0000-000000000002',
    'Pohon Keimanan: Analisis Komprehensif 77 Cabang Iman (Syu''abul Iman)',
    'analisis-komprehensif-77-cabang-iman-syuabul-iman',
    'Penjelasan terstruktur mengenai pilar-pilar cabang keimanan yang mencakup ranah hati (ma''rifatun bil qalb), lisan (iqrarun bil lisan), dan perbuatan (amalun bil arkan).',
    '# Pohon Keimanan: 77 Cabang Iman (Syu''abul Iman)

Rasulullah ﷺ bersabda:
> *"Iman itu mempunyai 70 lebih (atau 60 lebih) cabang. Yang paling utama adalah ucapan Laa ilaaha illallaah, dan yang paling rendah adalah menyingkirkan duri dari jalan, dan rasa malu adalah salah satu cabang dari iman."* (HR. Bukhari dan Muslim)

## Klasifikasi 3 Dimensi Syu''abul Iman

### A. Cabang Iman yang Berkaitan dengan Niat, Akidah, dan Hati (30 Cabang)
Mencakup keimanan kepada rukun iman yang enam, keikhlasan, rasa takut (*khauf*), pengharapan (*raja''*), tawakal, dan ridha terhadap takdir Allah SWT.

### B. Cabang Iman yang Berkaitan dengan Lisan (7 Cabang)
1. Mengucapkan kalimat tauhid *Laa ilaaha illallaah*.
2. Membaca dan mentadaburi Al-Qur''an.
3. Menuntut dan mengajarkan ilmu agama.
4. Berdoa dan berdzikir.
5. Menjaga lisan dari perkataan sia-sia, dusta, dan ghibah.

### C. Cabang Iman yang Berkaitan dengan Anggota Badan (40 Cabang)
Meliputi ibadah badaniyah (shalat, zakat, puasa, haji), akhlak mulia dalam keluarga dan masyarakat, menegakkan keadilan, serta menjaga kebersihan dan keselamatan umum.

Simak video penjelasan dan unduh file presentasi PPT interaktif di bagian lampiran.',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
    'c3000000-0000-0000-0000-000000000002',
    'published',
    315
),
(
    'm0000000-0000-0000-0000-000000000003',
    'Panduan Praktis Fiqih Mawaris: Kaidah Pembagian Harta Waris dalam Islam',
    'panduan-praktis-fiqih-mawaris-harta-waris-islam',
    'Matrikulasi sistematis ilmu faraidh, bagian dzawil furudh, ashabah, dan studi kasus praktis perhitungan waris kontemporer.',
    '# Panduan Praktis Fiqih Mawaris (Ilmu Faraidh)

Ilmu faraidh merupakan salah satu disiplin ilmu syariat yang sangat ditekankan oleh Rasulullah ﷺ untuk dipelajari karena merupakan ilmu yang pertama kali akan diangkat dan sering kali diabaikan.

## 1. Rukun dan Syarat Waris
Sebelum harta warisan dibagikan kepada ahli waris, terdapat 4 hak mendasar yang harus diselesaikan terlebih dahulu dari harta peninggalan (*tirkah*):
1. Biaya pengurusan jenazah (*tajhiz al-janazah*).
2. Pelunasan utang piutang (*ada'' ad-duyun*).
3. Pelaksanaan wasiat maksimal sepertiga harta (*tanfidz al-washaya*).
4. Pembagian sisa harta kepada ahli waris yang berhak.

## 2. Tabel Bagian Ashabul Furudh
- **1/2**: Suami (tanpa anak), Anak perempuan tunggal, Cucu perempuan dari anak laki-laki tunggal, Saudari kandung tunggal.
- **1/4**: Suami (jika ada anak), Istri (tanpa anak).
- **1/8**: Istri (jika ada anak).
- **2/3**: Dua anak perempuan atau lebih, Dua cucu perempuan dari anak laki-laki atau lebih, Dua saudari kandung atau lebih.
- **1/3**: Ibu (tanpa anak dan saudara), Saudara/i seibu dua orang atau lebih.
- **1/6**: Ayah (ada anak), Ibu (ada anak/saudara), Kakek shahih, Nenek shahihah, Saudara/i seibu tunggal.

Tersedia kalkulator excel dan modul PDF lengkap untuk diunduh.',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    'c3000000-0000-0000-0000-000000000003',
    'published',
    512
) ON CONFLICT (id) DO NOTHING;

-- 5. Seed Materi Files (Lampiran)
INSERT INTO public.materi_file (materi_id, nama_file, file_url, tipe, ukuran_bytes) VALUES
    ('m0000000-0000-0000-0000-000000000001', 'Modul_Ajar_PAI_Fastabiqul_Khairat_Kelas_X.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'pdf', 2450000),
    ('m0000000-0000-0000-0000-000000000001', 'Lembar_Kerja_Peserta_Didik_LKPD_AlMaidah48.docx', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'word', 890000),
    ('m0000000-0000-0000-0000-000000000002', 'Slide_Presentasi_77_Cabang_Iman_Interaktif.pptx', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'ppt', 4320000),
    ('m0000000-0000-0000-0000-000000000003', 'Buku_Saku_Ringkasan_Ilmu_Mawaris_Lengkap.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'pdf', 3120000),
    ('m0000000-0000-0000-0000-000000000003', 'Template_Kalkulasi_Harta_Waris_Excel.xlsx', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'word', 650000)
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Proyek Terjemahan
INSERT INTO public.proyek_terjemahan (judul, bahasa_asal, bahasa_tujuan, deskripsi, link_file, tahun, urutan) VALUES
(
    'Terjemahan & Syarah Matan Al-Ghayah wa At-Taqrib (Matan Abi Syuja'')',
    'Bahasa Arab',
    'Bahasa Indonesia',
    'Terjemahan lengkap disertai anotasi perbandingan qaul mu''tamad mazhab Syafi''i untuk bab Thaharah hingga Bab Jinayat, memudahkan pemula memahami fikih klasik dengan bahasa Indonesia baku.',
    'https://archive.org',
    2024,
    1
),
(
    'Terjemahan Konseptual Kitab Al-Hikam Karya Syaikh Ibnu Atha''illah As-Sakandari',
    'Bahasa Arab',
    'Bahasa Indonesia',
    'Kajian terjemahan kontekstual 264 pasal hikmah tasawuf amali, dilengkapi indeks tematik untuk penanaman nilai etika spiritual pendidik dan peserta didik.',
    'https://archive.org',
    2023,
    2
),
(
    'Anotasi & Terjemah Kitab Ta''lim Al-Muta''allim Thariq At-Ta''allum',
    'Bahasa Arab',
    'Bahasa Indonesia',
    'Pedoman adab penuntut ilmu karya Imam Az-Zarnuji yang disesuaikan dengan konteks psikologi pendidikan dan tantangan etika belajar siswa modern.',
    'https://archive.org',
    2022,
    3
),
(
    'Terjemahan Risalah Al-Jami''ah fi Ushuliddin wa At-Tasawwuf wa Al-Fiqh',
    'Bahasa Arab',
    'Bahasa Indonesia',
    'Kitab ringkas karya Al-Habib Ahmad bin Zain Al-Habsyi yang merangkum tiga pilar utama Islam (Iman, Islam, Ihsan) dalam bingkai komprehensif.',
    'https://archive.org',
    2021,
    4
);

-- 7. Seed Karya (Galeri Portofolio & Publikasi)
INSERT INTO public.karya (judul, deskripsi, gambar_url, link_eksternal, kategori, urutan) VALUES
(
    'Infografis Alur Pensyariatan Ibadah Shalat & Wudhu Sesuai Sunnah',
    'Desain infografis beresolusi tinggi yang merangkum rukun, syarat sah, sunnah, dan hal-hal yang membatalkan thaharah serta shalat dalam format visual estetik.',
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    'https://behance.net',
    'Infografis',
    1
),
(
    'E-Book: Bunga Rampai Pendekatan Pembelajaran PAI Abad 21',
    'Buku digital kompilasi model pembelajaran inovatif (Project Based Learning, TPACK, dan Gamifikasi) untuk guru PAI jenjang SMA/SMK.',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://play.google.com/books',
    'Buku Digital',
    2
),
(
    'Modul Ajar Kurikulum Merdeka PAI Fase E & Fase F Terintegrasi Profil Pelajar Pancasila',
    'Paket modul ajar 1 tahun ajaran lengkap dengan ATP, LKPD, rubrik asesmen autentik, dan media ajar interaktif berbasis Canva & Quizizz.',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    'https://guru.kemdikbud.go.id',
    'Modul Ajar',
    3
),
(
    'Seri Video Animasi Edukasi Fiqih Remaja: Menghadapi Baligh & Pubertas',
    'Video motion graphic interaktif edukatif yang membahas hukum syariat seputar tanda-tanda baligh, mandi wajib, dan adab pergaulan islami bagi remaja.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    'https://youtube.com',
    'Video Animasi',
    4
);

-- 8. Seed YouTube Videos
INSERT INTO public.youtube_videos (title, video_id, thumbnail_url, published_at, urutan, is_featured) VALUES
(
    'Kajian Tafsir Al-Maidah Ayat 48 - Semangat Kompetisi dalam Kebaikan',
    'dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=640&q=80',
    '2024-05-12',
    1,
    true
),
(
    'Membedah Kitab Matan Al-Ghayah wa At-Taqrib: Bab Thaharah Bagian 1',
    'kJQP7kiw5Fk',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=640&q=80',
    '2024-04-20',
    2,
    true
),
(
    'Tips Efektif Belajar Bahasa Arab dan Membaca Kitab Gundul untuk Pemula',
    '3JZ_D3ELwOQ',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=640&q=80',
    '2024-03-15',
    3,
    true
),
(
    'Pohon Keimanan: Kupas Tuntas 77 Cabang Iman dalam Kehidupan Sehari-hari',
    'fJ9rUzIMcZQ',
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=640&q=80',
    '2024-02-28',
    4,
    true
);
