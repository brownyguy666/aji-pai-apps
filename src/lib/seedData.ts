import { Profile, SectionItem, KategoriMateri, MateriPAI, ProyekTerjemahan, Karya, YouTubeVideo } from '../types/database';

export const initialProfile: Profile = {
  id: 'a0000000-0000-0000-0000-000000000001',
  nama: 'Ahmad Fauzi, S.Pd.I., M.Ag.',
  tagline: 'Pendidik Agama Islam, Penerjemah Kitab Turats & Kreator Konten Edukasi',
  bio: 'Mengabdi dalam dunia pendidikan Islam dengan memadukan khazanah keilmuan klasik (turats) dan pendekatan pedagogis modern abad 21. Berpengalaman lebih dari 10 tahun sebagai guru PAI, penerjemah kitab berbahasa Arab, dan perancang materi ajar digital interaktif.',
  foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  email: 'ahmad.fauzi.pai@gmail.com',
  youtube_channel_id: 'UC_example_youtube_id',
  socials: {
    youtube: 'https://youtube.com/@edukasipai',
    instagram: 'https://instagram.com/ahmadfauzi.pai',
    facebook: 'https://facebook.com/ahmadfauzipai',
    whatsapp: 'https://wa.me/6281234567890',
    telegram: 'https://t.me/ahmadfauzipai',
    github: 'https://github.com',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const initialSections: SectionItem[] = [
  { id: 's-1', key: 'hero', label: 'Profil & Pengantar Utama', urutan: 1, is_active: true },
  { id: 's-2', key: 'materi', label: 'Materi & Modul PAI Terbaru', urutan: 2, is_active: true },
  { id: 's-3', key: 'youtube', label: 'Channel & Video YouTube Edukasi', urutan: 3, is_active: true },
  { id: 's-4', key: 'terjemahan', label: 'Proyek Terjemahan Kitab & Buku', urutan: 4, is_active: true },
  { id: 's-5', key: 'karya', label: 'Galeri Karya & Publikasi Digital', urutan: 5, is_active: true },
  { id: 's-6', key: 'kontak', label: 'Kontak & Kolaborasi', urutan: 6, is_active: true },
];

export const initialCategories: KategoriMateri[] = [
  // Level 1: Kelas
  { id: 'c1-1', nama: 'Kelas X (Fase E)', parent_id: null, urutan: 1 },
  { id: 'c1-2', nama: 'Kelas XI (Fase F)', parent_id: null, urutan: 2 },
  { id: 'c1-3', nama: 'Kelas XII (Fase F+)', parent_id: null, urutan: 3 },
  // Level 2: Bidang Keilmuan
  { id: 'c2-1', nama: 'Al-Qur\'an & Hadits', parent_id: 'c1-1', urutan: 1 },
  { id: 'c2-2', nama: 'Aqidah & Akhlak', parent_id: 'c1-1', urutan: 2 },
  { id: 'c2-3', nama: 'Fiqih Ibadah & Muamalah', parent_id: 'c1-1', urutan: 3 },
  { id: 'c2-4', nama: 'Sejarah Kebudayaan Islam (SKI)', parent_id: 'c1-1', urutan: 4 },
  // Level 3: Sub-topik
  { id: 'c3-1', nama: 'Tafsir Q.S. Al-Ma\'idah: 48 (Kompetisi Kebaikan)', parent_id: 'c2-1', urutan: 1 },
  { id: 'c3-2', nama: 'Syu\'abul Iman (Cabang-cabang Iman)', parent_id: 'c2-2', urutan: 2 },
  { id: 'c3-3', nama: 'Fiqih Mawaris & Pembagian Waris', parent_id: 'c2-3', urutan: 3 },
];

export const initialMateri: MateriPAI[] = [
  {
    id: 'm-1',
    judul: 'Memahami Konsep Fastabiqul Khairat: Kajian Mendalam Q.S. Al-Maidah Ayat 48',
    slug: 'memahami-konsep-fastabiqul-khairat-al-maidah-48',
    deskripsi_singkat: 'Kajian tafsir tematik tentang anjuran berlomba-lomba dalam kebaikan, etos kerja islami, dan menjunjung tinggi integritas dalam kehidupan sehari-hari.',
    konten: `# Memahami Konsep Fastabiqul Khairat (Q.S. Al-Ma'idah: 48)

Dalam era globalisasi yang sarat akan tantangan moral dan kompetisi global, nilai-nilai Al-Qur'an memberikan pedoman yang sangat tegas dan relevan mengenai bagaimana seorang Muslim harus memposisikan dirinya.

> *"Dan Kami telah menurunkan Kitab (Al-Qur'an) kepadamu (Muhammad) dengan membawa kebenaran, yang membenarkan kitab-kitab yang diturunkan sebelumnya dan menjaganya... Maka berlomba-lombalah kamu dalam kebaikan."* (Q.S. Al-Ma'idah [5]: 48)

## 1. Makna Etimologis dan Terminologis
Secara bahasa, **Fastabiqul Khairat** (*فَاسْتَبِقُوا الْخَيْرَاتِ*) berakar dari kata *sabaqa* yang berarti mendahului atau berlomba, dan *al-khairat* yang merupakan bentuk jamak dari *khair* (kebaikan).

Konsep ini menuntut tindakan proaktif, bukan pasif. Seorang pelajar dan pendidik muslim tidak sekadar menghindari keburukan, melainkan secara aktif menciptakan kebaikan yang berdampak luas bagi umat manusia (*rahmatan lil 'alamin*).

## 2. Kandungan Pokok Ayat
1. **Keabsahan dan Keaslian Al-Qur'an**: Al-Qur'an menjadi batu uji (*muhaimin*) dan penyempurna kitab-kitab samawi sebelumnya.
2. **Ketetapan Syariat yang Proporsional**: Allah SWT menetapkan syariat dan jalan terang (*syir'atan wa minhajan*) yang sesuai bagi setiap zaman.
3. **Ujian atas Keragaman Manusia**: Perbedaan latar belakang manusia dijadikan arena untuk menguji siapa yang terbaik amal perbuatannya.

## 3. Implementasi Pedagogis dalam Kehidupan Siswa
- **Dalam Akademik**: Menuntut ilmu bukan untuk menyombongkan diri, melainkan untuk memperluas manfaat dan memecahkan permasalahan masyarakat.
- **Dalam Sosial**: Bersikap empati, saling tolong-menolong (*ta'awun*), dan menjadi pelopor solusi kebajikan di lingkungan sekitar.
- **Dalam Era Digital**: Memproduksi konten edukatif, menyebarkan narasi damai, dan memerangi disinformasi serta ujaran kebencian.

---
Silakan unduh file lampiran modul ajar dan LKPD di bawah untuk pendalaman materi.`,
    gambar_cover_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    kategori_id: 'c3-1',
    status: 'published',
    view_count: 428,
    created_at: '2024-05-10T10:00:00Z',
    updated_at: '2024-05-10T10:00:00Z',
    files: [
      {
        id: 'f-1',
        materi_id: 'm-1',
        nama_file: 'Modul_Ajar_PAI_Fastabiqul_Khairat_Kelas_X.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'pdf',
        ukuran_bytes: 2450000,
      },
      {
        id: 'f-2',
        materi_id: 'm-1',
        nama_file: 'Lembar_Kerja_Peserta_Didik_LKPD_AlMaidah48.docx',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'word',
        ukuran_bytes: 890000,
      },
    ],
  },
  {
    id: 'm-2',
    judul: 'Pohon Keimanan: Analisis Komprehensif 77 Cabang Iman (Syu\'abul Iman)',
    slug: 'analisis-komprehensif-77-cabang-iman-syuabul-iman',
    deskripsi_singkat: 'Penjelasan terstruktur mengenai pilar-pilar cabang keimanan yang mencakup ranah hati, lisan, dan perbuatan praktis.',
    konten: `# Pohon Keimanan: 77 Cabang Iman (Syu'abul Iman)

Rasulullah ﷺ bersabda:
> *"Iman itu mempunyai 70 lebih (atau 60 lebih) cabang. Yang paling utama adalah ucapan Laa ilaaha illallaah, dan yang paling rendah adalah menyingkirkan duri dari jalan, dan rasa malu adalah salah satu cabang dari iman."* (HR. Bukhari dan Muslim)

## Klasifikasi 3 Dimensi Syu'abul Iman

### A. Cabang Iman yang Berkaitan dengan Niat, Akidah, dan Hati (30 Cabang)
Mencakup keimanan kepada rukun iman yang enam, keikhlasan, rasa takut (*khauf*), pengharapan (*raja'*), tawakal, dan ridha terhadap takdir Allah SWT.

### B. Cabang Iman yang Berkaitan dengan Lisan (7 Cabang)
1. Mengucapkan kalimat tauhid *Laa ilaaha illallaah*.
2. Membaca dan mentadaburi Al-Qur'an.
3. Menuntut dan mengajarkan ilmu agama.
4. Berdoa dan berdzikir.
5. Menjaga lisan dari perkataan sia-sia, dusta, dan ghibah.

### C. Cabang Iman yang Berkaitan dengan Anggota Badan (40 Cabang)
Meliputi ibadah badaniyah (shalat, zakat, puasa, haji), akhlak mulia dalam keluarga dan masyarakat, menegakkan keadilan, serta menjaga kebersihan dan keselamatan umum.`,
    gambar_cover_url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
    kategori_id: 'c3-2',
    status: 'published',
    view_count: 315,
    created_at: '2024-04-18T09:30:00Z',
    updated_at: '2024-04-18T09:30:00Z',
    files: [
      {
        id: 'f-3',
        materi_id: 'm-2',
        nama_file: 'Slide_Presentasi_77_Cabang_Iman_Interaktif.pptx',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'ppt',
        ukuran_bytes: 4320000,
      },
    ],
  },
  {
    id: 'm-3',
    judul: 'Panduan Praktis Fiqih Mawaris: Kaidah Pembagian Harta Waris dalam Islam',
    slug: 'panduan-praktis-fiqih-mawaris-harta-waris-islam',
    deskripsi_singkat: 'Matrikulasi sistematis ilmu faraidh, bagian dzawil furudh, ashabah, dan studi kasus perhitungan waris kontemporer.',
    konten: `# Panduan Praktis Fiqih Mawaris (Ilmu Faraidh)

Ilmu faraidh merupakan salah satu disiplin ilmu syariat yang sangat ditekankan oleh Rasulullah ﷺ untuk dipelajari karena merupakan ilmu yang pertama kali akan diangkat dan sering kali diabaikan.

## 1. Rukun dan Syarat Waris
Sebelum harta warisan dibagikan kepada ahli waris, terdapat 4 hak mendasar yang harus diselesaikan terlebih dahulu dari harta peninggalan (*tirkah*):
1. Biaya pengurusan jenazah (*tajhiz al-janazah*).
2. Pelunasan utang piutang (*ada' ad-duyun*).
3. Pelaksanaan wasiat maksimal sepertiga harta (*tanfidz al-washaya*).
4. Pembagian sisa harta kepada ahli waris yang berhak.

## 2. Tabel Bagian Ashabul Furudh
- **1/2**: Suami (tanpa anak), Anak perempuan tunggal, Cucu perempuan dari anak laki-laki tunggal, Saudari kandung tunggal.
- **1/4**: Suami (jika ada anak), Istri (tanpa anak).
- **1/8**: Istri (jika ada anak).
- **2/3**: Dua anak perempuan atau lebih, Dua cucu perempuan dari anak laki-laki atau lebih, Dua saudari kandung atau lebih.
- **1/3**: Ibu (tanpa anak dan saudara), Saudara/i seibu dua orang atau lebih.
- **1/6**: Ayah (ada anak), Ibu (ada anak/saudara), Kakek shahih, Nenek shahihah, Saudara/i seibu tunggal.`,
    gambar_cover_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    kategori_id: 'c3-3',
    status: 'published',
    view_count: 512,
    created_at: '2024-03-22T14:15:00Z',
    updated_at: '2024-03-22T14:15:00Z',
    files: [
      {
        id: 'f-4',
        materi_id: 'm-3',
        nama_file: 'Buku_Saku_Ringkasan_Ilmu_Mawaris_Lengkap.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'pdf',
        ukuran_bytes: 3120000,
      },
      {
        id: 'f-5',
        materi_id: 'm-3',
        nama_file: 'Template_Kalkulasi_Harta_Waris_Excel.xlsx',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'excel',
        ukuran_bytes: 650000,
      },
    ],
  },
];

export const initialTerjemahan: ProyekTerjemahan[] = [
  {
    id: 't-1',
    judul: 'Terjemahan & Syarah Matan Al-Ghayah wa At-Taqrib (Matan Abi Syuja\')',
    bahasa_asal: 'Bahasa Arab',
    bahasa_tujuan: 'Bahasa Indonesia',
    deskripsi: 'Terjemahan lengkap disertai anotasi perbandingan qaul mu\'tamad mazhab Syafi\'i untuk bab Thaharah hingga Bab Jinayat, memudahkan pemula memahami fikih klasik.',
    link_file: 'https://archive.org',
    tahun: 2024,
    urutan: 1,
  },
  {
    id: 't-2',
    judul: 'Terjemahan Konseptual Kitab Al-Hikam Karya Syaikh Ibnu Atha\'illah As-Sakandari',
    bahasa_asal: 'Bahasa Arab',
    bahasa_tujuan: 'Bahasa Indonesia',
    deskripsi: 'Kajian terjemahan kontekstual 264 pasal hikmah tasawuf amali, dilengkapi indeks tematik untuk penanaman nilai spiritual pendidik dan peserta didik.',
    link_file: 'https://archive.org',
    tahun: 2023,
    urutan: 2,
  },
  {
    id: 't-3',
    judul: 'Anotasi & Terjemah Kitab Ta\'lim Al-Muta\'allim Thariq At-Ta\'allum',
    bahasa_asal: 'Bahasa Arab',
    bahasa_tujuan: 'Bahasa Indonesia',
    deskripsi: 'Pedoman adab penuntut ilmu karya Imam Az-Zarnuji yang disesuaikan dengan konteks psikologi pendidikan dan etika belajar siswa modern.',
    link_file: 'https://archive.org',
    tahun: 2022,
    urutan: 3,
  },
  {
    id: 't-4',
    judul: 'Terjemahan Risalah Al-Jami\'ah fi Ushuliddin wa At-Tasawwuf wa Al-Fiqh',
    bahasa_asal: 'Bahasa Arab',
    bahasa_tujuan: 'Bahasa Indonesia',
    deskripsi: 'Kitab ringkas karya Al-Habib Ahmad bin Zain Al-Habsyi yang merangkum tiga pilar utama Islam (Iman, Islam, Ihsan) dalam satu bingkai.',
    link_file: 'https://archive.org',
    tahun: 2021,
    urutan: 4,
  },
];

export const initialKarya: Karya[] = [
  {
    id: 'k-1',
    judul: 'Infografis Alur Pensyariatan Ibadah Shalat & Wudhu Sesuai Sunnah',
    deskripsi: 'Desain visual beresolusi tinggi yang merangkum rukun, syarat sah, sunnah, dan pembatal thaharah serta shalat dalam format estetik.',
    gambar_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://behance.net',
    kategori: 'Infografis',
    urutan: 1,
  },
  {
    id: 'k-2',
    judul: 'E-Book: Bunga Rampai Pendekatan Pembelajaran PAI Abad 21',
    deskripsi: 'Buku digital kompilasi model pembelajaran inovatif (Project Based Learning, TPACK, dan Gamifikasi) untuk guru PAI SMA/SMK.',
    gambar_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://play.google.com/books',
    kategori: 'Buku Digital',
    urutan: 2,
  },
  {
    id: 'k-3',
    judul: 'Modul Ajar Kurikulum Merdeka PAI Fase E & Fase F Terintegrasi Profil Pelajar Pancasila',
    deskripsi: 'Paket modul ajar 1 tahun ajaran lengkap dengan ATP, LKPD, rubrik asesmen autentik, dan media ajar interaktif berbasis Canva & Quizizz.',
    gambar_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://guru.kemdikbud.go.id',
    kategori: 'Modul Ajar',
    urutan: 3,
  },
  {
    id: 'k-4',
    judul: 'Seri Video Animasi Edukasi Fiqih Remaja: Menghadapi Baligh & Pubertas',
    deskripsi: 'Video motion graphic interaktif edukatif yang membahas hukum syariat seputar tanda-tanda baligh, mandi wajib, dan adab pergaulan.',
    gambar_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://youtube.com',
    kategori: 'Video Animasi',
    urutan: 4,
  },
];

export const initialYouTubeVideos: YouTubeVideo[] = [
  {
    id: 'y-1',
    title: 'Kajian Tafsir Al-Maidah Ayat 48 - Semangat Kompetisi dalam Kebaikan',
    video_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=640&q=80',
    published_at: '12 Mei 2024',
    urutan: 1,
    is_featured: true,
  },
  {
    id: 'y-2',
    title: 'Membedah Kitab Matan Al-Ghayah wa At-Taqrib: Bab Thaharah Bagian 1',
    video_id: 'kJQP7kiw5Fk',
    thumbnail_url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=640&q=80',
    published_at: '20 Apr 2024',
    urutan: 2,
    is_featured: true,
  },
  {
    id: 'y-3',
    title: 'Tips Efektif Belajar Bahasa Arab dan Membaca Kitab Gundul untuk Pemula',
    video_id: '3JZ_D3ELwOQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=640&q=80',
    published_at: '15 Mar 2024',
    urutan: 3,
    is_featured: true,
  },
  {
    id: 'y-4',
    title: 'Pohon Keimanan: Kupas Tuntas 77 Cabang Iman dalam Kehidupan Sehari-hari',
    video_id: 'fJ9rUzIMcZQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=640&q=80',
    published_at: '28 Feb 2024',
    urutan: 4,
    is_featured: true,
  },
];
