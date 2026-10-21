import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const BASE_URL = 'https://www.shailrajtravels.com';
const today = new Date().toISOString().split('T')[0];

const coreRoutes = [
  { url: '/', priority: '1.0', changefreq: 'daily', mr: true },
  { url: '/travel-agency-in-pune', priority: '0.95', changefreq: 'weekly' },
  { url: '/tour-operator-in-pune', priority: '0.95', changefreq: 'weekly' },
  { url: '/tour-packages-from-pune', priority: '0.95', changefreq: 'weekly' },
  { url: '/pilgrimage-tours-from-pune', priority: '0.95', changefreq: 'weekly' },
  { url: '/family-tours-from-pune', priority: '0.85', changefreq: 'weekly' },
  { url: '/group-tours-from-pune', priority: '0.85', changefreq: 'weekly' },
  { url: '/maharashtra-tour-packages', priority: '0.90', changefreq: 'weekly' },
  { url: '/tours', priority: '0.90', changefreq: 'daily' },
  { url: '/pilgrimage-guides', priority: '0.85', changefreq: 'weekly' },
  { url: '/why-choose-shailraj-travels', priority: '0.80', changefreq: 'weekly' },
  { url: '/about-shailraj-travels', priority: '0.80', changefreq: 'monthly' },
  { url: '/gallery', priority: '0.75', changefreq: 'weekly' },
  { url: '/yatri-stories', priority: '0.75', changefreq: 'weekly' },
  { url: '/faq', priority: '0.80', changefreq: 'monthly' },
  { url: '/contact', priority: '0.80', changefreq: 'monthly' },
  { url: '/blog', priority: '0.90', changefreq: 'daily' },
  { url: '/authors', priority: '0.60', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.50', changefreq: 'monthly' },
  { url: '/terms', priority: '0.50', changefreq: 'monthly' },
  { url: '/cancellation-policy', priority: '0.50', changefreq: 'monthly' },
  { url: '/refund-policy', priority: '0.50', changefreq: 'monthly' },
  { url: '/security-policy', priority: '0.50', changefreq: 'monthly' },
];

function extractTourSlugs() {
  try {
    const seedFile = path.join(rootDir, 'src', 'backend', 'shared', 'seed-data.ts');
    if (fs.existsSync(seedFile)) {
      const content = fs.readFileSync(seedFile, 'utf8');
      const matches = [...content.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => m[1]);
      return [...new Set(matches)];
    }
  } catch (e) {
    console.warn('Error reading seed-data:', e.message);
  }
  return [];
}

function extractBlogSlugs() {
  try {
    const blogFile = path.join(rootDir, 'src', 'frontend', 'shared', 'data', 'blogs.ts');
    if (fs.existsSync(blogFile)) {
      const content = fs.readFileSync(blogFile, 'utf8');
      const matches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
      return [...new Set(matches)];
    }
  } catch (e) {
    console.warn('Error reading blogs.ts:', e.message);
  }
  return [];
}

function buildSitemapXml() {
  const tourSlugs = extractTourSlugs();
  const blogSlugs = extractBlogSlugs();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n`;

  // Core pages
  for (const page of coreRoutes) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    if (page.mr) {
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/"/>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="mr" href="${BASE_URL}/mr/"/>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/"/>\n`;
    }
    xml += `  </url>\n\n`;
  }

  // Marathi Home
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}/mr/</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>0.90</priority>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="mr" href="${BASE_URL}/mr/"/>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/"/>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/"/>\n`;
  xml += `  </url>\n\n`;

  // Tour pages
  for (const slug of tourSlugs) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/tours/${slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.90</priority>\n`;
    xml += `  </url>\n\n`;
  }

  // Blog pages
  for (const slug of blogSlugs) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/blog/${slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += `  </url>\n\n`;
  }

  // Offer pages
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}/offers/pune-to-lalbag-raja-darshan</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.80</priority>\n`;
  xml += `  </url>\n\n`;

  xml += `</urlset>\n`;
  return xml;
}

const sitemap = buildSitemapXml();
const targetPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(targetPath, sitemap, 'utf8');
console.log(`[SEO] Successfully generated sitemap.xml at: ${targetPath}`);
