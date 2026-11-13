import ClientShell from './ClientShell';
import {
  SITE_URL, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, SECTION_META,
  fetchVideo, fetchVideos, fetchPornstar, fetchPornstars, fetchCategoryStats, fetchCountryStats, fetchCategoryLatestSections,
  videoUrl, modelUrl, clean, isoDuration, extractEmbedUrl,
} from './lib/seo';

// Rendered on the server for every request so each URL gets its own HTML + meta tags.
export const dynamic = 'force-dynamic';

function readParams(sp = {}) {
  const get = (k) => (Array.isArray(sp[k]) ? sp[k][0] : sp[k]) || '';
  return {
    video: get('video') || get('player'),
    model: get('model') || get('star'),
    section: get('page'),
    q: get('q'),
    country: (get('country') || 'ALL').toUpperCase(),
    p: Math.max(1, parseInt(get('p'), 10) || 1),
    sort: get('sort') || 'latest',
  };
}

function canonicalFor(s) {
  const u = new URLSearchParams();
  if (s.video) u.set('video', s.video);
  else if (s.model) u.set('model', s.model);
  else if (s.section) u.set('page', s.section);
  else {
    if (s.q) u.set('q', s.q);
    if (s.country && s.country !== 'ALL') u.set('country', s.country);
    if (s.p > 1) u.set('p', String(s.p));
  }
  const qs = u.toString();
  return qs ? `${SITE_URL}/?${qs}` : `${SITE_URL}/`;
}

const safeIsoDate = (d) => {
  try {
    const dt = d ? new Date(d) : new Date();
    return isNaN(dt.getTime()) ? new Date().toISOString() : dt.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

export async function generateMetadata({ searchParams }) {
  const s = readParams(await searchParams);
  // Canonical + og:url are added manually in <Page> (Next's metadata API strips "?query" on "/").
  const base = { openGraph: { siteName: SITE_NAME } };

  if (s.video) {
    const v = await fetchVideo(s.video);
    if (v) {
      const title = `${clean(v.title, 90)} - ${SITE_NAME}`;
      const description = clean(
        v.description ||
        `Watch ${v.title} free in HD on ${SITE_NAME}.${v.category ? ` Category: ${v.category}.` : ''}${v.pornstar ? ` Featuring: ${v.pornstar}.` : ''}`
      );
      const embedUrl = extractEmbedUrl(v.embedUrl);
      return {
        ...base,
        title,
        description,
        keywords: [v.category, v.pornstar, SITE_NAME, 'free hd videos'].filter(Boolean),
        openGraph: {
          ...base.openGraph,
          type: 'video.other',
          title,
          description,
          images: v.image ? [{ url: v.image, alt: v.title }] : undefined,
          videos: embedUrl ? [{ url: embedUrl }] : undefined,
        },
        twitter: { card: 'summary_large_image', title, description, images: v.image ? [v.image] : undefined },
      };
    }
    return { ...base, title: `Video not found - ${SITE_NAME}`, robots: { index: false, follow: true } };
  }

  if (s.model) {
    const data = await fetchPornstar(s.model);
    const star = data?.pornstar;
    if (star) {
      const title = `${star.name} Porn Videos - ${SITE_NAME}`;
      const description = clean(star.description || `Watch ${star.videoCount || ''} free HD videos of ${star.name} on ${SITE_NAME}.`);
      return {
        ...base, title, description,
        keywords: [star.name, `${star.name} videos`, SITE_NAME].filter(Boolean),
        openGraph: { ...base.openGraph, type: 'profile', title, description, images: star.avatar ? [{ url: star.avatar, alt: star.name }] : undefined },
        twitter: { card: 'summary_large_image', title, description, images: star.avatar ? [star.avatar] : undefined },
      };
    }
  }

  if (s.section && SECTION_META[s.section]) {
    const m = SECTION_META[s.section];
    const title = `${m.title} - ${SITE_NAME}`;
    const description = m.description || DEFAULT_DESCRIPTION;
    return { ...base, title, description, openGraph: { ...base.openGraph, title, description } };
  }

  if (s.q || s.country !== 'ALL') {
    const parts = [s.q && `${s.q} Videos`, s.country !== 'ALL' && `from ${s.country}`].filter(Boolean).join(' ');
    const title = `${parts}${s.p > 1 ? ` - Page ${s.p}` : ''} - ${SITE_NAME}`;
    const description = `Watch the latest free HD ${parts} on ${SITE_NAME}. Updated daily.`;
    return { ...base, title, description, openGraph: { ...base.openGraph, title, description } };
  }

  return {
    ...base,
    title: s.p > 1 ? `${DEFAULT_TITLE} - Page ${s.p}` : DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  };
}

const srOnly = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
};

function VideoList({ videos = [] }) {
  if (!videos.length) return null;
  return (
    <ul>
      {videos.map((v) => (
        <li key={v.$id || v._id || v.slug}>
          <a href={videoUrl(v)}>
            {v.image ? <img src={v.image} alt={v.title} loading="lazy" /> : null}
            <span>{v.title}</span>
          </a>
          {v.duration ? <span> ({v.duration})</span> : null}
          {v.category ? <> — <a href={`${SITE_URL}/?q=${encodeURIComponent(v.category)}`}>{v.category}</a></> : null}
        </li>
      ))}
    </ul>
  );
}

function SiteFooterNav() {
  return (
    <nav aria-label="Site navigation">
      <a href={`${SITE_URL}/`}>Home</a>
      <a href={`${SITE_URL}/?page=categories`}>Categories</a>
      <a href={`${SITE_URL}/?page=countries`}>Countries</a>
      <a href={`${SITE_URL}/?page=pornstars`}>Pornstars</a>
      <a href={`${SITE_URL}/?page=terms`}>Terms of Service</a>
      <a href={`${SITE_URL}/?page=privacy`}>Privacy Policy</a>
      <a href={`${SITE_URL}/?page=2257`}>18 U.S.C. 2257</a>
      <a href={`${SITE_URL}/?page=dmca`}>DMCA / Copyright</a>
      <a href={`${SITE_URL}/?page=parental-controls`}>Parental Controls</a>
      <a href={`${SITE_URL}/?page=content-removal`}>Content Removal</a>
      <a href={`${SITE_URL}/?page=community-guidelines`}>Community Guidelines</a>
      <a href={`${SITE_URL}/?page=support`}>Support</a>
    </nav>
  );
}

async function buildSeo(s) {
  let jsonLd = null;
  let body = null;

  if (s.video) {
    const v = await fetchVideo(s.video);
    if (v) {
      const embedUrl = extractEmbedUrl(v.embedUrl);
      const vidUrl = videoUrl(v);
      const videoSchema = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: v.title,
        description: clean(v.description || `Watch ${v.title} free in HD on ${SITE_NAME}.`, 300),
        thumbnailUrl: v.image ? [v.image] : [`${SITE_URL}/logo.png`],
        uploadDate: safeIsoDate(v.createdAt || v.$createdAt),
        duration: isoDuration(v.duration, v.$id || v._id || v.slug),
        embedUrl: embedUrl || vidUrl,
        contentUrl: embedUrl || undefined,
        url: vidUrl,
        isFamilyFriendly: false,
        genre: v.category || undefined,
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: { '@type': 'WatchAction' },
          userInteractionCount: Number(v.views) || 0,
        },
      };
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
          ...(v.category ? [{ '@type': 'ListItem', position: 2, name: v.category, item: `${SITE_URL}/?q=${encodeURIComponent(v.category)}` }] : []),
          { '@type': 'ListItem', position: v.category ? 3 : 2, name: v.title, item: vidUrl },
        ],
      };
      jsonLd = [videoSchema, breadcrumbSchema];

      const related = await fetchVideos({ search: v.category && v.category !== 'General' ? v.category : '', limit: 24 });
      body = (
        <article>
          <h1>{v.title}</h1>
          {v.image ? <img src={v.image} alt={v.title} /> : null}
          <p>{v.description || `Watch ${v.title} free in HD on ${SITE_NAME}.`}</p>
          <p>
            {v.category ? <>Category: <a href={`${SITE_URL}/?q=${encodeURIComponent(v.category)}`}>{v.category}</a>. </> : null}
            {v.pornstar ? <>Pornstar: {v.pornstar}. </> : null}
            {v.duration ? <>Duration: {v.duration}. </> : null}
            Views: {v.views || 0}
          </p>
          <h2>Related videos</h2>
          <VideoList videos={(related?.videos || []).filter((r) => (r.slug || r.$id) !== (v.slug || v.$id))} />
          <SiteFooterNav />
        </article>
      );
    }
  } else if (s.model) {
    const data = await fetchPornstar(s.model);
    if (data?.pornstar) {
      const star = data.pornstar;
      const starUrl = modelUrl(star.slug);
      jsonLd = [
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: star.name,
          image: star.avatar || undefined,
          description: star.description || `Watch ${star.name} videos on ${SITE_NAME}.`,
          url: starUrl,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Pornstars', item: `${SITE_URL}/?page=pornstars` },
            { '@type': 'ListItem', position: 3, name: star.name, item: starUrl },
          ],
        },
      ];
      body = (
        <section>
          <h1>{star.name} Videos</h1>
          {star.description ? <p>{star.description}</p> : null}
          <VideoList videos={data.videos} />
          <SiteFooterNav />
        </section>
      );
    }
  } else if (s.section === 'categories') {
    const cats = (await fetchCategoryStats()) || [];
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Video Categories - ${SITE_NAME}`,
      url: `${SITE_URL}/?page=categories`,
    };
    body = (
      <section>
        <h1>Video Categories</h1>
        <p>{SECTION_META.categories.description}</p>
        <ul>
          {cats.map((c) => {
            const name = c.name || c._id || c.category;
            return name ? <li key={name}><a href={`${SITE_URL}/?q=${encodeURIComponent(name)}`}>{name} ({c.count || 0} videos)</a></li> : null;
          })}
        </ul>
        <SiteFooterNav />
      </section>
    );
  } else if (s.section === 'countries') {
    const countries = (await fetchCountryStats()) || [];
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Videos by Country - ${SITE_NAME}`,
      url: `${SITE_URL}/?page=countries`,
    };
    body = (
      <section>
        <h1>Videos by Country</h1>
        <p>{SECTION_META.countries.description}</p>
        <ul>
          {countries.map((c) => (
            <li key={c.code}>
              <a href={`${SITE_URL}/?country=${encodeURIComponent(c.code)}`}>{c.name}</a> ({c.count || 0} videos)
            </li>
          ))}
        </ul>
        <SiteFooterNav />
      </section>
    );
  } else if (s.section === 'pornstars') {
    const stars = (await fetchPornstars()) || [];
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Pornstars & Models - ${SITE_NAME}`,
      url: `${SITE_URL}/?page=pornstars`,
    };
    body = (
      <section>
        <h1>Pornstars &amp; Models</h1>
        <p>{SECTION_META.pornstars.description}</p>
        <ul>
          {stars.map((p) => (
            <li key={p.slug}>
              <a href={modelUrl(p.slug)}>{p.name}</a> {p.videoCount ? `(${p.videoCount} videos)` : ''}
            </li>
          ))}
        </ul>
        <SiteFooterNav />
      </section>
    );
  } else if (s.section && SECTION_META[s.section]) {
    const m = SECTION_META[s.section];
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${m.title} - ${SITE_NAME}`,
      description: m.description,
      url: `${SITE_URL}/?page=${encodeURIComponent(s.section)}`,
    };
    body = (
      <section>
        <h1>{m.title}</h1>
        <p>{m.description}</p>
        <SiteFooterNav />
      </section>
    );
  } else {
    const data = await fetchVideos({ page: s.p, limit: 20, country: s.country, search: s.q, sort: s.sort });
    const catSections = [];
    const videos = data?.videos || [];
    const totalPages = data?.pagination?.totalPages || 1;
    const pageLink = (n) => {
      const u = new URLSearchParams();
      if (s.q) u.set('q', s.q);
      if (s.country !== 'ALL') u.set('country', s.country);
      if (n > 1) u.set('p', String(n));
      const qs = u.toString();
      return qs ? `${SITE_URL}/?${qs}` : `${SITE_URL}/`;
    };
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: videos.slice(0, 20).map((v, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: videoUrl(v),
        name: v.title,
      })),
    };
    jsonLd = [websiteSchema, itemListSchema];

    const heading = s.q
      ? `${s.q} Videos${s.p > 1 ? ` - Page ${s.p}` : ''}`
      : s.country !== 'ALL'
        ? `Videos from ${s.country}${s.p > 1 ? ` - Page ${s.p}` : ''}`
        : s.p > 1
          ? `${DEFAULT_TITLE} - Page ${s.p}`
          : DEFAULT_TITLE;

    body = (
      <section>
        <h1>{heading}</h1>
        <p>{DEFAULT_DESCRIPTION}</p>
        <VideoList videos={videos} />
        {(catSections || []).map((sec) => (
          <div key={sec.category}>
            <h2><a href={`${SITE_URL}/?q=${encodeURIComponent(sec.category)}`}>{sec.category} Latest Videos</a></h2>
            <VideoList videos={sec.videos} />
          </div>
        ))}
        <nav aria-label="Pagination">
          {s.p > 1 ? <a href={pageLink(s.p - 1)} rel="prev">Previous page</a> : null}
          {Array.from({ length: Math.min(totalPages, 25) }, (_, i) => i + 1).map((n) => (
            <a key={n} href={pageLink(n)}>{`Page ${n}`}</a>
          ))}
          {s.p < totalPages ? <a href={pageLink(s.p + 1)} rel="next">Next page</a> : null}
        </nav>
        <SiteFooterNav />
      </section>
    );
  }

  return { jsonLd, body };
}

export default async function Page({ searchParams }) {
  const s = readParams(await searchParams);
  const { jsonLd, body } = await buildSeo(s);
  const canonical = canonicalFor(s);
  return (
    <>
      {/* React hoists these into <head>. */}
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
      {/* Structured data stays in the DOM permanently (outside the client app). */}
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      ) : null}
      <ClientShell>{body ? <div style={srOnly}>{body}</div> : null}</ClientShell>
    </>
  );
}
