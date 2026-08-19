export type SectionKey = 'hero' | 'materi' | 'youtube' | 'terjemahan' | 'karya' | 'kontak';

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

export interface MateriFile {
  id: string;
  materi_id: string;
  nama_file: string;
  file_url: string;
  tipe: 'pdf' | 'ppt' | 'word' | 'excel' | 'zip' | 'other' | string;
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
}

export interface ProyekTerjemahan {
  id: string;
  judul: string;
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
  deskripsi: string | null;
  gambar_url: string;
  link_eksternal: string | null;
  kategori: string;
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
