// Server-side helpers used for SEO (metadata, JSON-LD, sitemap, crawlable HTML).
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = 'AdultXTube';
export const DEFAULT_TITLE = 'AdultXTube - Premium Videos';
export const DEFAULT_DESCRIPTION =
  'AdultXTube - Premium content gallery platform. Browse curated photo and video collections.';

async function getJson(path, revalidate = 300) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
      next: { revalidate },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const fetchVideo = (slug) => getJson(`/videos/${encodeURIComponent(slug)}`);
export const fetchPornstar = (slug, { page = 1, limit = 24 } = {}) =>
  getJson(`/pornstars/${encodeURIComponent(slug)}?page=${page}&limit=${limit}`);
export const fetchPornstars = () => getJson('/pornstars', 3600);
export const fetchCategoryStats = () => getJson('/categories/stats', 3600);
export const fetchCountryStats = () => getJson('/countries/stats', 3600);
export const fetchCategoryLatestSections = () => getJson('/categories/latest-sections', 600);

export function fetchVideos({ page = 1, limit = 20, country = '', search = '', sort = 'latest' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (country && country !== 'ALL') params.set('country', country);
  if (search) params.set('search', search);
  if (sort) params.set('sort', sort);
  return getJson(`/videos?${params}`, 120);
}

export const videoUrl = (v) => `${SITE_URL}/?video=${encodeURIComponent(v.slug || v.$id || v._id)}`;
export const modelUrl = (slug) => `${SITE_URL}/?model=${encodeURIComponent(slug)}`;

export function clean(text = '', max = 160) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

// Parse embedUrl which may be stored as a JSON string array '["https://..."]' or raw iframe HTML
export function extractEmbedUrl(rawEmbed) {
  if (!rawEmbed) return undefined;
  let u = String(rawEmbed).trim();
  if (u.startsWith('[')) {
    try {
      const parsed = JSON.parse(u);
      if (Array.isArray(parsed) && parsed.length > 0) u = String(parsed[0]).trim();
    } catch {
      // keep raw
    }
  }
  if (u.toLowerCase().includes('<iframe')) {
    const match = u.match(/src=["']([^"']+)["']/i);
    if (match) u = match[1];
  }
  return u || undefined;
}

// "12:34" or "1:02:03" -> ISO 8601 "PT12M34S"
export function isoDuration(d, fallbackSeed = '') {
  let raw = d;
  if (!raw && fallbackSeed) {
    const sum = String(fallbackSeed).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mins = 4 + (sum % 16);
    const secs = 10 + (sum % 50);
    raw = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  if (!raw) return 'PT10M24S';
  const parts = String(raw).split(':').map((n) => parseInt(n, 10));
  if (parts.some(isNaN)) return 'PT10M24S';
  while (parts.length < 3) parts.unshift(0);
  const [h, m, s] = parts;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s}S`;
}

export const SECTION_META = {
  categories: { title: 'Categories', description: 'Browse all adult video categories on AdultXTube.' },
  countries: { title: 'Countries', description: 'Browse adult videos organized by country and region.' },
  pornstars: { title: 'Pornstars', description: 'Browse popular pornstars and models on AdultXTube.' },
  terms: {
    title: 'Terms & Conditions',
    description: 'Terms and Conditions governing access to AdultXTube.',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'How AdultXTube safeguards your privacy with zero IP address logging.',
  },
  '2257': {
    title: '18 U.S.C. 2257 Record-Keeping Statement',
    description: '18 U.S.C. 2257 compliance and record-keeping statement for AdultXTube.',
  },
  dmca: {
    title: 'DMCA Notice of Copyright Infringement',
    description: 'Information for copyright owners and DMCA takedown procedures on AdultXTube.',
  },
  'parental-controls': {
    title: 'Parental Controls',
    description: 'Guidance and tools for parents and guardians to block adult content across devices.',
  },
  'content-removal': {
    title: 'Content Removal Policy',
    description: 'How to submit an expedited content removal request on AdultXTube.',
  },
  'community-guidelines': {
    title: 'Community Guidelines',
    description: 'Standards for acceptable content, zero-tolerance policies, and safety on AdultXTube.',
  },
  moderation: {
    title: 'Content Moderation',
    description: 'How AdultXTube screens, monitors, and moderates indexed content.',
  },
  authorities: {
    title: 'Official Requests & Authorities Guide',
    description: 'Operational guidelines for law enforcement agencies and government regulators.',
  },
  support: {
    title: 'Help & Customer Support',
    description: 'Contact AdultXTube customer support, DMCA desk, or content removal team.',
  },
};


