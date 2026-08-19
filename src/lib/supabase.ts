import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Create standard Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

/**
 * Upload an image to Supabase Storage bucket 'images'
 */
export async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
  if (!isSupabaseConfigured) {
    // If running in local demo mode, create an object URL for preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

/**
 * Upload a document attachment to Supabase Storage bucket 'materi-files'
 */
export async function uploadMateriFile(file: File): Promise<{ url: string; size: number; name: string }> {
  if (!isSupabaseConfigured) {
    return {
      url: URL.createObjectURL(file),
      size: file.size,
      name: file.name,
    };
  }

  const fileExt = file.name.split('.').pop();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${Date.now()}_${cleanName}`;

  const { error } = await supabase.storage
    .from('materi-files')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('materi-files')
    .getPublicUrl(fileName);

  return {
    url: publicUrlData.publicUrl,
    size: file.size,
    name: file.name,
  };
}
