import { Profile, SectionItem, KategoriMateri, MateriPAI, ProyekTerjemahan, Karya, YouTubeVideo, Sertifikasi } from '../types/database';

export const initialProfile: Profile = {
  id: 'a0000000-0000-0000-0000-000000000001',
  nama: 'Aji Bagus Khoiri',
  tagline: 'Pendidik Agama Islam, Google Certified Educator & Penerjemah Kitab Turats',
  bio: 'Mengabdi dalam dunia pendidikan Islam dengan memadukan khazanah keilmuan klasik (turats) dan pendekatan pedagogis modern abad 21 berbasis Google for Education. Berpengalaman sebagai guru PAI, penerjemah kitab berbahasa Arab, dan perancang materi ajar digital interaktif.',
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
  { id: 's-3', key: 'materi', label: 'Materi & Modul PAI Terbaru', urutan: 3, is_active: true },
  { id: 's-4', key: 'youtube', label: 'Channel & Video YouTube Edukasi', urutan: 4, is_active: true },
  { id: 's-5', key: 'terjemahan', label: 'Proyek Terjemahan Kitab & Buku', urutan: 5, is_active: true },
  { id: 's-6', key: 'karya', label: 'Galeri Karya & Publikasi Digital', urutan: 6, is_active: true },
  { id: 's-7', key: 'kontak', label: 'Kontak & Kolaborasi', urutan: 7, is_active: true },
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
Secara bahasa, **Fastabiqul Khairat** berakar dari kata *sabaqa* yang berarti mendahului atau berlomba, dan *al-khairat* yang merupakan bentuk jamak dari *khair* (kebaikan).

## 2. Implementasi dalam Pembelajaran
1. Membiasakan disiplin waktu dalam menuntut ilmu.
2. Saling membantu dalam memahami materi pelajaran tanpa pamrih.
3. Menjaga adab terhadap guru dan sesama penuntut ilmu.

Silakan unduh modul ajar dan lembar kerja peserta didik (LKPD) pada lampiran di bawah.`,
    gambar_cover_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    kategori_id: 'c3-1',
    status: 'published',
    view_count: 428,
    created_at: '2024-05-10T08:00:00.000Z',
    updated_at: '2024-05-10T08:00:00.000Z',
    kategori: {
      id: 'c3-1',
      nama: 'Tafsir Q.S. Al-Ma\'idah: 48',
      parent_id: 'c2-1',
      urutan: 1,
    },
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
        nama_file: 'Slide_Presentasi_Tafsir_Al_Maidah_48.pptx',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'ppt',
        ukuran_bytes: 5820000,
      },
    ],
  },
  {
    id: 'm-2',
    judul: 'Menelaah 77 Cabang Iman (Syu\'abul Iman) Berdasarkan Hadits Shahih',
    slug: 'menelaah-77-cabang-iman-syuabul-iman-hadits-shahih',
    deskripsi_singkat: 'Penjelasan komprehensif mengenai dimensi keimanan: pembenaran hati, lisan, dan amal perbuatan dalam kehidupan muslim.',
    konten: `# Menelaah 77 Cabang Iman (Syu'abul Iman)

Rasulullah SAW bersabda:
> *"Iman itu memiliki tujuh puluh lebih cabang. Yang paling utama adalah ucapan Laa Ilaaha Illallaah, dan yang paling rendah adalah menyingkirkan duri dari jalan. Dan malu adalah sebagian dari iman."* (HR. Muslim)

## Pilar Utama Iman:
- **Ma'rifatun bil Qalb**: Mengenal Allah dan rukun iman dengan keyakinan kokoh.
- **Iqrarun bil Lisan**: Mengucapkan syahadat, dzikir, dan kalam yang bermanfaat.
- **'Amalun bil Arkan**: Mengamalkan syariat dalam perilaku nyata.`,
    gambar_cover_url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
    kategori_id: 'c3-2',
    status: 'published',
    view_count: 312,
    created_at: '2024-04-20T08:00:00.000Z',
    updated_at: '2024-04-20T08:00:00.000Z',
    kategori: {
      id: 'c3-2',
      nama: 'Syu\'abul Iman',
      parent_id: 'c2-2',
      urutan: 2,
    },
    files: [
      {
        id: 'f-3',
        materi_id: 'm-2',
        nama_file: 'LKPD_Syuabul_Iman_Kelas_X.docx',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'word',
        ukuran_bytes: 1240000,
      },
    ],
  },
];

export const initialSertifikasi: Sertifikasi[] = [
  {
    id: 'cert-1',
    judul: 'Google Certified Educator Level 1',
    penerbit: 'Google for Education',
    nomor_sertifikat: 'GCE-L1-2024',
    link_verifikasi: 'https://educertifications.google/',
    badge_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    tahun: 2024,
    kategori: 'Google for Education',
    urutan: 1,
    is_featured: true,
  },
  {
    id: 'cert-2',
    judul: 'Google Certified Educator Level 2',
    penerbit: 'Google for Education',
    nomor_sertifikat: 'GCE-L2-2024',
    link_verifikasi: 'https://educertifications.google/',
    badge_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    tahun: 2024,
    kategori: 'Google for Education',
    urutan: 2,
    is_featured: true,
  },
  {
    id: 'cert-3',
    judul: 'Sertifikat Pendidik Profesional (Gr.) Bidang PAI',
    penerbit: 'Kementerian Agama & Kemendikbudristek RI',
    nomor_sertifikat: 'KEMENAG-PAI-SERTIFIKASI',
    link_verifikasi: 'https://simpatika.kemenag.go.id',
    badge_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80',
    tahun: 2023,
    kategori: 'Pendidikan Profesi Guru',
    urutan: 3,
    is_featured: true,
  },
  {
    id: 'cert-4',
    judul: 'Google Certified Trainer',
    penerbit: 'Google for Education',
    nomor_sertifikat: 'GCT-TRAINER-ID',
    link_verifikasi: 'https://educertifications.google/',
    badge_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    tahun: 2025,
    kategori: 'Google for Education',
    urutan: 4,
    is_featured: true,
  },
];

export const initialTerjemahan: ProyekTerjemahan[] = [
  {
    id: 't-1',
    judul: 'Terjemahan & Syarah Matan Al-Ghayah wa At-Taqrib (Matan Abi Syuja\')',
    bahasa_asal: 'Bahasa Arab',
    bahasa_tujuan: 'Bahasa Indonesia',
    deskripsi: 'Terjemahan naskah fikih madzhab Syafi\'i ringkas, dilengkapi ta\'liq (catatan kaki penjelas), dalil-dalil Al-Qur\'an dan As-Sunnah, serta bagan visual pembagian hukum syariat.',
    link_file: 'https://archive.org',
    tahun: 2024,
    urutan: 1,
  },
  {
    id: 't-2',
    judul: 'Anotasi Terjemah Bidayatul Hidayah karya Imam Al-Ghazali',
    bahasa_asal: 'Bahasa Arab',
    bahasa_tujuan: 'Bahasa Indonesia',
    deskripsi: 'Panduan adab harian penuntut ilmu, tata cara ibadah lahir batin, dan etika pergaulan yang diselaraskan dengan kebutuhan remaja dan pelajar masa kini.',
    link_file: 'https://archive.org',
    tahun: 2023,
    urutan: 2,
  },
  {
    id: 't-3',
    judul: 'Terjemah Ta\'limul Muta\'allim Thariqat Ta\'allum (Syaikh Az-Zarnuji)',
    bahasa_asal: 'Bahasa Arab',
    bahasa_tujuan: 'Bahasa Indonesia',
    deskripsi: 'Kitab rujukan adab penuntut ilmu dengan ulasan kontekstual mengenai manajemen waktu belajar, niat, pemilihan guru, dan etika bersahabat.',
    link_file: 'https://archive.org',
    tahun: 2022,
    urutan: 3,
  },
];

export const initialKarya: Karya[] = [
  {
    id: 'k-1',
    judul: 'Infografis Alur Pensyariatan Ibadah Shalat & Wudhu Sesuai Sunnah',
    deskripsi: 'Desain visual beresolusi tinggi yang merangkum rukun, syarat sah, dan hal-hal yang membatalkan ibadah secara terstruktur.',
    gambar_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://behance.net',
    kategori: 'Infografis',
    urutan: 1,
  },
  {
    id: 'k-2',
    judul: 'E-Book Ringkasan Ushul Fiqih untuk Tingkat Madrasah Aliyah & SMA',
    deskripsi: 'Buku saku digital yang memuat kaidah-kaidah dasar ushul fiqih, dalil muthafaq, mukhtalaf, dan contoh kasus kontemporer.',
    gambar_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://play.google.com/books',
    kategori: 'E-Book',
    urutan: 2,
  },
  {
    id: 'k-3',
    judul: 'Modul Pembelajaran Interaktif Kurikulum Merdeka Fase E & F',
    deskripsi: 'Kumpulan lembar kerja, asesmen formatif-sumatif, dan rubrik penilaian berbasis profil pelajar Pancasila Rahmatan lil \'Alamin.',
    gambar_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://guru.kemdikbud.go.id',
    kategori: 'Modul Ajar',
    urutan: 3,
  },
  {
    id: 'k-4',
    judul: 'Seri Video Animasi 2D: Kisah Teladan Khulafaur Rasyidin',
    deskripsi: 'Video edukasi bertema sejarah peradaban Islam yang dirancang untuk meningkatkan antusiasme siswa di kelas.',
    gambar_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    link_eksternal: 'https://youtube.com',
    kategori: 'Video Animasi',
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
