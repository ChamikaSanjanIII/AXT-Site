import { SITE_URL, fetchVideos } from '../lib/seo';

export const dynamic = 'force-dynamic';

// Sitemap index -> /sitemaps/sitemap/0.xml (pages), /sitemaps/sitemap/1.xml ... (videos)
export async function GET() {
  const first = await fetchVideos({ page: 1, limit: 1 });
  const total = first?.pagination?.total || 0;
  const count = Math.max(1, Math.ceil(total / 5000)) + 1;
  const now = new Date().toISOString();

  const items = Array.from({ length: count }, (_, id) =>
    `  <sitemap><loc>${SITE_URL}/sitemaps/${id}.xml</loc><lastmod>${now}</lastmod></sitemap>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

