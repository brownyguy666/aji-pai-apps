import React, { useState } from 'react';
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { parseCloudEmbedUrl } from '../../lib/embedHelper';
import { Button } from './Button';
import { Modal } from './Modal';

export interface CloudEmbedViewerProps {
  url: string;
  title?: string;
  height?: string | number;
  className?: string;
  allowFullscreen?: boolean;
}

export const CloudEmbedViewer: React.FC<CloudEmbedViewerProps> = ({
  url,
  title = 'Pratinjau Dokumen / Media',
  height = 550,
  className = '',
  allowFullscreen = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const embedInfo = parseCloudEmbedUrl(url);

  if (!url || !embedInfo.embedUrl) {
    return (
      <div className="p-8 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Tautan pratinjau belum tersedia atau format tidak valid.
        </p>
      </div>
    );
  }

  const getProviderBadge = () => {
    switch (embedInfo.provider) {
      case 'gdrive':
        return 'Google Drive';
      case 'gslides':
        return 'Google Slides';
      case 'gdocs':
        return 'Google Docs';
      case 'gsheets':
        return 'Google Sheets';
      case 'gforms':
        return 'Google Form';
      case 'onedrive':
      case 'office':
        return 'Microsoft OneDrive';
      case 'canva':
        return 'Canva';
      case 'youtube':
        return 'YouTube';
      case 'pdf':
        return 'PDF Document';
      default:
        return 'Dokumen Cloud';
    }
  };

  const iframeContent = (
    <div className={`relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md ${className}`}>
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-600 text-white">
            {getProviderBadge()}
          </span>
          <span className="text-xs font-semibold text-slate-200 truncate">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsLoading(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Muat Ulang"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {allowFullscreen && (
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Layar Penuh"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          <a
            href={embedInfo.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-xs font-semibold"
            title="Buka di Tab Baru"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div
        className="relative w-full bg-slate-950 flex items-center justify-center"
        style={{ height: isFullscreen ? 'calc(85vh - 50px)' : height }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900 text-white space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
            <p className="text-xs text-slate-400 font-medium">Memuat pratinjau dokumen...</p>
          </div>
        )}

        <iframe
          src={embedInfo.embedUrl}
          title={title}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );

  return (
    <>
      {iframeContent}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <Modal
          isOpen={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          title={title}
          description={`Sumber: ${getProviderBadge()}`}
          size="full"
        >
          <div className="w-full h-[80vh] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <iframe
              src={embedInfo.embedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export interface EmbedModalViewerProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

export const EmbedModalViewer: React.FC<EmbedModalViewerProps> = ({
  isOpen,
  onClose,
  url,
  title = 'Pratinjau Dokumen / Media',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <div className="pt-2">
        <CloudEmbedViewer url={url} title={title} height={600} />
      </div>
    </Modal>
  );
};
