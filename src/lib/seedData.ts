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
- **Al-Bashir (Yang Maha Melihat)**: Melihat setiap gerak-gerik perbuatan manusia di manapun berada.

## Sikap yang Harus Dimiliki:
1. Semangat belajar tiada henti (meneladani *Al-'Alim*).
2. Teliti dan cermat dalam menyelesaikan tugas (meneladani *Al-Khabir*).
3. Menjaga lisan dari perkataan kotor dan ghibah (menyadari sifat *As-Sami'*).
4. Menjauhi perbuatan dosa meskipun dalam keadaan sunyi (menyadari sifat *Al-Bashir*).`,
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

Sujud merupakan simbol kepasrahan tertinggi seorang hamba kepada Sang Pencipta.

## 1. Sujud Sahwi
Dilakukan ketika lupa atau ragu-ragu dalam bilangan rakaat salat, atau meninggalkan sunnah ab'adh. Dilakukan 2 kali sujud sebelum atau sesudah salam.

## 2. Sujud Tilawah
Dilakukan ketika mendengar atau membaca ayat-ayat sajdah dalam Al-Qur'an.

## 3. Sujud Syukur
Dilakukan spontan ketika mendapatkan kenikmatan besar atau terhindar dari marabahaya. Dilakukan di luar salat dengan 1 kali sujud.`,
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
  {
    id: 'm-4',
    judul: 'Membangun Kepedulian Sosial Melalui Zakat, Infak, dan Sedekah (Kelas 8)',
    slug: 'fikih-zakat-infak-sedekah-kelas-8-smp',
    deskripsi_singkat: 'Kajian fikih muamalah dan ibadah maliyah: perbedaan zakat fitrah, zakat mal, infak, sedekah, serta dampaknya bagi keadilan sosial.',
    konten: `# Fikih Zakat, Infak, dan Sedekah (Kelas 8 Fase D)

Islam mengajarkan keseimbangan antara hubungan vertikal kepada Allah (*Hablum minallah*) dan hubungan horizontal kepada sesama manusia (*Hablum minannas*).

## Pembeda Utama:
- **Zakat**: Wajib dengan nisab, haul, dan kadar tertentu (misal zakat fitrah & zakat emas/perdagangan).
- **Infak**: Mengeluarkan sebagian harta untuk kemaslahatan umum tanpa batasan nisab.
- **Sedekah**: Amal kebaikan mencakup materi maupun non-materi (senyuman, pertolongan, ilmu yang bermanfaat).`,
    gambar_cover_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    kategori_id: 'c-k8-fikih',
    status: 'published',
    view_count: 410,
    created_at: '2024-02-18T08:00:00.000Z',
    updated_at: '2024-02-18T08:00:00.000Z',
    kategori: {
      id: 'c-k8-fikih',
      nama: 'Fikih',
      parent_id: 'c-k8',
      urutan: 4,
    },
    files: [
      {
        id: 'f-5',
        materi_id: 'm-4',
        nama_file: 'Modul_Ajar_PAI_Zakat_Infak_Sedekah_Kelas8.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'pdf',
        ukuran_bytes: 2980000,
      },
    ],
  },
  {
    id: 'm-5',
    judul: 'Meneladani Jejak Keemasan Daulah Abbasiyah: Baitul Hikmah dan Perkembangan Sains Islam (Kelas 8)',
    slug: 'jejak-keemasan-daulah-abbasiyah-baitul-hikmah',
    deskripsi_singkat: 'Menelusuri sejarah peradaban Islam di Baghdad, berdirinya perpustakaan dan pusat riset Baitul Hikmah, serta kontribusi para ilmuwan muslim terkemuka.',
    konten: `# Jejak Emas Daulah Abbasiyah di Baghdad

Masa pemerintahan Khalifah Harun Ar-Rasyid dan Al-Ma'mun menandai era keemasan (*The Golden Age of Islam*).

## Prestasi Peradaban:
1. **Baitul Hikmah**: Pusat penerjemahan karya-karya filsafat dan sains dunia ke dalam bahasa Arab.
2. **Ilmuwan Besar**:
   - **Al-Khawarizmi**: Penemu Aljabar dan angka nol.
   - **Ibnu Sina (Avicenna)**: Bapak kedokteran modern (*Al-Qanun fi at-Tibb*).
   - **Al-Kindi**: Filsuf muslim pertama.
3. **Inspirasi untuk Peserta Didik**: Menumbuhkan rasa percaya diri bahwa umat Islam memiliki warisan keilmuan dan literasi sains yang luar biasa.`,
    gambar_cover_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    kategori_id: 'c-k8-ski',
    status: 'published',
    view_count: 530,
    created_at: '2024-01-25T08:00:00.000Z',
    updated_at: '2024-01-25T08:00:00.000Z',
    kategori: {
      id: 'c-k8-ski',
      nama: 'Sejarah Kebudayaan Islam (SKI)',
      parent_id: 'c-k8',
      urutan: 5,
    },
    files: [
      {
        id: 'f-6',
        materi_id: 'm-5',
        nama_file: 'Slide_Presentasi_Daulah_Abbasiyah_Kelas8.pptx',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'ppt',
        ukuran_bytes: 4500000,
      },
    ],
  },
  {
    id: 'm-6',
    judul: 'Menjunjung Tinggi Toleransi dan Menghargai Perbedaan: Tafsir Q.S. Al-Hujurat Ayat 13 (Kelas 9)',
    slug: 'menjunjung-tinggi-toleransi-qs-al-hujurat-13',
    deskripsi_singkat: 'Kajian tentang keragaman suku bangsa sebagai sunnatullah untuk saling mengenal (lita\'arafu) dan ukuran kemuliaan di sisi Allah hanyalah ketakwaan.',
    konten: `# Menjunjung Tinggi Toleransi (Q.S. Al-Hujurat: 13)

Allah SWT berfirman:

> *"Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal. Sungguh, yang paling mulia di antara kamu di sisi Allah ialah orang yang paling bertakwa. Sungguh, Allah Maha Mengetahui, Maha Teliti."* (Q.S. Al-Hujurat [49]: 13)

## Nilai-Nilai Moderasi Beragama:
- **Tasamuh (Toleransi)**: Menghormati perbedaan suku, agama, dan latar belakang budaya.
- **Tawazun (Keseimbangan)**: Seimbang dalam beragama dan berbangsa.
- **I'tidal (Keadilan)**: Bersikap adil kepada siapa pun tanpa diskriminasi.`,
    gambar_cover_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    kategori_id: 'c-k9-qurhad',
    status: 'published',
    view_count: 620,
    created_at: '2024-01-10T08:00:00.000Z',
    updated_at: '2024-01-10T08:00:00.000Z',
    kategori: {
      id: 'c-k9-qurhad',
      nama: 'Al-Qur\'an dan Hadis',
      parent_id: 'c-k9',
      urutan: 1,
    },
    files: [
      {
        id: 'f-7',
        materi_id: 'm-6',
        nama_file: 'Modul_Ajar_PAI_Toleransi_Kelas9.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tipe: 'pdf',
        ukuran_bytes: 3100000,
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
