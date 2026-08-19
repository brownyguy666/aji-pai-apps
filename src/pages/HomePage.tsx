import React from 'react';
import { DynamicSectionRenderer } from '../components/sections/DynamicSectionRenderer';
import { SEOHead } from '../components/seo/SEOHead';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Aji Bagus Khoiri, S.Pd. - Media Pembelajaran PAI & Turats Digital"
        description="Portal resmi media pembelajaran Pendidikan Agama Islam (PAI) Fase D SMP, modul ajar interaktif, terjemahan kitab klasik turats, dan sertifikasi Google for Education."
        type="website"
      />
      <div>
        <DynamicSectionRenderer />
      </div>
    </>
  );
};
