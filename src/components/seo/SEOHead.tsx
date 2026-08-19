import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  schema?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Aji Bagus Khoiri, S.Pd. - Media Pembelajaran PAI & Turats Digital',
  description = 'Portal edukasi Pendidikan Agama Islam (PAI) Fase D Kurikulum Merdeka, Google Certified Educator, modul ajar interaktif, dan proyek terjemahan kitab turats.',
  image = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
  url = typeof window !== 'undefined' ? window.location.href : 'https://aji-pai.sch.id',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Aji Bagus Khoiri, S.Pd.',
  tags,
  schema,
}) => {
  const fullTitle = title.includes('Aji Bagus Khoiri') ? title : `${title} | Aji Bagus Khoiri`;

  // Default JSON-LD
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebSite',
    name: fullTitle,
    headline: title,
    description: description,
    image: image,
    url: url,
    author: {
      '@type': 'Person',
      name: author,
      url: typeof window !== 'undefined' ? window.location.origin : 'https://aji-pai.sch.id',
      jobTitle: 'Pendidik Agama Islam & Google Certified Educator',
    },
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
  };

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {author && <meta name="author" content={author} />}
      {tags && tags.length > 0 && <meta name="keywords" content={tags.join(', ')} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Portal Pembelajaran PAI Aji Bagus Khoiri" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>
    </Helmet>
  );
};
