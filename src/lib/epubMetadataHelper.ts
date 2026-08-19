import ePub from 'epubjs';
import { uploadImage } from './supabase';

export interface ExtractedEpubMetadata {
  title?: string;
  creator?: string;
  publisher?: string;
  description?: string;
  language?: string;
  coverUrl?: string;
}

/**
 * Extracts embedded metadata and cover artwork from an EPUB file or URL
 */
export async function extractEpubMetadataAndCover(
  source: File | ArrayBuffer | string
): Promise<ExtractedEpubMetadata> {
  let bookData: any = source;

  if (source instanceof File) {
    bookData = await source.arrayBuffer();
  } else if (typeof source === 'string' && (source.startsWith('http://') || source.startsWith('https://'))) {
    try {
      const resp = await fetch(source, { mode: 'cors' });
      if (resp.ok) {
        bookData = await resp.arrayBuffer();
      }
    } catch {
      bookData = source;
    }
  }

  const book = ePub(bookData);
  await book.ready;

  const meta = await book.loaded.metadata;
  let coverUrl: string | undefined = undefined;

  try {
    const rawCoverUrl = await book.coverUrl();
    if (rawCoverUrl) {
      coverUrl = rawCoverUrl;

      // Try uploading extracted cover blob to Supabase Storage for permanent hosting
      try {
        const coverResp = await fetch(rawCoverUrl);
        const blob = await coverResp.blob();
        if (blob && blob.size > 100) {
          const coverFile = new File([blob], `cover-${Date.now()}.jpg`, {
            type: blob.type || 'image/jpeg',
          });
          const storageUrl = await uploadImage(coverFile, 'ebook-covers');
          if (storageUrl) {
            coverUrl = storageUrl;
          }
        }
      } catch (uploadErr) {
        console.warn('Could not persist cover to Supabase Storage, using raw cover URL:', uploadErr);
      }
    }
  } catch (coverErr) {
    console.warn('No embedded cover found in EPUB:', coverErr);
  }

  return {
    title: meta.title || undefined,
    creator: meta.creator || undefined,
    publisher: meta.publisher || undefined,
    description: meta.description || undefined,
    language: meta.language || undefined,
    coverUrl,
  };
}
