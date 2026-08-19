import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BentoProfileCard } from './BentoProfileCard';
import { BentoEbookCard } from './BentoEbookCard';
import { BentoTerjemahanCard } from './BentoTerjemahanCard';
import { BentoSertifikasiCard } from './BentoSertifikasiCard';
import { BentoStatistikCard } from './BentoStatistikCard';
import { BentoHikmahCard } from './BentoHikmahCard';
import { BentoSandboxDock } from './BentoSandboxDock';
import { InteractiveParticleCanvas } from './InteractiveParticleCanvas';
import { useThemeAccent } from '../../context/ThemeAccentContext';

export interface BentoGridShowcaseProps {
  onSwitchToClassic?: () => void;
}

export const BentoGridShowcase: React.FC<BentoGridShowcaseProps> = () => {
  const { theme } = useThemeAccent();
  const [layoutMode, setLayoutMode] = useState<'bento' | 'classic'>('bento');

  const [visibleModules, setVisibleModules] = useState({
    profile: true,
    ebook: true,
    terjemahan: true,
    sertifikasi: true,
    statistik: true,
    hikmah: true,
  });

  const toggleModule = (key: keyof typeof visibleModules) => {
    setVisibleModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="relative overflow-hidden py-8 md:py-16 transition-colors duration-300">
      {/* Interactive Constellation Particle Canvas */}
      <InteractiveParticleCanvas />

      {/* Ambient Radial Gradient Background Blobs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-15 pointer-events-none -z-10 transition-all duration-700"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="absolute bottom-10 right-10 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none -z-10 transition-all duration-700"
        style={{ backgroundColor: theme.secondary }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Floating Modular Sandbox Toolbar */}
        <BentoSandboxDock
          layoutMode={layoutMode}
          setLayoutMode={setLayoutMode}
          visibleModules={visibleModules}
          toggleModule={toggleModule}
        />

        {/* Dynamic Layout Rendering */}
        <AnimatePresence mode="wait">
          {layoutMode === 'bento' ? (
            /* Bento Grid Mode (Apple / Linear Modular Layout) */
            <motion.div
              key="bento-grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[minmax(180px,auto)]"
            >
              {/* Card 1: Master Profile (2x2) */}
              {visibleModules.profile && <BentoProfileCard />}

              {/* Card 2: E-Book Spotlight (2x1) */}
              {visibleModules.ebook && <BentoEbookCard />}

              {/* Card 3: Proyek Terjemahan Kitab (1x2) */}
              {visibleModules.terjemahan && <BentoTerjemahanCard />}

              {/* Card 4: Sertifikasi Google (1x1) */}
              {visibleModules.sertifikasi && <BentoSertifikasiCard />}

              {/* Card 5: Live Radar Statistik (1x1) */}
              {visibleModules.statistik && <BentoStatistikCard />}

              {/* Card 6: Hikmah & Modul Ajar (2x1) */}
              {visibleModules.hikmah && <BentoHikmahCard />}
            </motion.div>
          ) : (
            /* Classic Linear Stack Mode */
            <motion.div
              key="classic-stack"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              {visibleModules.profile && <BentoProfileCard />}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleModules.ebook && <BentoEbookCard />}
                {visibleModules.terjemahan && <BentoTerjemahanCard />}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleModules.sertifikasi && <BentoSertifikasiCard />}
                {visibleModules.statistik && <BentoStatistikCard />}
              </div>
              {visibleModules.hikmah && <BentoHikmahCard />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
