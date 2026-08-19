export type SectionKey =
  | 'hero'
  | 'materi'
  | 'sertifikasi'
  | 'riwayat'
  | 'youtube'
  | 'terjemahan'
  | 'karya'
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
  // Nested helper properties
  children?: KategoriMateri[];
  level?: number;
  parent_nama?: string;
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
  tag?: Tag;
}

export interface MateriFile {
  id: string;
  materi_id: string;
  nama_file: string;
  file_url: string;
  tipe: 'pdf' | 'ppt' | 'word' | 'excel' | 'zip' | 'drive' | 'onedrive' | 'canva' | 'other' | string;
  ukuran_bytes?: number;
  created_at?: string;
}

export interface MateriPAI {
  id: string;
  judul: string;
  slug: string;
  deskripsi_singkat: string | null;
  konten: string;
  gambar_cover_url: string | null;
  kategori_id: string | null;
  status: 'draft' | 'published';
  view_count: number;
  created_at: string;
  updated_at: string;
  // Joined or resolved
  kategori?: KategoriMateri | null;
  files?: MateriFile[];
  tags?: Tag[];
  komentar_count?: number;
  pending_komentar_count?: number;
}

export interface Komentar {
  id: string;
  materi_id: string;
  nama: string;
  email: string;
  konten: string;
  status: 'pending' | 'approved' | 'rejected';
  parent_id?: string | null;
  created_at: string;
  materi?: {
    id: string;
    judul: string;
    slug: string;
  };
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface Riwayat {
  id: string;
  judul: string;
  instansi_organisasi: string;
  jenis: 'pendidikan' | 'organisasi' | 'pengalaman' | 'sertifikasi';
  tahun_mulai: number;
  tahun_selesai?: number | null;
  deskripsi?: string | null;
  link_verifikasi?: string | null;
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
  rating: number; // 1 to 5
  urutan: number;
  created_at: string;
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
  slug?: string;
  bahasa_asal: string;
  bahasa_tujuan: string;
  deskripsi: string | null;
  link_file: string | null;
  tahun: number;
  urutan: number;
  created_at?: string;
}

export interface Karya {
  id: string;
  judul: string;
  slug?: string;
  deskripsi: string | null;
  gambar_url: string;
  link_eksternal: string | null;
  kategori: string;
  tahun?: number;
  urutan: number;
  created_at?: string;
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
  type: 'materi' | 'terjemahan' | 'karya';
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
  totalVideo: number;
  jamPelatihan: number;
  totalGuruTerlatih: number;
}
