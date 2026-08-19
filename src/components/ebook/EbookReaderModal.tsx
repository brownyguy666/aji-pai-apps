import React, { useState, useEffect, useRef } from 'react';
import ePub, { Book, Rendition } from 'epubjs';
import {
  X,
  Maximize2,
  Minimize2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  List,
  Sun,
  Moon,
  Coffee,
  Download,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Cloud,
  FileText,
} from 'lucide-react';
import { EBook } from '../../types/database';
import { parseCloudEmbedUrl } from '../../lib/embedHelper';

export interface EbookReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  ebook: EBook | null;
}

type ReaderTheme = 'light' | 'sepia' | 'dark';
type ViewMode = 'epub' | 'cloud' | 'fallback';

export const EbookReaderModal: React.FC<EbookReaderModalProps> = ({
  isOpen,
  onClose,
  ebook,
}) => {
  const [theme, setTheme] = useState<ReaderTheme>('light');
  const [fontSize, setFontSize] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [tocItems, setTocItems] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active view mode: 'epub' (interactive epubjs) or 'cloud' (OneDrive/PDF iframe)
  const [viewMode, setViewMode] = useState<ViewMode>('epub');

  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);

  // Determine cloud embed info
  const cloudInfo = parseCloudEmbedUrl(ebook?.onedrive_embed_url || ebook?.file_url || '');

  // Detect if item is genuinely an EPUB file (not an iframe or web page)
  const hasEpubFormat =
    ebook?.format_file === 'epub' ||
    (ebook?.file_url && ebook.file_url.toLowerCase().includes('.epub'));

  // Reset view mode on open
  useEffect(() => {
    if (!isOpen || !ebook) return;

    // If it's onedrive or pdf, or if file_url is not an epub binary, default to cloud view
    if (!hasEpubFormat || ebook.format_file === 'onedrive' || ebook.format_file === 'pdf') {
      setViewMode('cloud');
      setIsLoading(false);
      setErrorMsg(null);
    } else {
      setViewMode('epub');
    }
  }, [isOpen, ebook, hasEpubFormat]);

  // EPUB Reader Engine with Fetch Timeout & CORS Safety
  useEffect(() => {
    if (!isOpen || !ebook || viewMode !== 'epub') return;

    let isMounted = true;
    let abortController = new AbortController();
    setIsLoading(true);
    setErrorMsg(null);

    // Timeout safety: if not rendered within 5 seconds, provide fallback option
    const timer = setTimeout(() => {
      if (isMounted && isLoading) {
        setIsLoading(false);
        setErrorMsg('Memuat file EPUB memerlukan waktu lebih lama dari biasanya (koneksi eksternal / batas CORS). Anda dapat beralih ke Mode OneDrive Cloud.');
      }
    }, 5000);

    const initEpub = async () => {
      try {
        const epubUrl = ebook.file_url || ebook.onedrive_embed_url || '';

        // If URL points to OneDrive or Google Drive, switch directly to cloud mode
        if (
          epubUrl.includes('onedrive.live.com') ||
          epubUrl.includes('1drv.ms') ||
          epubUrl.includes('drive.google.com') ||
          epubUrl.includes('docs.google.com')
        ) {
          if (isMounted) {
            setViewMode('cloud');
            setIsLoading(false);
          }
          return;
        }

        // Fetch ArrayBuffer first to avoid silent hung requests and capture CORS issues cleanly
        const response = await fetch(epubUrl, {
          signal: abortController.signal,
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: Gagal mengunduh file EPUB.`);
        }

        const buffer = await response.arrayBuffer();
        if (!isMounted || !viewerRef.current) return;

        // Clean up previous book instance if any
        if (bookRef.current) {
          try {
            bookRef.current.destroy();
          } catch {}
        }

        const book = ePub(buffer);
        bookRef.current = book;

        await book.ready;

        if (!isMounted || !viewerRef.current) return;

        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          flow: 'paginated',
          spread: 'auto',
        });
        renditionRef.current = rendition;

        // Register themes
        rendition.themes.register('light', {
          body: { background: '#ffffff', color: '#1e293b', 'font-family': 'Inter, system-ui, sans-serif' },
        });
        rendition.themes.register('sepia', {
          body: { background: '#fbf0d9', color: '#5f4b32', 'font-family': 'Georgia, serif' },
        });
        rendition.themes.register('dark', {
          body: { background: '#0f172a', color: '#e2e8f0', 'font-family': 'Inter, system-ui, sans-serif' },
        });
        rendition.themes.select(theme);

        // Display first section
        await rendition.display();

        // Load TOC
        book.loaded.navigation.then((nav) => {
          if (isMounted) {
            setTocItems(nav.toc || []);
          }
        });

        rendition.on('relocated', (location: any) => {
          if (isMounted && location?.start?.displayed?.page) {
            setCurrentLocation(`Hal ${location.start.displayed.page}`);
          }
        });

        if (isMounted) {
          setIsLoading(false);
          clearTimeout(timer);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('EPUB direct reader fallback triggered:', err);
        if (isMounted) {
          setIsLoading(false);
          setErrorMsg(
            'Format EPUB dari sumber eksternal dibatasi oleh kebijakan keamanan browser (CORS). Anda dapat melihatnya melalui Mode Cloud Embed atau mengunduh filenya.'
          );
        }
      }
    };

    initEpub();

    return () => {
      isMounted = false;
      clearTimeout(timer);
      abortController.abort();
      if (bookRef.current) {
        try {
          bookRef.current.destroy();
        } catch {}
      }
    };
  }, [isOpen, ebook, viewMode]);

  // Apply theme & font changes to rendition
  useEffect(() => {
    if (renditionRef.current && viewMode === 'epub') {
      renditionRef.current.themes.select(theme);
      renditionRef.current.themes.fontSize(`${fontSize}%`);
    }
  }, [theme, fontSize, viewMode]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (viewMode === 'epub') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          renditionRef.current?.next();
        } else if (e.key === 'ArrowLeft') {
          renditionRef.current?.prev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, viewMode]);

  if (!isOpen || !ebook) return null;

  const nextChapter = () => renditionRef.current?.next();
  const prevChapter = () => renditionRef.current?.prev();

  const handleTocClick = (href: string) => {
    renditionRef.current?.display(href);
    setTocOpen(false);
  };

  const getThemeBg = () => {
    if (theme === 'dark') return 'bg-slate-950 text-slate-100 border-slate-800';
    if (theme === 'sepia') return 'bg-[#fbf0d9] text-[#5f4b32] border-[#e8d5b5]';
    return 'bg-white text-slate-900 border-slate-200';
  };

  // Embed URL resolution
  const embedSourceUrl =
    cloudInfo.embedUrl ||
    ebook.onedrive_embed_url ||
    (ebook.file_url && !ebook.file_url.endsWith('.epub') ? ebook.file_url : '') ||
    `https://docs.google.com/viewer?url=${encodeURIComponent(ebook.file_url || '')}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`relative flex flex-col w-full rounded-3xl overflow-hidden shadow-2xl transition-all border ${getThemeBg()} ${
          isFullscreen ? 'h-full max-h-screen' : 'h-[92vh] max-w-6xl'
        }`}
      >
        {/* Top Header Controls */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-inherit shrink-0 gap-2">
          
          {/* Left: Book Meta Info */}
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 shrink-0 hidden sm:block">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-base font-bold font-display truncate leading-tight">
                {ebook.judul}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                {ebook.penulis_pengarang} {ebook.bahasa && `• ${ebook.bahasa}`}
              </p>
            </div>
          </div>

          {/* Center: Mode Switcher (EPUB Reflow vs Cloud Embed) */}
          <div className="flex items-center bg-slate-500/10 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => {
                setViewMode('epub');
                setErrorMsg(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'epub'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mode Teks (EPUB)</span>
              <span className="md:hidden">EPUB</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('cloud');
                setErrorMsg(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'cloud'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mode Cloud (OneDrive / PDF)</span>
              <span className="md:hidden">OneDrive / PDF</span>
            </button>
          </div>

          {/* Right: Reader Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* EPUB specific controls */}
            {viewMode === 'epub' && (
              <>
                {/* Table of contents toggle */}
                <button
                  type="button"
                  onClick={() => setTocOpen(!tocOpen)}
                  className={`p-1.5 sm:p-2 rounded-xl transition-colors ${
                    tocOpen ? 'bg-brand-600 text-white' : 'hover:bg-slate-500/10'
                  }`}
                  title="Daftar Isi Bab"
                >
                  <List className="w-4 h-4" />
                </button>

                {/* Font Size decrease / increase */}
                <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-500/10">
                  <button
                    type="button"
                    onClick={() => setFontSize((s) => Math.max(70, s - 10))}
                    className="px-2 py-0.5 text-xs font-bold hover:bg-slate-500/20 rounded-lg"
                    title="Kecilkan Font"
                  >
                    A-
                  </button>
                  <span className="text-[10px] font-mono font-semibold px-1">{fontSize}%</span>
                  <button
                    type="button"
                    onClick={() => setFontSize((s) => Math.min(160, s + 10))}
                    className="px-2 py-0.5 text-xs font-bold hover:bg-slate-500/20 rounded-lg"
                    title="Besarkan Font"
                  >
                    A+
                  </button>
                </div>

                {/* Theme Selector */}
                <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-slate-500/10">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                    title="Tema Terang"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('sepia')}
                    className={`p-1.5 rounded-lg transition-all ${theme === 'sepia' ? 'bg-[#ebd3aa] shadow text-[#5f4b32]' : 'text-slate-500'}`}
                    title="Tema Sepia"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-900 shadow text-white' : 'text-slate-500'}`}
                    title="Tema Gelap"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}

            {/* Direct Download Button */}
            {ebook.file_url && (
              <a
                href={ebook.file_url}
                download
                target="_blank"
                rel="noreferrer"
                className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-500/10 text-slate-600 dark:text-slate-300 transition-colors"
                title="Unduh File E-Book"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-500/10 text-slate-600 dark:text-slate-300 transition-colors"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-red-500/10 text-slate-600 hover:text-red-500 dark:text-slate-300 transition-colors"
              title="Tutup Pembaca"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Body Area */}
        <div className="relative flex-1 overflow-hidden flex">
          {/* TOC Drawer Sidebar (EPUB only) */}
          {viewMode === 'epub' && tocOpen && (
            <div className="w-64 sm:w-72 border-r border-inherit bg-slate-50 dark:bg-slate-900/90 overflow-y-auto p-4 space-y-2 shrink-0 z-20 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-inherit">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Daftar Isi Bab
                </h4>
                <button type="button" onClick={() => setTocOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {tocItems.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Daftar isi otomatis tidak ditemukan.</p>
              ) : (
                <ul className="space-y-1 text-xs">
                  {tocItems.map((item, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => handleTocClick(item.href)}
                        className="w-full text-left p-2 rounded-lg hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate font-medium"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Main Reading View */}
          <div className="relative flex-1 h-full overflow-hidden flex flex-col items-center justify-center">
            {/* 1. EPUB Renderer Container */}
            {viewMode === 'epub' ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-inherit space-y-3 p-6 text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Menyiapkan Buku Digital...
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Mengunduh struktur bab dan mengaktifkan engine pembaca.
                      </p>
                    </div>
                  </div>
                )}

                {errorMsg ? (
                  <div className="p-8 max-w-lg text-center space-y-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        Pemberitahuan Pembaca Digital
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {errorMsg}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setViewMode('cloud')}
                        className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                      >
                        <Cloud className="w-4 h-4" />
                        Buka di Mode Cloud Embed (OneDrive / PDF)
                      </button>

                      {ebook.onedrive_embed_url && (
                        <a
                          href={ebook.onedrive_embed_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                        >
                          Buka di Tab Baru <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div ref={viewerRef} className="w-full h-full p-4 sm:p-8 select-text" />
                )}

                {/* EPUB Navigation Floating Buttons */}
                {!isLoading && !errorMsg && (
                  <>
                    <button
                      type="button"
                      onClick={prevChapter}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110"
                      title="Halaman Sebelumnya (Panah Kiri)"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={nextChapter}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110"
                      title="Halaman Berikutnya (Panah Kanan / Spasi)"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              /* 2. PDF / OneDrive / Cloud Embed Iframe View */
              <div className="w-full h-full flex flex-col bg-slate-950 relative">
                <iframe
                  src={embedSourceUrl}
                  title={ebook.judul}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-inherit text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md font-bold uppercase text-[9px] bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Format: {ebook.format_file.toUpperCase()}
            </span>
            {ebook.jumlah_halaman && (
              <span className="hidden sm:inline font-mono">
                {ebook.jumlah_halaman} Halaman
              </span>
            )}
          </div>

          <div className="text-center font-mono text-[11px]">
            {viewMode === 'epub' && currentLocation ? currentLocation : ebook.kategori}
          </div>

          <div className="flex items-center gap-2">
            {ebook.onedrive_embed_url && (
              <a
                href={ebook.onedrive_embed_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-500 inline-flex items-center gap-1 font-semibold"
              >
                <span>Buka di OneDrive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
