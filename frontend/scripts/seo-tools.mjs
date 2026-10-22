import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const BASE_URL = 'https://www.shailrajtravels.com';
const today = new Date().toISOString().split('T')[0];

/**
 * Fetch Google Autocomplete suggestions for a query
 */
export async function getGoogleSuggestions(keyword) {
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=en-IN&q=${encodeURIComponent(keyword)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data[1]) ? data[1] : [];
  } catch (err) {
    console.error(`Failed to fetch suggestions for "${keyword}":`, err.message);
    return [];
  }
}

/**
 * Expand keywords with intent modifiers (pricing, route, timings, vehicles)
 */
export async function expandKeywordCluster(seed) {
  console.log(`\n🔍 Performing deep keyword expansion for: "${seed}"...\n`);
  
  const results = new Map();
  const baseSuggestions = await getGoogleSuggestions(seed);
  baseSuggestions.forEach((s) => results.set(s, 'Base Suggestions'));

  const modifiers = [
    'cost',
    'price',
    'tour package',
    'itinerary',
    'car rental',
    'urbania',
    'innova',
    'darshan timings',
    'best time to visit',
    'for senior citizens',
    'family trip',
    'reviews',
    '2 days',
    '3 days'
  ];

  for (const mod of modifiers) {
    const query = `${seed} ${mod}`;
    const suggestions = await getGoogleSuggestions(query);
    suggestions.forEach((s) => {
      if (!results.has(s)) {
        results.set(s, mod);
      }
    });
  }

  // Alpha expansion for long-tail
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'p', 't', 'u'];
  for (const char of alphabet) {
    const query = `${seed} ${char}`;
    const suggestions = await getGoogleSuggestions(query);
    suggestions.forEach((s) => {
      if (!results.has(s)) {
        results.set(s, `Alpha: ${char}`);
      }
    });
  }

  console.log(`✅ Discovered ${results.size} high-intent search keywords:\n`);
  const categorized = {
    Commercial_Booking: [],
    Informational_Guides: [],
    Logistics_Vehicle: [],
    General: []
  };

  for (const [kw] of results.entries()) {
    const l = kw.toLowerCase();
    if (l.includes('package') || l.includes('cost') || l.includes('price') || l.includes('booking') || l.includes('rate')) {
      categorized.Commercial_Booking.push(kw);
    } else if (l.includes('darshan') || l.includes('timing') || l.includes('itinerary') || l.includes('distance') || l.includes('route')) {
      categorized.Informational_Guides.push(kw);
    } else if (l.includes('urbania') || l.includes('car') || l.includes('bus') || l.includes('innova') || l.includes('cab') || l.includes('rental')) {
      categorized.Logistics_Vehicle.push(kw);
    } else {
      categorized.General.push(kw);
    }
  }

  return categorized;
}

/**
 * Re-generate complete sitemap.xml including core pages, tours, blogs, comparisons, facts, and resources
 */
export function buildEnhancedSitemap() {
  console.log('\n🗺️  Building comprehensive sitemap.xml...');

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

  // Helper to extract slugs with regex from ts/js files
  function extractSlugsFromFile(filePath, regex) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const matches = [...content.matchAll(regex)].map((m) => m[1]);
        return [...new Set(matches)];
      }
    } catch (e) {
      console.warn(`Warning reading ${filePath}:`, e.message);
    }
    return [];
  }

  const tourSlugs = extractSlugsFromFile(
    path.join(rootDir, 'src', 'backend', 'shared', 'seed-data.ts'),
    /"slug":\s*"([^"]+)"/g
  );

  const blogSlugs = extractSlugsFromFile(
    path.join(rootDir, 'src', 'frontend', 'shared', 'data', 'blogs.ts'),
    /slug:\s*['"]([^'"]+)['"]/g
  );

  const comparisonSlugs = extractSlugsFromFile(
    path.join(rootDir, 'src', 'frontend', 'shared', 'data', 'comparisons.ts'),
    /slug:\s*['"]([^'"]+)['"]/g
  );

  const factSlugs = extractSlugsFromFile(
    path.join(rootDir, 'src', 'frontend', 'shared', 'data', 'facts.ts'),
    /slug:\s*['"]([^'"]+)['"]/g
  );

  const resourceSlugs = extractSlugsFromFile(
    path.join(rootDir, 'src', 'frontend', 'shared', 'data', 'resources.ts'),
    /slug:\s*['"]([^'"]+)['"]/g
  );

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

  // Comparison pages (AEO High-Intent)
  for (const slug of comparisonSlugs) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/compare/${slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.80</priority>\n`;
    xml += `  </url>\n\n`;
  }

  // Fact pages (AEO Authority/Stat)
  for (const slug of factSlugs) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/facts/${slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.75</priority>\n`;
    xml += `  </url>\n\n`;
  }

  // Resource pages (Traveler Checklists & Guides)
  for (const slug of resourceSlugs) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/resources/${slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.80</priority>\n`;
    xml += `  </url>\n\n`;
  }

  // Offers
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}/offers/pune-to-lalbag-raja-darshan</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.80</priority>\n`;
  xml += `  </url>\n\n`;

  xml += `</urlset>\n`;

  const targetPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(targetPath, xml, 'utf8');
  console.log(`✅ Generated comprehensive sitemap at: ${targetPath}`);
  console.log(`📊 Statistics:
  - Core Pages: ${coreRoutes.length + 1}
  - Tour Slugs: ${tourSlugs.length}
  - Blog Slugs: ${blogSlugs.length}
  - Comparisons: ${comparisonSlugs.length}
  - Facts: ${factSlugs.length}
  - Resources: ${resourceSlugs.length}
  - Total URLs: ${coreRoutes.length + 1 + tourSlugs.length + blogSlugs.length + comparisonSlugs.length + factSlugs.length + resourceSlugs.length + 1}
  `);
}

// CLI Execution handler
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'sitemap';

  if (command === 'sitemap') {
    buildEnhancedSitemap();
  } else if (command === 'keywords') {
    const seed = args[1] || 'pune to ujjain';
    const clusters = await expandKeywordCluster(seed);
    console.log('📌 Commercial & Booking Keywords:\n', clusters.Commercial_Booking);
    console.log('\n📖 Informational & Guide Keywords:\n', clusters.Informational_Guides);
    console.log('\n🚐 Vehicle & Logistics Keywords:\n', clusters.Logistics_Vehicle);
    console.log('\n🌐 Additional Suggestions:\n', clusters.General);
  } else {
    console.log(`
Usage:
  node scripts/seo-tools.mjs sitemap           # Build upgraded sitemap.xml with all routes
  node scripts/seo-tools.mjs keywords <query>  # Expand seed keyword into clusters
    `);
  }
}

main().catch(console.error);
