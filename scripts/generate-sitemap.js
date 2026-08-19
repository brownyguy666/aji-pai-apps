import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = process.env.VITE_SITE_URL || 'https://aji-pai.sch.id';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xxeegyireqgxshtazkzh.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__8EFRCMeKAEmSHTa7s0yvA_N9owPTI8';

async function generateSitemap() {
  console.log('Generating sitemap.xml & robots.txt...');

  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/materi', priority: '0.9', changefreq: 'daily' },
    { url: '/ebook', priority: '0.9', changefreq: 'daily' },
    { url: '/terjemahan', priority: '0.8', changefreq: 'weekly' },
    { url: '/karya', priority: '0.8', changefreq: 'weekly' },
  ];

  let dynamicRoutes = [];

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data: materiList, error } = await supabase
      .from('materi_pai')
      .select('slug, updated_at')
      .eq('status', 'published');

    if (!error && materiList && materiList.length > 0) {
      dynamicRoutes = materiList.map((item) => ({
        url: `/materi/${item.slug}`,
        lastmod: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        priority: '0.8',
        changefreq: 'weekly',
      }));
    } else {
      console.log('Using default dynamic routes for sitemap.');
      dynamicRoutes = [
        { url: '/materi/kedudukan-alquran-dan-sunnah-sumber-hukum-an-nisa-59', priority: '0.8', changefreq: 'weekly' },
        { url: '/materi/meneladani-asmaul-husna-al-alim-al-khabir-as-sami-al-bashir', priority: '0.8', changefreq: 'weekly' },
        { url: '/materi/panduan-sujud-sahwi-tilawah-syukur-kelas-7', priority: '0.8', changefreq: 'weekly' },
      ];
    }
  } catch (err) {
    console.warn('Could not query live DB for sitemap, falling back to static routes.');
  }

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.url}</loc>
    ${r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : `<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>`}
    <changefreq>${r.changefreq || 'weekly'}</changefreq>
    <priority>${r.priority || '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const robotsTxt = `# robots.txt for Aji Bagus Khoiri PAI Portal
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/*

Sitemap: ${SITE_URL}/sitemap.xml
`;

  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');

  console.log(`Successfully generated sitemap.xml with ${allRoutes.length} URLs and robots.txt!`);
}

generateSitemap();
