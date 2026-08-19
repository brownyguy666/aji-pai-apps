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
  EBook,
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
  { id: 's-5', key: 'ebook', label: 'Pustaka E-Book & Kitab Digital', urutan: 5, is_active: true },
  { id: 's-6', key: 'youtube', label: 'Channel & Video YouTube Edukasi', urutan: 6, is_active: true },
  { id: 's-7', key: 'terjemahan', label: 'Proyek Terjemahan Kitab & Buku', urutan: 7, is_active: true },
  { id: 's-8', key: 'karya', label: 'Galeri Karya & Publikasi Digital', urutan: 8, is_active: true },
  { id: 's-9', key: 'riwayat', label: 'Riwayat Pendidikan & Organisasi', urutan: 9, is_active: true },
  { id: 's-10', key: 'testimoni', label: 'Testimoni Siswa & Rekan Guru', urutan: 10, is_active: true },
  { id: 's-11', key: 'faq', label: 'Tanya Jawab & Bantuan (FAQ)', urutan: 11, is_active: true },
  { id: 's-12', key: 'kontak', label: 'Kontak & Kolaborasi', urutan: 12, is_active: true },
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
  { id: 'kat-1', nama: 'Al-Qur\'an Hadits', parent_id: null, urutan: 1 },
  { id: 'kat-2', nama: 'Akidah Akhlak', parent_id: null, urutan: 2 },
  { id: 'kat-3', nama: 'Fikih Ibadah & Muamalah', parent_id: null, urutan: 3 },
  { id: 'kat-4', nama: 'Sejarah Kebudayaan Islam (SKI)', parent_id: null, urutan: 4 },
  { id: 'kat-5', nama: 'Modul & Perangkat Ajar Kurikulum Merdeka', parent_id: null, urutan: 5 },
  // Sub-kategori
  { id: 'kat-3-1', nama: 'Fikih Thaharah & Shalat', parent_id: 'kat-3', urutan: 1 },
  { id: 'kat-3-2', nama: 'Fikih Zakat & Wakaf', parent_id: 'kat-3', urutan: 2 },
  { id: 'kat-3-3', nama: 'Fikih Muamalah Kontemporer', parent_id: 'kat-3', urutan: 3 },
  { id: 'kat-5-1', nama: 'Modul Fase D Kelas 7', parent_id: 'kat-5', urutan: 1 },
  { id: 'kat-5-2', nama: 'Modul Fase D Kelas 8', parent_id: 'kat-5', urutan: 2 },
  { id: 'kat-5-3', nama: 'Modul Fase D Kelas 9', parent_id: 'kat-5', urutan: 3 },
];

export const initialMateri: MateriPAI[] = [
  {
    id: 'm-1',
    judul: 'Meneladani Sifat-Sifat Allah Swt. Melalui Al-Asma\'u al-Husna (Fase D Kelas 7)',
    slug: 'meneladani-al-asmau-al-husna-fase-d-kelas-7',
    ringkasan: 'Pembahasan mendalam tentang makna Al-Alim, Al-Khabir, As-Sami\', dan Al-Bashir beserta penerapannya dalam kehidupan sehari-hari siswa di era digital.',
    konten: `
# Meneladani Al-Asma'u al-Husna dalam Keseharian

Al-Asma'u al-Husna secara bahasa berarti nama-nama Allah Swt. yang terbaik dan terindah. Mengenal nama-nama Allah merupakan fondasi penting dalam membangun tauhid dan keimanan yang kokoh.

## 1. Al-'Alīm (العَلِيمُ) - Maha Mengetahui
Allah Swt. mengetahui segala sesuatu, baik yang tampak maupun yang gaib, yang telah lalu maupun yang akan datang. Tidak ada sehelai daun pun yang gugur melainkan dalam pengetahuan-Nya.

> "Dan pada sisi Allah-lah kunci-kunci semua yang gaib; tidak ada yang mengetahuinya kecuali Dia sendiri..." (QS. Al-An'am: 59)

### Implementasi Pelajar:
- Bersikap jujur dalam setiap ujian dan tugas tanpa perlu diawasi guru.
- Senantiasa haus akan ilmu pengetahuan yang bermanfaat.

---

## 2. Al-Khabīr (الخَبِيرُ) - Maha Teliti / Maha Mengetahui Rahasia
Allah mengetahui perkara yang paling detail dan tersembunyi hingga ke dalam lintasan hati manusia.

## 3. As-Samī' (السَّمِيعُ) - Maha Mendengar
Allah mendengar setiap bisikan hati, doa yang terucap perlahan, dan keluh kesah hamba-Nya.

## 4. Al-Bashīr (البَصِيرُ) - Maha Melihat
Tidak ada perbuatan yang luput dari penglihatan Allah Swt., baik di tempat terang benderang maupun dalam kegelapan malam.
    `,
    kelas: '7',
    semester: '1',
    elemen: 'Akidah',
    kategori_id: 'kat-2',
    thumbnail_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
    published: true,
    views_count: 142,
    files: [
      {
        id: 'f-1',
        nama_file: 'Modul_Ajar_Asmaul_Husna_Kelas7.pdf',
        file_url: 'https://onedrive.live.com/embed?resid=sample_modul_asmaul_husna',
        tipe: 'pdf',
        ukuran_bytes: 2450000,
      },
      {
        id: 'f-2',
        nama_file: 'Slide_Presentasi_Interaktif_Canva.pptx',
        file_url: 'https://www.canva.com/design/sample/view?embed',
        tipe: 'canva',
        ukuran_bytes: null,
      },
    ],
  },
  {
    id: 'm-2',
    judul: 'Hakikat Shalat dan Dzikir untuk Mencegah Perbuatan Keji dan Munkar (Fase D Kelas 7)',
    slug: 'hakikat-shalat-dan-dzikir-mencegah-keji-munkar',
    ringkasan: 'Kajian fikih ibadah praktis mengenai rukun, syarat sah, khusyuk dalam shalat, serta dampaknya dalam membentuk akhlak karimah peserta didik.',
    konten: `
# Hakikat Shalat & Dzikir Pencegah Kemunkaran

Shalat adalah tiang agama (*'imadud din*). Ibadah ini bukan sekadar rutinitas gerakan fisik, melainkan dialog spiritual hamba dengan Sang Pencipta.

## Dalil Al-Qur'an
> "...dan laksanakanlah shalat. Sesungguhnya shalat itu mencegah dari (perbuatan) keji dan munkar..." (QS. Al-'Ankabut: 45)

## Kunci Meraih Shalat Khusyuk:
1. Thaharah (bersuci) secara sempurna sesuai tuntunan sunnah.
2. Memahami arti bacaan shalat yang dilafalkan.
3. Menghadirkan rasa pengawasan Allah (*muraqabah*).
    `,
    kelas: '7',
    semester: '1',
    elemen: 'Fiqih',
    kategori_id: 'kat-3-1',
    thumbnail_url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    published: true,
    views_count: 98,
  },
];

export const initialEbooks: EBook[] = [
  {
    id: 'eb-1',
    judul: 'Matan Al-Ghayah wa At-Taqrib (Matan Abu Syuja\')',
    penulis_pengarang: 'Al-Qadhi Abu Syuja\' Ahmad bin Al-Hasan Al-Ishfahani',
    penerbit_pentahqiq: 'Tahqiq & Terjemah: Aji Bagus Khoiri, S.Pd., Gr.',
    kategori: 'Fikih Syafi\'i',
    deskripsi: 'Naskah rujukan induk fikih mazhab Syafi\'i tingkat dasar yang memuat bab Thaharah, Shalat, Zakat, Puasa, hingga Muamalah dengan bahasa yang padat, ringkas, dan sistematis.',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    format_file: 'onedrive',
    file_url: 'https://docs.google.com/viewer?url=https%3A%2F%2Fwww.w3.org%2FWAI%2FER%2Ftests%2Fxhtml%2Ftestfiles%2Fresources%2Fpdf%2Fdummy.pdf&embedded=true',
    onedrive_embed_url: 'https://docs.google.com/viewer?url=https%3A%2F%2Fwww.w3.org%2FWAI%2FER%2Ftests%2Fxhtml%2Ftestfiles%2Fresources%2Fpdf%2Fdummy.pdf&embedded=true',
    tahun_terbit: '2024',
    jumlah_halaman: 124,
    bahasa: 'Bilingual',
    is_downloadable: true,
    is_featured: true,
    urutan: 1,
  },
  {
    id: 'eb-2',
    judul: 'Modul Ajar PAI & Budi Pekerti Fase D (Kelas 7, 8, 9)',
    penulis_pengarang: 'Aji Bagus Khoiri, S.Pd., Gr.',
    penerbit_pentahqiq: 'Komunitas Guru Berbagi & MGMP PAI SMP',
    kategori: 'Modul Kurikulum Merdeka',
    deskripsi: 'Kumpulan modul ajar lengkap berbasis Kurikulum Merdeka Fase D mencakup 5 elemen (Al-Qur\'an Hadis, Akidah, Akhlak, Fikih, SKI) dilengkapi LKPD interaktif dan rubrik asesmen.',
    cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80',
    format_file: 'pdf',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    onedrive_embed_url: 'https://docs.google.com/viewer?url=https%3A%2F%2Fwww.w3.org%2FWAI%2FER%2Ftests%2Fxhtml%2Ftestfiles%2Fresources%2Fpdf%2Fdummy.pdf&embedded=true',
    tahun_terbit: '2024',
    jumlah_halaman: 210,
    bahasa: 'Indonesia',
    is_downloadable: true,
    is_featured: true,
    urutan: 2,
  },
  {
    id: 'eb-3',
    judul: 'Bulughul Maram min Adillatil Ahkam (E-Book Terjemah)',
    penulis_pengarang: 'Al-Hafizh Ibnu Hajar Al-Asqalani',
    penerbit_pentahqiq: 'Darul Hadits & Maktabah Turats',
    kategori: 'Hadits Ahkam',
    deskripsi: 'Kompilasi hadits-hadits hukum fikih tematis karya Ibnu Hajar Al-Asqalani dengan takhrij derajat hadits dan syarah ringkas.',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    format_file: 'mobi',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    onedrive_embed_url: 'https://docs.google.com/viewer?url=https%3A%2F%2Fwww.w3.org%2FWAI%2FER%2Ftests%2Fxhtml%2Ftestfiles%2Fresources%2Fpdf%2Fdummy.pdf&embedded=true',
    tahun_terbit: '2023',
    jumlah_halaman: 480,
    bahasa: 'Indonesia',
    is_downloadable: true,
    is_featured: true,
    urutan: 3,
  },
  {
    id: 'eb-4',
    judul: 'Safinatun Naja fi Ushulid Din wa Fiqhih',
    penulis_pengarang: 'Salim bin Sumair Al-Hadhrami',
    penerbit_pentahqiq: 'Maktabah PAI Digital',
    kategori: 'Akidah & Fikih',
    deskripsi: 'Kitab pegangan dasar santri dan pelajar pemula tentang rukun iman, rukun Islam, tanda-tanda baligh, dan syarat sah shalat.',
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    format_file: 'azw3',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    onedrive_embed_url: 'https://docs.google.com/viewer?url=https%3A%2F%2Fwww.w3.org%2FWAI%2FER%2Ftests%2Fxhtml%2Ftestfiles%2Fresources%2Fpdf%2Fdummy.pdf&embedded=true',
    tahun_terbit: '2023',
    jumlah_halaman: 85,
    bahasa: 'Arab',
    is_downloadable: true,
    is_featured: true,
    urutan: 4,
  },
];

export const initialSertifikasi: Sertifikasi[] = [
  {
    id: 'gce-1',
    judul: 'Google Certified Educator Level 1',
    penerbit: 'Google for Education',
    nomor_sertifikat: '190209183',
    link_verifikasi: 'https://edu.google.accredible.com/190209183',
    badge_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/190209183',
    certificate_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/190209183',
    accredible_id: '190209183',
    tahun: 2024,
    kategori: 'Google for Education',
    urutan: 1,
    is_featured: true,
  },
  {
    id: 'gce-2',
    judul: 'Gemini Certified Educator',
    penerbit: 'Google for Education',
    nomor_sertifikat: '191245638',
    link_verifikasi: 'https://edu.google.accredible.com/191245638',
    badge_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/191245638',
    certificate_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/191245638',
    accredible_id: '191245638',
    tahun: 2024,
    kategori: 'Artificial Intelligence in Education',
    urutan: 2,
    is_featured: true,
  },
  {
    id: 'gce-3',
    judul: 'Gemini Certified Faculty',
    penerbit: 'Google for Education',
    nomor_sertifikat: '164938512',
    link_verifikasi: 'https://edu.google.accredible.com/164938512',
    badge_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/164938512',
    certificate_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/164938512',
    accredible_id: '164938512',
    tahun: 2024,
    kategori: 'AI Pedagogy & Higher Ed',
    urutan: 3,
    is_featured: true,
  },
];

export const initialRiwayat: Riwayat[] = [
  {
    id: 'rw-1',
    judul: 'Sarjana Pendidikan Agama Islam (S.Pd)',
    instansi_organisasi: 'Institut Agama Islam (IAI) Ibrahimy Genteng / Fakultas Tarbiyah',
    jenis: 'pendidikan',
    tahun_mulai: 2014,
    tahun_selesai: 2018,
    deskripsi: 'Lulus dengan fokus kajian metodologi pengajaran fikih dan integrasi literasi kitab kuning dalam pendidikan madrasah/sekolah.',
    link_verifikasi: null,
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
    link_verifikasi: null,
    urutan: 2,
    is_featured: true,
  },
  {
    id: 'rw-3',
    judul: 'Pengurus Musyawarah Guru Mata Pelajaran (MGMP) PAI SMP',
    instansi_organisasi: 'MGMP PAI SMP Kabupaten Banyuwangi',
    jenis: 'organisasi',
    tahun_mulai: 2020,
    tahun_selesai: null,
    deskripsi: 'Aktif dalam pengembangan perangkat Kurikulum Merdeka (Fase D), pembuatan modul ajar digital, dan bank soal terstandar.',
    link_verifikasi: null,
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
    link_verifikasi: null,
    urutan: 4,
    is_featured: true,
  },
  {
    id: 'rw-5',
    judul: 'Guru Pendidikan Agama Islam (PAI) & Budi Pekerti',
    instansi_organisasi: 'SMP Negeri 2 Glagah Banyuwangi',
    jenis: 'pengalaman',
    tahun_mulai: 2019,
    tahun_selesai: null,
    deskripsi: 'Mengampu mata pelajaran PAI Fase D (Kelas 7, 8, 9), pembina ekstrakurikuler keagamaan (Tahfidz & Hadrah), serta tim IT digitalisasi pembelajaran.',
    link_verifikasi: null,
    urutan: 5,
    is_featured: true,
  },
  {
    id: 'rw-6',
    judul: 'Guru Pengajar & Fasilitator Media Pembelajaran Digital',
    instansi_organisasi: 'Komunitas Guru Berbagi & MGMP PAI',
    jenis: 'pengalaman',
    tahun_mulai: 2021,
    tahun_selesai: null,
    deskripsi: 'Memproduksi materi video edukasi visual, pembahasan soal OSN/OSNK, dan kajian sejarah peradaban Islam.',
    link_verifikasi: null,
    urutan: 6,
    is_featured: true,
  },
];

export const initialTestimoni: Testimoni[] = [
  {
    id: 'tst-1',
    nama: 'Ahmad Fauzi, M.Pd.',
    peran_instansi: 'Guru PAI & Pengurus MGMP',
    konten: 'Pak Aji adalah sosok guru inspiratif yang berhasil mendigitalisasi pembelajaran PAI. Modul ajar dan materi interaktif yang beliau rancang sangat membantu rekan guru di MGMP.',
    foto_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    status: 'approved',
    rating: 5,
    urutan: 1,
  },
  {
    id: 'tst-2',
    nama: 'Nabila Az-Zahra',
    peran_instansi: 'Alumni Siswa SMPN 2 Glagah',
    konten: 'Belajar materi fikih dan sejarah Islam bersama Pak Aji jadi sangat menyenangkan karena selalu ada animasi, kuis Canva interaktif, dan slide yang mudah dipahami.',
    foto_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    status: 'approved',
    rating: 5,
    urutan: 2,
  },
  {
    id: 'tst-3',
    nama: 'Ustadz Muhammad Ridwan',
    peran_instansi: 'Pengasuh Majlis Taklim & Peneliti Naskah',
    konten: 'Akurasi terjemahan kitab Matan Abu Syuja\' yang disusun Pak Aji sangat teliti, dilengkapi ta\'liq dalil yang kontekstual bagi generasi muda.',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'approved',
    rating: 5,
    urutan: 3,
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
    id: 'com-1',
    materi_id: 'm-1',
    nama: 'H. Suryadi, S.Ag.',
    email: 'suryadi.guru@gmail.com',
    konten: 'MasyaAllah, modul Asmaul Husna ini sangat runtut dan memudahkan siswa SMP dalam memahami konsep tauhid rububiyyah dan uluhiyyah. Izin menggunakan modulnya untuk pembelajaran di kelas kami Pak Aji.',
    status: 'approved',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'com-2',
    materi_id: 'm-2',
    nama: 'Rina Marlina',
    email: 'rina.marlina@student.sch.id',
    konten: 'Penjelasannya sangat jelas dan mudah dipahami, terutama bagian implementasi khusyuk dalam shalat.',
    status: 'approved',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const initialSubscribers: Subscriber[] = [
  {
    id: 'sub-1',
    email: 'guru.pai.nusantara@gmail.com',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const initialTerjemahan: ProyekTerjemahan[] = [
  {
    id: 't-1',
    judul: 'Matan Al-Ghayah wa At-Taqrib (Matan Abu Syuja\')',
    penulis_asli: 'Al-Qadhi Abu Syuja\' Ahmad bin Al-Hasan Al-Ishfahani',
    bahasa_sumber: 'Bahasa Arab',
    bahasa_target: 'Bahasa Indonesia',
    deskripsi: 'Terjemahan lengkap matan fikih klasik mazhab Syafi\'i yang ringkas dan padat, dilengkapi catatan kaki kontekstual untuk tingkat pemula dan santri madrasah.',
    status: 'Selesai',
    progress_persen: 100,
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    file_url: 'https://drive.google.com',
    tahun: 2024,
    urutan: 1,
    is_featured: true,
  },
  {
    id: 't-2',
    judul: 'Safinatun Naja fi Ushulid Din wa Fiqhih',
    penulis_asli: 'Salim bin Sumair Al-Hadhrami',
    bahasa_sumber: 'Bahasa Arab',
    bahasa_target: 'Bahasa Indonesia',
    deskripsi: 'Kajian rukun Islam dan rukun iman serta tata cara ibadah bersuci dan shalat berstandar fikih Syafi\'iyyah.',
    status: 'Selesai',
    progress_persen: 100,
    cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80',
    file_url: 'https://drive.google.com',
    tahun: 2024,
    urutan: 2,
    is_featured: true,
  },
  {
    id: 't-3',
    judul: 'Kasyifatus Saja Syarah Safinatin Naja',
    penulis_asli: 'Syekh Nawawi Al-Bantani',
    bahasa_sumber: 'Bahasa Arab',
    bahasa_target: 'Bahasa Indonesia',
    deskripsi: 'Proses penerjemahan dan digitalisasi syarah kitab Safinah oleh ulama Nusantara tersohor, Syekh Nawawi Banten.',
    status: 'Proses',
    progress_persen: 65,
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    file_url: null,
    tahun: 2024,
    urutan: 3,
    is_featured: true,
  },
];

export const initialKarya: Karya[] = [
  {
    id: 'k-1',
    judul: 'Infografis Interaktif: Peta Konsep 5 Elemen PAI Kurikulum Merdeka',
    deskripsi: 'Visualisasi alur capaian pembelajaran dan relasi antar-elemen PAI Fase D untuk mempermudah perencanaan pembelajaran guru.',
    gambar_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    link_terkait: 'https://canva.com',
    kategori: 'Media Infografis',
    tahun: 2024,
    urutan: 1,
    tipe: 'Infografis',
  },
  {
    id: 'k-2',
    judul: 'Digitalisasi Bank Soal PAI Fase D Berbasis Higher Order Thinking (HOTS)',
    deskripsi: 'Kumpulan instrumen asesmen formatif dan sumatif digital terintegrasi Google Forms & Quizizz.',
    gambar_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    link_terkait: 'https://forms.google.com',
    kategori: 'Instrumen Asesmen',
    tahun: 2024,
    urutan: 2,
    tipe: 'Modul',
  },
  {
    id: 'k-3',
    judul: 'Modul Digital: Fikih Thaharah dan Shalat Praktis Berbasis Animasi',
    deskripsi: 'E-modul interaktif dengan video panduan wudhu dan tayamum untuk peserta didik kelas 7 SMP.',
    gambar_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    link_terkait: 'https://guru.kemdikbud.go.id',
    kategori: 'Modul Ajar',
    tahun: 2024,
    urutan: 3,
    tipe: 'Buku',
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
