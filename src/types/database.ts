export type SectionKey =
  | 'hero'
  | 'materi'
  | 'sertifikasi'
  | 'riwayat'
  | 'youtube'
  | 'terjemahan'
  | 'karya'
  | 'ebook'
  | 'testimoni'
  | 'faq'
  | 'statistik'
  | 'kontak';

export interface Profile {
  id: string;
  nama: string;
  tagline: string;
  bio: string;
  foto_url: string | null;
  email: string | null;
  youtube_channel_id: string | null;
  socials: {
    youtube?: string;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    github?: string;
    telegram?: string;
    [key: string]: string | undefined;
  };
  created_at?: string;
  updated_at?: string;
}

export interface SectionItem {
  id: string;
  key: SectionKey | string;
  label: string;
  urutan: number;
  is_active: boolean;
  created_at?: string;
}

export interface KategoriMateri {
  id: string;
  nama: string;
  parent_id: string | null;
  urutan: number;
  created_at?: string;
  children?: KategoriMateri[];
  materi_count?: number;
}

export interface Tag {
  id: string;
  nama: string;
  slug: string;
  created_at?: string;
}

export interface MateriTag {
  materi_id: string;
  tag_id: string;
}

export interface MateriPAI {
  id: string;
  judul: string;
  slug: string;
  ringkasan?: string;
  deskripsi_singkat?: string;
  konten: string;
  kelas?: '7' | '8' | '9' | 'Fase D' | string;
  semester?: '1' | '2' | 'Semua' | string;
  elemen?: 'Qur\'an Hadits' | 'Akidah' | 'Akhlak' | 'Fiqih' | 'SKI' | 'Umum' | string;
  kategori_id?: string | null;
  thumbnail_url?: string | null;
  gambar_cover_url?: string | null;
  published?: boolean;
  status?: 'published' | 'draft' | string;
  views_count?: number;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
  kategori?: KategoriMateri;
  files?: MateriFile[];
  tags?: Tag[];
  komentar_count?: number;
}

export interface MateriFile {
  id: string;
  materi_id?: string;
  nama_file: string;
  file_url: string;
  tipe: 'pdf' | 'ppt' | 'excel' | 'word' | 'drive' | 'onedrive' | 'canva' | 'lainnya' | string;
  ukuran_bytes?: number | null;
  created_at?: string;
}

export interface Komentar {
  id: string;
  materi_id: string;
  nama: string;
  email: string;
  konten: string;
  status: 'pending' | 'approved' | 'rejected';
  parent_id?: string | null;
  created_at?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at?: string;
}

export interface Riwayat {
  id: string;
  judul: string;
  instansi_organisasi: string;
  jenis: 'pendidikan' | 'organisasi' | 'pengalaman' | 'sertifikasi';
  tahun_mulai: number;
  tahun_selesai: number | null;
  deskripsi: string | null;
  link_verifikasi: string | null;
  badge_url?: string | null;
  certificate_url?: string | null;
  accredible_id?: string | null;
  urutan: number;
  is_featured: boolean;
  created_at?: string;
}

export interface Testimoni {
  id: string;
  nama: string;
  peran_instansi: string;
  konten: string;
  foto_url?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  urutan: number;
  created_at?: string;
}

export interface FAQ {
  id: string;
  pertanyaan: string;
  jawaban: string;
  kategori: string;
  urutan: number;
  is_active: boolean;
  created_at?: string;
}

export interface ProyekTerjemahan {
  id: string;
  judul: string;
  penulis_asli?: string;
  bahasa_sumber?: string;
  bahasa_asal?: string;
  bahasa_target?: string;
  bahasa_tujuan?: string;
  deskripsi: string | null;
  status?: 'Selesai' | 'Proses' | 'Direncanakan' | string;
  progress_persen?: number;
  cover_url?: string | null;
  file_url?: string | null;
  link_file?: string | null;
  tahun: number;
  urutan: number;
  is_featured?: boolean;
  created_at?: string;
}

export interface Karya {
  id: string;
  judul: string;
  tipe?: 'Buku' | 'Modul' | 'Infografis' | 'Artikel' | 'Karya Lain' | string;
  deskripsi: string | null;
  link_terkait?: string | null;
  link_eksternal?: string | null;
  gambar_url?: string | null;
  kategori: string;
  tahun?: number;
  urutan: number;
  created_at?: string;
}

export type EBookFormat = 'pdf' | 'epub' | 'mobi' | 'azw3' | 'onedrive' | 'gdrive';

export interface EBook {
  id: string;
  judul: string;
  penulis_pengarang: string;
  penerbit_pentahqiq?: string | null;
  kategori: string;
  deskripsi?: string | null;
  cover_url?: string | null;
  format_file: EBookFormat;
  file_url?: string | null;
  onedrive_embed_url?: string | null;
  tahun_terbit?: number | string | null;
  jumlah_halaman?: number | null;
  bahasa: 'Indonesia' | 'Arab' | 'Pegon' | 'Bilingual' | string;
  is_downloadable?: boolean;
  is_featured: boolean;
  urutan: number;
  created_at?: string;
  updated_at?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  video_id: string;
  thumbnail_url: string | null;
  published_at: string | null;
  urutan: number;
  is_featured: boolean;
  created_at?: string;
}

export interface Sertifikasi {
  id: string;
  judul: string;
  penerbit: string;
  nomor_sertifikat: string | null;
  link_verifikasi: string | null;
  badge_url: string | null;
  certificate_url?: string | null;
  accredible_id?: string | null;
  tahun: number;
  kategori: string;
  urutan: number;
  is_featured: boolean;
  created_at?: string;
}

export interface GlobalSearchResult {
  id: string;
  type: 'materi' | 'terjemahan' | 'karya' | 'ebook';
  title: string;
  snippet: string;
  category?: string;
  url: string;
  image?: string | null;
  date?: string | null;
}

export interface StatistikData {
  totalMateri: number;
  totalTerjemahan: number;
  totalKarya: number;
  totalEbook: number;
  totalVideo: number;
  jamPelatihan: number;
  totalGuruTerlatih: number;
}
