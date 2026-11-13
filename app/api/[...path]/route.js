export const dynamic = 'force-dynamic';

const UPSTREAMS = [
  (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api1.clipgo.xyz/api').replace(/\/+$/, ''),
  'http://127.0.0.1:5001/api',
  'http://127.0.0.1:5000/api',
];

async function proxy(req, context) {
  const { path = [] } = await context.params;
  const subPath = Array.isArray(path) ? path.join('/') : String(path || '');
  const search = new URL(req.url).search || '';

  const init = {
    method: req.method,
    headers: {
      Accept: 'application/json',
      'User-Agent': req.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    },
    cache: 'no-store',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const contentType = req.headers.get('content-type');
    if (contentType) init.headers['Content-Type'] = contentType;
    const bodyText = await req.text();
    if (bodyText) init.body = bodyText;
  }

  let lastStatus = 502;
  let lastText = '';

  for (const base of UPSTREAMS) {
    const targetUrl = `${base}/${subPath}${search}`;
    try {
      const res = await fetch(targetUrl, init);
      if (res.ok) {
        const data = await res.text();
        return new Response(data, {
          status: res.status,
          headers: {
            'Content-Type': res.headers.get('content-type') || 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        });
      }
      lastStatus = res.status;
      lastText = await res.text().catch(() => '');
    } catch (err) {
      lastText = err?.message || 'Upstream fetch failed';
    }
  }

  // Graceful fallback so the UI doesn't crash with 500 when upstream VPS is down or unreachable
  if (req.method === 'GET') {
    if (subPath === 'videos') {
      return Response.json(
        { videos: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 }, upstreamStatus: lastStatus, upstreamError: lastText.slice(0, 200) },
        { status: 200, headers: { 'X-Upstream-Status': String(lastStatus) } }
      );
    }
    if (subPath === 'categories/stats' || subPath === 'countries/stats' || subPath === 'categories/latest-sections' || subPath === 'pornstars' || subPath === 'videos/suggestions') {
      return Response.json([], { status: 200, headers: { 'X-Upstream-Status': String(lastStatus) } });
    }
  }

  return Response.json(
    { error: 'Upstream backend error', upstreamStatus: lastStatus, details: lastText.slice(0, 200) },
    { status: lastStatus }
  );
}

export async function GET(req, ctx) { return proxy(req, ctx); }
export async function POST(req, ctx) { return proxy(req, ctx); }
export async function PUT(req, ctx) { return proxy(req, ctx); }
export async function DELETE(req, ctx) { return proxy(req, ctx); }
