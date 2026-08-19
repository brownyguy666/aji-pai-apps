import {
  Profile,
  SectionItem,
  KategoriMateri,
  MateriPAI,
  ProyekTerjemahan,
  Karya,
  YouTubeVideo,
  Sertifikasi,
  Riwayat,
  Testimoni,
  FAQ,
  Tag,
  Komentar,
  Subscriber,
} from '../types/database';

export const initialProfile: Profile = {
  id: 'a0000000-0000-0000-0000-000000000001',
  nama: 'Aji Bagus Khoiri',
  tagline: 'Pendidik Agama Islam (Fase D SMP), Google Certified Educator & Penggiat Turats Digital',
  bio: 'Mengabdi dalam dunia pendidikan Islam dengan memadukan khazanah keilmuan klasik (turats) dan pendekatan pedagogis modern abad 21 berbasis Google for Education. Berpengalaman sebagai guru PAI SMP, penerjemah kitab berbahasa Arab, dan perancang materi ajar digital interaktif.',
  foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  email: 'ajibaguskhoiri@gmail.com',
  youtube_channel_id: 'UCntpnPCycMUUtU34ztu_PtQ',
  socials: {
    youtube: 'https://www.youtube.com/@ZonaBelajarID',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    whatsapp: 'https://wa.me/6281234567890',
    telegram: 'https://t.me',
    github: 'https://github.com/brownyguy666',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const initialSections: SectionItem[] = [
  { id: 's-1', key: 'hero', label: 'Profil & Pengantar Utama', urutan: 1, is_active: true },
  { id: 's-2', key: 'sertifikasi', label: 'Sertifikasi & Kredensial Resmi', urutan: 2, is_active: true },
  { id: 's-3', key: 'statistik', label: 'Statistik & Angka Pembelajaran', urutan: 3, is_active: true },
  { id: 's-4', key: 'materi', label: 'Materi & Modul PAI Fase D', urutan: 4, is_active: true },
  { id: 's-5', key: 'youtube', label: 'Channel & Video YouTube Edukasi', urutan: 5, is_active: true },
  { id: 's-6', key: 'terjemahan', label: 'Proyek Terjemahan Kitab & Buku', urutan: 6, is_active: true },
  { id: 's-7', key: 'karya', label: 'Galeri Karya & Publikasi Digital', urutan: 7, is_active: true },
  { id: 's-8', key: 'riwayat', label: 'Riwayat Pendidikan & Organisasi', urutan: 8, is_active: true },
  { id: 's-9', key: 'testimoni', label: 'Testimoni Siswa & Rekan Guru', urutan: 9, is_active: true },
  { id: 's-10', key: 'faq', label: 'Tanya Jawab & Bantuan (FAQ)', urutan: 10, is_active: true },
  { id: 's-11', key: 'kontak', label: 'Kontak & Kolaborasi', urutan: 11, is_active: true },
];

export const initialTags: Tag[] = [
  { id: 'tag-1', nama: 'Al-Qur\'an Hadis', slug: 'al-quran-hadis' },
  { id: 'tag-2', nama: 'Akidah', slug: 'akidah' },
  { id: 'tag-3', nama: 'Akhlak', slug: 'akhlak' },
  { id: 'tag-4', nama: 'Fikih Ibadah', slug: 'fikih-ibadah' },
  { id: 'tag-5', nama: 'Sejarah Kebudayaan Islam', slug: 'ski' },
  { id: 'tag-6', nama: 'Kurikulum Merdeka', slug: 'kurikulum-merdeka' },
  { id: 'tag-7', nama: 'Fase D (SMP)', slug: 'fase-d' },
  { id: 'tag-8', nama: 'Asmaul Husna', slug: 'asmaul-husna' },
  { id: 'tag-9', nama: 'Moderasi Beragama', slug: 'moderasi-beragama' },
  { id: 'tag-10', nama: 'LKPD Digital', slug: 'lkpd-digital' },
];

export const initialCategories: KategoriMateri[] = [
  // Level 1: Tingkat Kelas Fase D (SMP)
  { id: 'c-k7', nama: 'Kelas 7 (Fase D)', parent_id: null, urutan: 1 },
  { id: 'c-k8', nama: 'Kelas 8 (Fase D)', parent_id: null, urutan: 2 },
  { id: 'c-k9', nama: 'Kelas 9 (Fase D)', parent_id: null, urutan: 3 },

  // Level 2: 5 Elemen PAI Kelas 7
  { id: 'c-k7-qurhad', nama: 'Al-Qur\'an dan Hadis', parent_id: 'c-k7', urutan: 1 },
  { id: 'c-k7-akidah', nama: 'Akidah', parent_id: 'c-k7', urutan: 2 },
  { id: 'c-k7-akhlak', nama: 'Akhlak', parent_id: 'c-k7', urutan: 3 },
  { id: 'c-k7-fikih', nama: 'Fikih', parent_id: 'c-k7', urutan: 4 },
  { id: 'c-k7-ski', nama: 'Sejarah Kebudayaan Islam (SKI)', parent_id: 'c-k7', urutan: 5 },

  // Level 2: 5 Elemen PAI Kelas 8
  { id: 'c-k8-qurhad', nama: 'Al-Qur\'an dan Hadis', parent_id: 'c-k8', urutan: 1 },
  { id: 'c-k8-akidah', nama: 'Akidah', parent_id: 'c-k8', urutan: 2 },
  { id: 'c-k8-akhlak', nama: 'Akhlak', parent_id: 'c-k8', urutan: 3 },
  { id: 'c-k8-fikih', nama: 'Fikih', parent_id: 'c-k8', urutan: 4 },
  { id: 'c-k8-ski', nama: 'Sejarah Kebudayaan Islam (SKI)', parent_id: 'c-k8', urutan: 5 },

  // Level 2: 5 Elemen PAI Kelas 9
  { id: 'c-k9-qurhad', nama: 'Al-Qur\'an dan Hadis', parent_id: 'c-k9', urutan: 1 },
  { id: 'c-k9-akidah', nama: 'Akidah', parent_id: 'c-k9', urutan: 2 },
  { id: 'c-k9-akhlak', nama: 'Akhlak', parent_id: 'c-k9', urutan: 3 },
  { id: 'c-k9-fikih', nama: 'Fikih', parent_id: 'c-k9', urutan: 4 },
  { id: 'c-k9-ski', nama: 'Sejarah Kebudayaan Islam (SKI)', parent_id: 'c-k9', urutan: 5 },
];

export const initialMateri: MateriPAI[] = [
  {
    id: 'm-1',
    judul: 'Kedudukan Al-Qur\'an dan Sunnah sebagai Sumber Hukum Islam (Kajian Q.S. An-Nisa: 59)',
    slug: 'kedudukan-alquran-dan-sunnah-sumber-hukum-an-nisa-59',
    deskripsi_singkat: 'Kajian mendalam tentang kewajiban menaati Allah, Rasul, dan Ulil Amri serta peran Al-Qur\'an dan Hadis sebagai pedoman hidup peserta didik Fase D.',
    konten: `# Kedudukan Al-Qur'an dan Sunnah sebagai Pedoman Hidup

Allah SWT berfirman dalam Al-Qur'an Surah An-Nisa' ayat 59:

> *"Wahai orang-orang yang beriman! Taatilah Allah dan taatilah Rasul (Muhammad), dan Ulil Amri (pemegang kekuasaan) di antara kamu. Kemudian, jika kamu berlainan pendapat tentang sesuatu, maka kembalikanlah ia kepada Allah (Al-Qur'an) dan Rasul (Sunnahnya), jika kamu benar-benar beriman kepada Allah dan hari kemudian. Yang demikian itu lebih utama (bagimu) dan lebih baik akibatnya."* (Q.S. An-Nisa' [4]: 59)

## 1. Pokok Kandungan Ayat
- **Ketaatan Mutlak**: Ketaatan kepada Allah SWT dan Rasulullah SAW bersifat mutlak tanpa syarat.
- **Ketaatan Bersyarat**: Ketaatan kepada ulil amri (pemimpin, guru, orang tua) selama tidak memerintahkan maksiat.
- **Penyelesaian Masalah**: Mengembalikan segala perselisihan pada tuntunan Al-Qur'an dan Sunnah shahihah.

## 2. Refleksi dalam Keseharian Siswa
1. Menjadikan Al-Qur'an sebagai bacaan rutin harian.
2. Mencontoh akhlak Rasulullah SAW dalam pergaulan di sekolah dan rumah.
3. Menghormati guru dan mentaati tata tertib sekolah dengan penuh kesadaran.`,
    gambar_cover_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    kategori_id: 'c-k7-qurhad',
    status: 'published',
    view_count: 480,
    created_at: '2024-05-10T08:00:00.000Z',
    updated_at: '2024-05-10T08:00:00.000Z',
    kategori: {
      id: 'c-k7-qurhad',
      nama: 'Al-Qur\'an dan Hadis',
      parent_id: 'c-k7',
      urutan: 1,
    },
    tags: [
      { id: 'tag-1', nama: 'Al-Qur\'an Hadis', slug: 'al-quran-hadis' },
      { id: 'tag-6', nama: 'Kurikulum Merdeka', slug: 'kurikulum-merdeka' },
      { id: 'tag-7', nama: 'Fase D (SMP)', slug: 'fase-d' },
    ],
    files: [
      {
        id: 'f-1',
        materi_id: 'm-1',
        nama_file: 'Modul_Ajar_PAI_Kelas7_AlQuran_Hadis_FaseD.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'pdf',
        ukuran_bytes: 2450000,
      },
      {
        id: 'f-2',
        materi_id: 'm-1',
        nama_file: 'LKPD_Analisis_Surah_AnNisa_59.docx',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'word',
        ukuran_bytes: 1120000,
      },
    ],
  },
  {
    id: 'm-2',
    judul: 'Meneladani Asmaul Husna dalam Keseharian: Al-\'Alim, Al-Khabir, As-Sami\', dan Al-Bashir',
    slug: 'meneladani-asmaul-husna-al-alim-al-khabir-as-sami-al-bashir',
    deskripsi_singkat: 'Memahami hakikat empat Asmaul Husna pilihan dan bagaimana menumbuhkan sifat jujur, cermat, serta berakhlak mulia di bawah pengawasan Allah.',
    konten: `# Meneladani Asmaul Husna (Al-'Alim, Al-Khabir, As-Sami', Al-Bashir)

Mengenal Allah SWT melalui nama-nama-Nya yang agung adalah landasan utama pembentukan karakter (*akhlakul karimah*) peserta didik.

## 4 Asmaul Husna dan Maknanya:
- **Al-'Alim (Yang Maha Mengetahui)**: Mengetahui segala yang tampak dan tersembunyi.
- **Al-Khabir (Yang Maha Teliti/Waspada)**: Mengetahui hingga ke rincian terdalam setiap perkara.
- **As-Sami' (Yang Maha Mendengar)**: Mendengar segala suara, rintihan, dan doa hamba-Nya.
- **Al-Bashir (Yang Maha Melihat)**: Melihat setiap gerak-gerik perbuatan manusia di manapun berada.`,
    gambar_cover_url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
    kategori_id: 'c-k7-akidah',
    status: 'published',
    view_count: 365,
    created_at: '2024-04-20T08:00:00.000Z',
    updated_at: '2024-04-20T08:00:00.000Z',
    kategori: {
      id: 'c-k7-akidah',
      nama: 'Akidah',
      parent_id: 'c-k7',
      urutan: 2,
    },
    tags: [
      { id: 'tag-2', nama: 'Akidah', slug: 'akidah' },
      { id: 'tag-8', nama: 'Asmaul Husna', slug: 'asmaul-husna' },
      { id: 'tag-7', nama: 'Fase D (SMP)', slug: 'fase-d' },
    ],
    files: [
      {
        id: 'f-3',
        materi_id: 'm-2',
        nama_file: 'Bahan_Ajar_Asmaul_Husna_Kelas7.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'pdf',
        ukuran_bytes: 1840000,
      },
    ],
  },
  {
    id: 'm-3',
    judul: 'Tata Cara dan Hikmah Sujud Sahwi, Sujud Tilawah, dan Sujud Syukur',
    slug: 'panduan-sujud-sahwi-tilawah-syukur-kelas-7',
    deskripsi_singkat: 'Panduan fikih praktis bersuci dan sujud di luar rukun salat biasa, lengkap dengan bacaan doa, syarat sah, serta sebab-sebab disyariatkannya.',
    konten: `# Panduan Lengkap Sujud Sahwi, Tilawah, dan Syukur

Sujud merupakan simbol kepasrahan tertinggi seorang hamba kepada Sang Pencipta.`,
    gambar_cover_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    kategori_id: 'c-k7-fikih',
    status: 'published',
    view_count: 512,
    created_at: '2024-03-15T08:00:00.000Z',
    updated_at: '2024-03-15T08:00:00.000Z',
    kategori: {
      id: 'c-k7-fikih',
      nama: 'Fikih',
      parent_id: 'c-k7',
      urutan: 4,
    },
    tags: [
      { id: 'tag-4', nama: 'Fikih Ibadah', slug: 'fikih-ibadah' },
      { id: 'tag-7', nama: 'Fase D (SMP)', slug: 'fase-d' },
    ],
    files: [
      {
        id: 'f-4',
        materi_id: 'm-3',
        nama_file: 'Lembar_Praktik_Ibadah_Sujud_Kelas7.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'pdf',
        ukuran_bytes: 1420000,
      },
    ],
  },
];

export const initialSertifikasi: Sertifikasi[] = [
  {
    id: 'cert-1',
    judul: 'Pendidik Tersertifikasi Google Level 1 (Google Certified Educator)',
    penerbit: 'Google for Education',
    nomor_sertifikat: '190209183',
    link_verifikasi: 'https://edu.google.accredible.com/3b93bf05-d429-4551-a346-cb902662dde2#acc.3W0LKH4w',
    badge_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/190209183',
    certificate_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/190209183',
    accredible_id: '190209183',
    tahun: 2024,
    kategori: 'Google for Education',
    urutan: 1,
    is_featured: true,
  },
  {
    id: 'cert-2',
    judul: 'Gemini Certified Educator',
    penerbit: 'Google for Education',
    nomor_sertifikat: '191245638',
    link_verifikasi: 'https://edu.google.accredible.com/3c820304-65ab-43ac-90cb-2454a07e4d60#acc.v8rpD23n',
    badge_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/191245638',
    certificate_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/191245638',
    accredible_id: '191245638',
    tahun: 2024,
    kategori: 'Google AI in Education',
    urutan: 2,
    is_featured: true,
  },
  {
    id: 'cert-3',
    judul: 'Gemini Certified Faculty',
    penerbit: 'Google for Education',
    nomor_sertifikat: '164938512',
    link_verifikasi: 'https://edu.google.accredible.com/e92fc936-6ead-4f74-886a-b15544a63db2#acc.eRFcEt2i',
    badge_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/164938512',
    certificate_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/164938512',
    accredible_id: '164938512',
    tahun: 2024,
    kategori: 'Google AI in Education',
    urutan: 3,
    is_featured: true,
  },
];

export const initialRiwayat: Riwayat[] = [
  // Pendidikan
  {
    id: 'rw-1',
    judul: 'Sarjana Pendidikan Agama Islam (S.Pd)',
    instansi_organisasi: 'Institut Agama Islam (IAI) Ibrahimy Genteng / Fakultas Tarbiyah',
    jenis: 'pendidikan',
    tahun_mulai: 2014,
    tahun_selesai: 2018,
    deskripsi: 'Lulus dengan fokus kajian metodologi pengajaran fikih dan integrasi literasi kitab kuning dalam pendidikan madrasah/sekolah.',
    urutan: 1,
    is_featured: true,
  },
  {
    id: 'rw-2',
    judul: 'Program Pendidikan Profesi Guru (PPG) PAI',
    instansi_organisasi: 'Kementerian Agama RI & LPTK Terakreditasi',
    jenis: 'pendidikan',
    tahun_mulai: 2022,
    tahun_selesai: 2023,
    deskripsi: 'Memperoleh Sertifikat Pendidik Profesional Guru (Gr.) bidang Pendidikan Agama Islam dengan predikat sangat memuaskan.',
    urutan: 2,
    is_featured: true,
  },
  // Organisasi
  {
    id: 'rw-3',
    judul: 'Pengurus Musyawarah Guru Mata Pelajaran (MGMP) PAI SMP',
    instansi_organisasi: 'MGMP PAI SMP Kabupaten Banyuwangi',
    jenis: 'organisasi',
    tahun_mulai: 2020,
    tahun_selesai: null,
    deskripsi: 'Aktif dalam pengembangan perangkat Kurikulum Merdeka (Fase D), pembuatan modul ajar digital, dan bank soal terstandar.',
    urutan: 3,
    is_featured: true,
  },
  {
    id: 'rw-4',
    judul: 'Anggota Asosiasi Guru Pendidikan Agama Islam Indonesia (AGPAII)',
    instansi_organisasi: 'DPD AGPAII Kabupaten Banyuwangi',
    jenis: 'organisasi',
    tahun_mulai: 2019,
    tahun_selesai: null,
    deskripsi: 'Berpartisipasi aktif dalam forum riset pendidikan keagamaan islam dan seminar nasional penguatan moderasi beragama.',
    urutan: 4,
    is_featured: true,
  },
  // Pengalaman
  {
    id: 'rw-5',
    judul: 'Guru Pendidikan Agama Islam & Budi Pekerti (Fase D)',
    instansi_organisasi: 'SMP Negeri 2 Glagah Banyuwangi',
    jenis: 'pengalaman',
    tahun_mulai: 2019,
    tahun_selesai: null,
    deskripsi: 'Mengampu mata pelajaran PAI Kelas 7, 8, dan 9, membimbing ekstrakurikuler kajian kitab kuning & tahsin Al-Qur\'an, serta mengintegrasikan Google Workspace for Education.',
    urutan: 5,
    is_featured: true,
  },
  {
    id: 'rw-6',
    judul: 'Content Creator & Edukator Pembelajaran Digital',
    instansi_organisasi: 'Channel YouTube Zona Belajar ID',
    jenis: 'pengalaman',
    tahun_mulai: 2021,
    tahun_selesai: null,
    deskripsi: 'Memproduksi materi video edukasi visual, pembahasan soal OSN/OSNK, dan kajian sejarah peradaban Islam.',
    urutan: 6,
    is_featured: true,
  },
  // Sertifikasi (Sync dengan Accredible)
  {
    id: 'rw-7',
    judul: 'Pendidik Tersertifikasi Google Level 1 (Google Certified Educator)',
    instansi_organisasi: 'Google for Education',
    jenis: 'sertifikasi',
    tahun_mulai: 2024,
    tahun_selesai: 2027,
    deskripsi: 'Kredensial internasional kompetensi penerapan Google Classroom, Docs, Slides, Forms, dan Sites dalam pembelajaran inovatif.',
    link_verifikasi: 'https://edu.google.accredible.com/3b93bf05-d429-4551-a346-cb902662dde2#acc.3W0LKH4w',
    badge_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/190209183',
    certificate_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/190209183',
    accredible_id: '190209183',
    urutan: 7,
    is_featured: true,
  },
  {
    id: 'rw-8',
    judul: 'Gemini Certified Educator',
    instansi_organisasi: 'Google for Education',
    jenis: 'sertifikasi',
    tahun_mulai: 2024,
    tahun_selesai: 2027,
    deskripsi: 'Pengakuan internasional dalam pemanfaatan Gemini AI untuk diferensiasi pembelajaran, pembuatan bahan ajar, dan efisiensi pedagogik.',
    link_verifikasi: 'https://edu.google.accredible.com/3c820304-65ab-43ac-90cb-2454a07e4d60#acc.v8rpD23n',
    badge_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/191245638',
    certificate_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/191245638',
    accredible_id: '191245638',
    urutan: 8,
    is_featured: true,
  },
  {
    id: 'rw-9',
    judul: 'Gemini Certified Faculty',
    instansi_organisasi: 'Google for Education',
    jenis: 'sertifikasi',
    tahun_mulai: 2024,
    tahun_selesai: 2027,
    deskripsi: 'Kredensial tingkat pengajar institusional dalam memimpin integrasi Artificial Intelligence (AI) etis di lingkungan akademik.',
    link_verifikasi: 'https://edu.google.accredible.com/e92fc936-6ead-4f74-886a-b15544a63db2#acc.eRFcEt2i',
    badge_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/164938512',
    certificate_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/164938512',
    accredible_id: '164938512',
    urutan: 9,
    is_featured: true,
  },
];

export const initialTestimoni: Testimoni[] = [
  {
    id: 'tst-1',
    nama: 'Ahmad Fauzi, M.Pd.',
    peran_instansi: 'Ketua MGMP PAI SMP Kab. Banyuwangi',
    konten: 'Pak Aji adalah sosok guru inspiratif yang berhasil mendigitalisasi pembelajaran PAI. Modul ajar dan materi interaktif yang beliau rancang sangat membantu rekan guru di MGMP.',
    status: 'approved',
    rating: 5,
    urutan: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tst-2',
    nama: 'Nabila Az-Zahra',
    peran_instansi: 'Alumni Siswa SMPN 2 Glagah',
    konten: 'Belajar materi fikih dan sejarah Islam bersama Pak Aji jadi sangat menyenangkan karena selalu ada animasi, kuis Canva interaktif, dan slide yang mudah dipahami.',
    status: 'approved',
    rating: 5,
    urutan: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tst-3',
    nama: 'Ustadz Muhammad Ridwan',
    peran_instansi: 'Pengasuh Majlis Taklim & Peneliti Naskah',
    konten: 'Akurasi terjemahan kitab Matan Abu Syuja\' yang disusun Pak Aji sangat teliti, dilengkapi ta\'liq dalil yang kontekstual bagi generasi muda.',
    status: 'approved',
    rating: 5,
    urutan: 3,
    created_at: new Date().toISOString(),
  },
];

export const initialFAQ: FAQ[] = [
  {
    id: 'faq-1',
    pertanyaan: 'Apakah semua modul ajar dan slide PAI di website ini gratis untuk diunduh?',
    jawaban: 'Ya, seluruh modul ajar Kurikulum Merdeka (Fase D), LKPD, lembar kerja, dan slide presentasi Google Slides/Canva dapat diunduh dan digunakan secara bebas dan gratis untuk keperluan pembelajaran di sekolah maupun madrasah.',
    kategori: 'Materi & Unduhan',
    urutan: 1,
    is_active: true,
  },
  {
    id: 'faq-2',
    pertanyaan: 'Bagaimana cara membuka dokumen Google Drive atau OneDrive yang dilampirkan?',
    jawaban: 'Anda cukup mengklik tombol "Pratinjau Dokumen / Baca Online" pada setiap file lampiran artikel. Dokumen akan langsung terbuka dalam penampil dokumen interaktif (embed viewer) tanpa perlu keluar dari website.',
    kategori: 'Teknis & Akses',
    urutan: 2,
    is_active: true,
  },
  {
    id: 'faq-3',
    pertanyaan: 'Apakah Pak Aji bersedia menjadi narasumber pelatihan guru atau workshop digitalisasi PAI?',
    jawaban: 'Tentu. Anda dapat menghubungi saya melalui formulir kontak di bagian bawah website ini atau melalui nomor WhatsApp resmi yang tertera untuk mendiskusikan agenda seminar/workshop.',
    kategori: 'Kolaborasi & Undangan',
    urutan: 3,
    is_active: true,
  },
  {
    id: 'faq-4',
    pertanyaan: 'Bagaimana cara memverifikasi sertifikasi resmi Google for Education Pak Aji?',
    jawaban: 'Setiap sertifikasi dilengkapi tautan verifikasi resmi ke platform global Accredible Google. Klik tombol "Verifikasi di Accredible" pada section Sertifikasi untuk melihat rincian tanggal penerbitan dan nomor ID sertifikat asli.',
    kategori: 'Kredensial',
    urutan: 4,
    is_active: true,
  },
];

export const initialKomentar: Komentar[] = [
  {
    id: 'kom-1',
    materi_id: 'm-1',
    nama: 'H. Syamsul Huda',
    email: 'syamsul@gmail.com',
    konten: 'Penjelasan yang sangat padat dan runtut mengenai Surah An-Nisa ayat 59. Sangat cocok dijadikan bahan ajar pengantar di awal semester.',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
  {
    id: 'kom-2',
    materi_id: 'm-2',
    nama: 'Rina Wahyuni, S.Ag',
    email: 'rina@sekolah.sch.id',
    konten: 'Terima kasih atas LKPD Asmaul Husna-nya Pak Aji, anak-anak di kelas sangat antusias saat praktik mengidentifikasi contoh perilaku Al-Bashir.',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
];

export const initialSubscribers: Subscriber[] = [
  { id: 'sub-1', email: 'guru.inovatif@gmail.com', created_at: new Date().toISOString() },
  { id: 'sub-2', email: 'belajar.pai@smpn.sch.id', created_at: new Date().toISOString() },
];

export const initialTerjemahan: ProyekTerjemahan[] = [
  {
    id: 't-1',
    judul: 'Terjemahan & Syarah Matan Al-Ghayah wa At-Taqrib (Matan Abi Syuja\')',
    slug: 'terjemahan-matan-abi-syuja',
    bahasa_asal: 'Bahasa Arab',
    bahasa_tujuan: 'Bahasa Indonesia',
    deskripsi: 'Terjemahan naskah fikih madzhab Syafi\'i ringkas, dilengkapi ta\'liq (catatan kaki penjelas), dalil-dalil Al-Qur\'an dan As-Sunnah, serta bagan visual pembagian hukum syariat.',
    link_file: 'https://drive.google.com',
    tahun: 2023,
    urutan: 1,
  },
  {
    id: 't-2',
    judul: 'Terjemahan Kitab Ta\'limul Muta\'allim Thariqat Ta\'allum (Imam Az-Zarnuji)',
    slug: 'terjemahan-talimul-mutaallim',
    bahasa_asal: 'Bahasa Arab',
    bahasa_tujuan: 'Bahasa Indonesia',
    deskripsi: 'Pedoman etika dan adab menuntut ilmu bagi santri dan pelajar muslim, dilengkapi kontekstualisasi adab belajar di era digital modern.',
    link_file: 'https://drive.google.com',
    tahun: 2024,
    urutan: 2,
  },
  {
    id: 't-3',
    judul: 'Terjemahan Kitab Al-Arba\'in An-Nawawiyyah (Hadits 1 - 42)',
    slug: 'terjemahan-arbain-nawawi',
    bahasa_asal: 'Bahasa Arab',
    bahasa_tujuan: 'Bahasa Indonesia',
    deskripsi: 'Kumpulan 42 hadis pokok pilar ajaran Islam karya Imam An-Nawawi, dilengkapi faedah hukum dan penerapannya dalam kehidupan sehari-hari.',
    link_file: 'https://drive.google.com',
    tahun: 2024,
    urutan: 3,
  },
];

export const initialKarya: Karya[] = [
  {
    id: 'k-1',
    judul: 'Infografis Serial Fikih Thaharah: Wudhu, Tayammum, & Mandi Wajib',
    slug: 'infografis-serial-fikih-thaharah',
    deskripsi: 'Seri infografis visual beresolusi tinggi yang merangkum rukun, sunnah, syarat sah, dan hal-hal yang membatalkan thaharah.',
    gambar_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://canva.com',
    kategori: 'Infografis',
    tahun: 2024,
    urutan: 1,
  },
  {
    id: 'k-2',
    judul: 'E-Book Ringkasan Ushul Fiqih untuk Pelajar SMP/MTs & SMA',
    slug: 'ebook-ringkasan-ushul-fiqih',
    deskripsi: 'Buku saku digital yang memuat kaidah-kaidah dasar ushul fiqih, dalil muthafaq, mukhtalaf, dan contoh kasus kontemporer.',
    gambar_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://play.google.com/books',
    kategori: 'E-Book',
    tahun: 2024,
    urutan: 2,
  },
  {
    id: 'k-3',
    judul: 'Modul Pembelajaran Interaktif Kurikulum Merdeka Fase D (Canva & Google Slides)',
    slug: 'modul-pembelajaran-interaktif-fase-d',
    deskripsi: 'Kumpulan lembar kerja, asesmen formatif-sumatif, dan rubrik penilaian berbasis profil pelajar Pancasila Rahmatan lil \'Alamin.',
    gambar_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://guru.kemdikbud.go.id',
    kategori: 'Modul Ajar',
    tahun: 2024,
    urutan: 3,
  },
  {
    id: 'k-4',
    judul: 'Seri Video Animasi 2D: Kisah Teladan Khulafaur Rasyidin',
    slug: 'video-animasi-khulafaur-rasyidin',
    deskripsi: 'Video edukasi bertema sejarah peradaban Islam yang dirancang untuk meningkatkan antusiasme siswa di kelas.',
    gambar_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://youtube.com',
    kategori: 'Video Animasi',
    tahun: 2023,
    urutan: 4,
  },
];

export const initialYouTubeVideos: YouTubeVideo[] = [
  {
    id: 'y-1',
    title: 'OSNK-K 2026 | SMP | 20525649 | SMP NEGERI 2 GLAGAH | IPS',
    video_id: 'jxwfYMReHYY',
    thumbnail_url: 'https://img.youtube.com/vi/jxwfYMReHYY/maxresdefault.jpg',
    published_at: '2026-06-11',
    urutan: 1,
    is_featured: true,
  },
  {
    id: 'y-2',
    title: 'OSNK-K 2026 | SMP | 20525649 | SMP NEGERI 2 GLAGAH | IPA',
    video_id: 'pzwH90zsfDY',
    thumbnail_url: 'https://img.youtube.com/vi/pzwH90zsfDY/maxresdefault.jpg',
    published_at: '2026-06-11',
    urutan: 2,
    is_featured: true,
  },
  {
    id: 'y-3',
    title: 'OSNK-K 2026 | SMP | 20525649 | SMP NEGERI 2 GLAGAH | MATEMATIKA',
    video_id: 'NROXB_6G7q4',
    thumbnail_url: 'https://img.youtube.com/vi/NROXB_6G7q4/maxresdefault.jpg',
    published_at: '2026-06-11',
    urutan: 3,
    is_featured: true,
  },
  {
    id: 'y-4',
    title: 'Mengenal Akar Bangsa Arab: Geografi & Silsilah Keturunan Sebelum Islam (LIVE)',
    video_id: 'L7484KKXWU0',
    thumbnail_url: 'https://img.youtube.com/vi/L7484KKXWU0/maxresdefault.jpg',
    published_at: '2026-03-01',
    urutan: 4,
    is_featured: true,
  },
];
