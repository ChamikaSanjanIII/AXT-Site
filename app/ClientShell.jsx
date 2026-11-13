'use client';

import { StrictMode } from 'react';
import dynamic from 'next/dynamic';

// The original SPA runs 100% unchanged on the client (same UI, same behaviour).
const App = dynamic(() => import('../legacy/App.jsx'), { ssr: false });

export default function ClientShell({ children }) {
  return (
    <StrictMode>
      {/* Server-rendered, crawlable content stays in the DOM for search engine bots & headless crawlers. */}
      {children}
      <App />
    </StrictMode>
  );
}
