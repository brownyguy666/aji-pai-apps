/**
 * Helper utility to parse and transform Cloud Storage links (Google Drive, OneDrive, Office 365, Canva, Dropbox, YouTube, etc.)
 * into responsive, secure embed URLs.
 */

export interface EmbedInfo {
  provider: 'gdrive' | 'gdocs' | 'gslides' | 'gsheets' | 'gforms' | 'onedrive' | 'office' | 'canva' | 'youtube' | 'pdf' | 'iframe' | 'generic';
  embedUrl: string;
  originalUrl: string;
  isEmbeddable: boolean;
  title?: string;
}

export function parseCloudEmbedUrl(inputUrl: string): EmbedInfo {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return {
      provider: 'generic',
      embedUrl: '',
      originalUrl: '',
      isEmbeddable: false,
    };
  }

  const raw = inputUrl.trim();

  // 1. Check if user pasted a raw <iframe> code snippet
  if (raw.startsWith('<iframe') && raw.includes('src=')) {
    const srcMatch = raw.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return {
        provider: 'iframe',
        embedUrl: srcMatch[1],
        originalUrl: raw,
        isEmbeddable: true,
      };
    }
  }

  // 2. Google Drive File (PDF, Video, Images, etc.)
  // Patterns:
  // - https://drive.google.com/file/d/1abcXYZ_123/view?usp=sharing
  // - https://drive.google.com/open?id=1abcXYZ_123
  // - https://drive.google.com/uc?id=1abcXYZ_123
  const gdriveFileMatch = raw.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/i);
  if (gdriveFileMatch && gdriveFileMatch[1]) {
    const fileId = gdriveFileMatch[1];
    return {
      provider: 'gdrive',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: raw,
      isEmbeddable: true,
      title: 'Google Drive Viewer',
    };
  }

  // 3. Google Docs
  const gdocsMatch = raw.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/i);
  if (gdocsMatch && gdocsMatch[1]) {
    const docId = gdocsMatch[1];
    return {
      provider: 'gdocs',
      embedUrl: `https://docs.google.com/document/d/${docId}/preview`,
      originalUrl: raw,
      isEmbeddable: true,
      title: 'Google Docs',
    };
  }

  // 4. Google Slides (Presentations)
  const gslidesMatch = raw.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/i);
  if (gslidesMatch && gslidesMatch[1]) {
    const slideId = gslidesMatch[1];
    return {
      provider: 'gslides',
      embedUrl: `https://docs.google.com/presentation/d/${slideId}/embed?start=false&loop=false&delayms=3000`,
      originalUrl: raw,
      isEmbeddable: true,
      title: 'Google Slides',
    };
  }

  // 5. Google Sheets (Spreadsheets)
  const gsheetsMatch = raw.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/i);
  if (gsheetsMatch && gsheetsMatch[1]) {
    const sheetId = gsheetsMatch[1];
    return {
      provider: 'gsheets',
      embedUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/preview`,
      originalUrl: raw,
      isEmbeddable: true,
      title: 'Google Sheets',
    };
  }

  // 6. Google Forms
  const gformsMatch = raw.match(/docs\.google\.com\/forms\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/i);
  if (gformsMatch && gformsMatch[1]) {
    const formId = gformsMatch[1];
    return {
      provider: 'gforms',
      embedUrl: `https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`,
      originalUrl: raw,
      isEmbeddable: true,
      title: 'Google Form',
    };
  }

  // 7. Microsoft OneDrive / SharePoint
  // OneDrive embed links often have embedparams or can be wrapped in Microsoft Office Online viewer
  if (raw.includes('onedrive.live.com') || raw.includes('1drv.ms') || raw.includes('sharepoint.com')) {
    if (raw.includes('embed')) {
      return {
        provider: 'onedrive',
        embedUrl: raw,
        originalUrl: raw,
        isEmbeddable: true,
        title: 'Microsoft OneDrive',
      };
    }
    // If standard view link on onedrive, convert to embed query
    let embedOneDrive = raw.replace('/view.aspx', '/embed.aspx');
    if (!embedOneDrive.includes('action=embedview') && !embedOneDrive.includes('embed')) {
      embedOneDrive += (embedOneDrive.includes('?') ? '&' : '?') + 'em=2';
    }
    return {
      provider: 'onedrive',
      embedUrl: embedOneDrive,
      originalUrl: raw,
      isEmbeddable: true,
      title: 'Microsoft OneDrive',
    };
  }

  // 8. Canva Designs / Presentations
  const canvaMatch = raw.match(/canva\.com\/design\/([a-zA-Z0-9_-]+)/i);
  if (canvaMatch && canvaMatch[1]) {
    let canvaUrl = raw;
    if (!canvaUrl.includes('embed')) {
      canvaUrl = canvaUrl.split('?')[0] + '/view?embed';
    }
    return {
      provider: 'canva',
      embedUrl: canvaUrl,
      originalUrl: raw,
      isEmbeddable: true,
      title: 'Canva Design',
    };
  }

  // 9. YouTube Video
  const ytMatch = raw.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      originalUrl: raw,
      isEmbeddable: true,
      title: 'YouTube Video',
    };
  }

  // 10. Direct PDF file URL
  if (raw.toLowerCase().endsWith('.pdf') || raw.includes('.pdf?')) {
    return {
      provider: 'pdf',
      embedUrl: raw,
      originalUrl: raw,
      isEmbeddable: true,
      title: 'Dokumen PDF',
    };
  }

  // 11. Generic fallback via Google Docs Viewer
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return {
      provider: 'generic',
      embedUrl: `https://docs.google.com/viewer?url=${encodeURIComponent(raw)}&embedded=true`,
      originalUrl: raw,
      isEmbeddable: true,
      title: 'Dokumen Web',
    };
  }

  return {
    provider: 'generic',
    embedUrl: raw,
    originalUrl: raw,
    isEmbeddable: false,
  };
}
