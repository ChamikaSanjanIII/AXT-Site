import '../legacy/index.css';
import { SITE_URL, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from './lib/seo';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  rating: 'adult',
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-video-preview': -1 },
  openGraph: { siteName: SITE_NAME, type: 'website', title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  twitter: { card: 'summary_large_image', title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const themeScript = `(function () {
  try {
    var t = localStorage.getItem('adultxtube_theme') || 'dark';
    if (t === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.setAttribute('data-theme', 'light');
      var meta = document.getElementById('theme-color-meta');
      if (meta) meta.setAttribute('content', '#ffffff');
    }
  } catch (e) { }
})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="RATING" content="RTA-5042-1996-1400-1577-RTA" />
        <meta name="theme-color" content="#0b0b0b" id="theme-color-meta" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Montserrat:wght@800;900&family=Syne:wght@800&family=Inter:wght@300;400;500;600;700&family=Roboto:ital,wdth,wght@0,75,100..900;1,75,100..900&family=Unica+One&display=swap"
          rel="stylesheet"
        />
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      </head>
      <body suppressHydrationWarning>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

