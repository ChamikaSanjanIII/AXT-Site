# AdultXTube – Next.js (SEO version)

`site/` එකේ තිබුණු React app එක **කිසිම වෙනසක් නැතුව** (`legacy/` folder එකේ) client එකේ run වෙනවා.
Next.js server එක එක එක URL එකට වෙනම HTML + SEO tags දෙනවා.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Env (`.env.local`)
- `NEXT_PUBLIC_API_URL` – backend API
- `NEXT_PUBLIC_SITE_URL` – ඔයාගේ real domain එක (canonical / sitemap / og:url වලට)

## SEO features
- හැම URL එකකටම (`/?video=`, `/?model=`, `/?page=`, `/?q=`, `/?country=`) server-side `<title>`, description, canonical, Open Graph, Twitter tags
- Video pages වලට `VideoObject` JSON-LD (Google video rich results)
- `/sitemap.xml` (index) → `/sitemaps/0.xml` (pages/categories/countries/pornstars), `/sitemaps/1.xml...` (videos, 5000 බැගින්)
- `/robots.txt`

## Structure
- `app/` – Next.js (layout, SEO page, sitemap, robots)
- `legacy/` – original site code (App.jsx, components, views, index.css)
- `public/` – original public assets

> Note: `legacy/views` = original `src/pages` (Next.js `pages` නමින් folder එකක් තියෙන්න බැරි නිසා විතරක් rename කළා).

