import React from 'react';
import {
  Palette,
  LayoutGrid,
  Sparkles,
  Layers,
  Check,
  Eye,
  Sliders,
} from 'lucide-react';
import { useThemeAccent, ACCENT_THEMES, AccentColor } from '../../context/ThemeAccentContext';

export interface BentoSandboxDockProps {
  layoutMode: 'bento' | 'classic';
  setLayoutMode: (mode: 'bento' | 'classic') => void;
  visibleModules: {
    profile: boolean;
    ebook: boolean;
    terjemahan: boolean;
    sertifikasi: boolean;
    statistik: boolean;
    hikmah: boolean;
  };
  toggleModule: (moduleKey: keyof BentoSandboxDockProps['visibleModules']) => void;
}

export const BentoSandboxDock: React.FC<BentoSandboxDockProps> = ({
  layoutMode,
  setLayoutMode,
  visibleModules,
  toggleModule,
}) => {
  const { accent, setAccent, theme } = useThemeAccent();
  const [showConfig, setShowConfig] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-3 relative z-20 pb-4">
      {/* Floating Pill Dock */}
      <div className="inline-flex items-center gap-1.5 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-900/5">
        
        {/* Accent Color Palette Switcher */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-2 border-r border-slate-200 dark:border-slate-800">
          <Palette className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:inline" />
          {(Object.keys(ACCENT_THEMES) as AccentColor[]).map((col) => {
            const t = ACCENT_THEMES[col];
            const isActive = accent === col;
            return (
              <button
                key={col}
                type="button"
                onClick={() => setAccent(col)}
                className={`group relative p-1 rounded-full transition-transform hover:scale-110 ${
                  isActive ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900' : ''
                }`}
                title={`Ganti Tema Warna: ${t.name}`}
              >
                <span
                  className="block w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-xs transition-transform"
                  style={{ backgroundColor: t.primary }}
                />
              </button>
            );
          })}
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/70 p-0.5 sm:p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setLayoutMode('bento')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              layoutMode === 'bento'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bento Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode('classic')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              layoutMode === 'classic'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Klasik Stack</span>
          </button>
        </div>

        {/* Sandbox Customizer Toggle */}
        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            showConfig
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
          title="Kustomisasi Modul Sandbox"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Kustomisasi</span>
        </button>
      </div>

      {/* Popover Sandbox Module Controls */}
      {showConfig && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200 p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full mx-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Modular Sandbox Controller</span>
            </span>
            <span className="text-[10px] text-slate-400">Nyalakan/matikan kartu grid live</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {[
              { key: 'profile' as const, label: '👤 Profil Utama' },
              { key: 'ebook' as const, label: '📖 E-Book Spotlight' },
              { key: 'terjemahan' as const, label: '🔄 Terjemahan Kitab' },
              { key: 'sertifikasi' as const, label: '🏆 Sertifikasi Google' },
              { key: 'statistik' as const, label: '📊 Live Radar Metrik' },
              { key: 'hikmah' as const, label: '✨ Hikmah & Modul' },
            ].map((m) => {
              const active = visibleModules[m.key];
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => toggleModule(m.key)}
                  className={`p-2 rounded-xl border text-left flex items-center justify-between gap-1 transition-all ${
                    active
                      ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white'
                      : 'border-dashed border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <span className="truncate">{m.label}</span>
                  {active && <Check className="w-3 h-3 text-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
