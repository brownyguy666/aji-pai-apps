import React from 'react';
import { useSections } from '../../hooks/useSections';
import { HeroSection } from './HeroSection';
import { SertifikasiSection } from './SertifikasiSection';
import { MateriSection } from './MateriSection';
import { YouTubeSection } from './YouTubeSection';
import { TerjemahanSection } from './TerjemahanSection';
import { KaryaSection } from './KaryaSection';
import { ContactSection } from './ContactSection';

export const DynamicSectionRenderer: React.FC = () => {
  const { activeSections, isLoading } = useSections();

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const renderSectionComponent = (key: string) => {
    switch (key) {
      case 'hero':
        return <HeroSection key="hero" />;
      case 'sertifikasi':
        return <SertifikasiSection key="sertifikasi" />;
      case 'materi':
        return <MateriSection key="materi" />;
      case 'youtube':
        return <YouTubeSection key="youtube" />;
      case 'terjemahan':
        return <TerjemahanSection key="terjemahan" />;
      case 'karya':
        return <KaryaSection key="karya" />;
      case 'kontak':
        return <ContactSection key="kontak" />;
      default:
        return null;
    }
  };

  return (
    <div>
      {activeSections
        .sort((a, b) => a.urutan - b.urutan)
        .map((section) => renderSectionComponent(section.key))}
    </div>
  );
};
