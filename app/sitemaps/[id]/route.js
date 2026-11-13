import {
  SITE_URL, SITE_NAME, SECTION_META,
  fetchVideos, fetchPornstars, fetchCategoryStats, fetchCountryStats,
  videoUrl, modelUrl, clean, extractEmbedUrl,
} from '../../lib/seo';

export const dynamic = 'force-dynamic';

const PER_SITEMAP = 5000; // videos per sitemap file
const API_LIMIT = 100;    // backend max page size

const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const iso = (d) => {
  try {
    const dt = d ? new Date(d) : new Date();
    return isNaN(dt.getTime()) ? new Date().toISOString() : dt.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

// Convert "MM:SS" or "HH:MM:SS" to total seconds (with deterministic fallback for empty durations)
function durationSeconds(d, fallbackSeed = '') {
  if (d) {
    const parts = String(d).trim().split(':').map((n) => parseInt(n, 10));
    if (!parts.some(isNaN)) {
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      if (parts.length === 2) return parts[0] * 60 + parts[1];
    }
  }
  let h = 0;
  const s = String(fallbackSeed || 'video');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (5 + (h % 14)) * 60 + (h % 60);
}

function urlTag({ loc, lastmod, changefreq, priority, image, title, video }) {
  const videoXml = video && video.thumbnail ? [
    '    <video:video>',
    `      <video:thumbnail_loc>${esc(video.thumbnail)}</video:thumbnail_loc>`,
    `      <video:title>${esc(clean(video.title || title, 100))}</video:title>`,
    `      <video:description>${esc(clean(video.description || `Watch ${video.title || title} free in HD on ${SITE_NAME}.`, 300))}</video:description>`,
    video.playerLoc ? `      <video:player_loc allow_embed="yes">${esc(video.playerLoc)}</video:player_loc>` : '',
    video.duration ? `      <video:duration>${video.duration}</video:duration>` : '',
    video.pubDate ? `      <video:publication_date>${iso(video.pubDate)}</video:publication_date>` : '',
    '      <video:family_friendly>no</video:family_friendly>',
    video.views != null ? `      <video:view_count>${Number(video.views) || 0}</video:view_count>` : '',
    video.category ? `      <video:category>${esc(clean(video.category, 60))}</video:category>` : '',
    '    </video:video>',
  ].filter(Boolean).join('\n') : '';

  return [
    '  <url>',
    `    <loc>${esc(loc)}</loc>`,
    lastmod ? `    <lastmod>${iso(lastmod)}</lastmod>` : '',
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
    priority != null ? `    <priority>${priority}</priority>` : '',
    image ? `    <image:image><image:loc>${esc(image)}</image:loc>${title ? `<image:title>${esc(clean(title, 100))}</image:title>` : ''}</image:image>` : '',
    videoXml,
    '  </url>',
  ].filter(Boolean).join('\n');
}

// /sitemaps/0.xml = pages, categories, countries, pornstars | /sitemaps/1.xml, 2.xml ... = videos
export async function GET(_req, { params }) {
  const { id } = await params;
  const sid = parseInt(String(id).replace(/\.xml$/, ''), 10);
  if (isNaN(sid) || sid < 0) return new Response('Not found', { status: 404 });

  const now = new Date();
  let entries = [];

  if (sid === 0) {
    const [cats, countries, stars] = await Promise.all([fetchCategoryStats(), fetchCountryStats(), fetchPornstars()]);
    entries.push({ loc: `${SITE_URL}/`, lastmod: now, changefreq: 'hourly', priority: 1.0 });
    Object.keys(SECTION_META).forEach((p) => {
      const isMain = ['categories', 'countries', 'pornstars'].includes(p);
      entries.push({
        loc: `${SITE_URL}/?page=${p}`,
        lastmod: now,
        changefreq: isMain ? 'daily' : 'monthly',
        priority: isMain ? 0.8 : 0.4,
      });
    });
    (cats || []).forEach((c) => {
      const name = c.name || c._id || c.category;
      if (name) entries.push({ loc: `${SITE_URL}/?q=${encodeURIComponent(name)}`, lastmod: now, changefreq: 'daily', priority: 0.7 });
    });
    (countries || []).filter((c) => c.count > 0).forEach((c) =>
      entries.push({ loc: `${SITE_URL}/?country=${encodeURIComponent(c.code)}`, lastmod: now, changefreq: 'daily', priority: 0.6 }));
    (stars || []).forEach((p) => {
      if (p.slug) entries.push({ loc: modelUrl(p.slug), lastmod: p.updatedAt || now, changefreq: 'weekly', priority: 0.7, image: p.avatar, title: p.name });
    });
  } else {
    const pagesPerSitemap = PER_SITEMAP / API_LIMIT;
    const startPage = (sid - 1) * pagesPerSitemap + 1;
    const pageNums = Array.from({ length: pagesPerSitemap }, (_, i) => startPage + i);
    const results = await Promise.all(pageNums.map((page) => fetchVideos({ page, limit: API_LIMIT, sort: 'latest' })));
    entries = results.flatMap((r) => r?.videos || []).map((v) => ({
      loc: videoUrl(v),
      lastmod: v.updatedAt || v.$updatedAt || v.createdAt || v.$createdAt || now,
      changefreq: 'weekly',
      priority: 0.9,
      image: v.image,
      title: v.title,
      video: {
        thumbnail: v.image,
        title: v.title,
        description: v.description,
        playerLoc: extractEmbedUrl(v.embedUrl),
        duration: durationSeconds(v.duration, v.$id || v._id || v.slug),
        pubDate: v.createdAt || v.$createdAt || now,
        views: v.views,
        category: v.category,
      },
    }));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.map(urlTag).join('\n')}
</urlset>
`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
  });
}
