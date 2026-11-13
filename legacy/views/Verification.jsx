import { useState, useEffect, useRef } from 'react';

export default function Verification({ item, onBack }) {
  const [progress, setProgress] = useState(0);
  const [activeAd, setActiveAd] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const [completedAdsCount, setCompletedAdsCount] = useState(0);

  const timerRef = useRef(null);

  // Initial animation: 0 -> 25%
  useEffect(() => {
    const duration = 1000;
    const target = 25;
    const intervalTime = 20;
    const step = target / (duration / intervalTime);
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= target) {
          clearInterval(timer);
          return target;
        }
        return prev + step;
      });
    }, intervalTime);
    return () => clearInterval(timer);
  }, []);

  const startTimeRef = useRef(null);

  // Timer Logic using useEffect (immune to browser background throttling)
  useEffect(() => {
    let interval;
    if (activeAd !== null && countdown > 0) {
      interval = setInterval(() => {
        // Calculate the actual exact elapsed time using timestamps
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = Math.max(0, 15 - elapsed);
        setCountdown(remaining);
      }, 500); // Check every 500ms for faster UI update when switching back to tab
    } else if (activeAd !== null && countdown === 0) {
      // Step Complete!
      const nextCount = completedAdsCount + 1;
      setCompletedAdsCount(nextCount);
      setProgress((nextCount + 1) * 25);
      setActiveAd(null);
      setCountdown(15); // Reset for next step
    }
    return () => clearInterval(interval);
  }, [activeAd, countdown, completedAdsCount]);

  const startAd = (stepId) => {
    setActiveAd(stepId);
    setCountdown(15);
    startTimeRef.current = Date.now(); // Record exact start time
    window.open('https://www.google.com', '_blank');
  };

  const currentStep = completedAdsCount + 1;
  const isAllDone = completedAdsCount === 3;

  return (
    <div className="verify-page">
      {/* Optimized Background Glow (Replaced expensive CSS blur with fast radial gradient) */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] -z-10 opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,235,255,1) 0%, rgba(250,250,250,0) 60%)' }}
      />

      <div className="flex flex-col items-center w-full" style={{ gap: 'var(--verify-outer-gap, 40px)' }}>
        <h1 
          className="animate-in fade-in zoom-in duration-1000 flex items-center justify-center"
          style={{ 
            fontSize: 'clamp(2rem, 7vw, 3.5rem)', 
            fontWeight: 900, 
            letterSpacing: '0.15em', 
            color: '#111111', 
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1,
            marginBottom: '0px',
            textShadow: '0 10px 20px rgba(0,0,0,0.05)'
          }}
        >
          <span>Pink H</span>
          <img 
            src="/loading.png" 
            alt="" 
            style={{ 
              height: '1.2em', 
              width: 'auto', 
              margin: '0 -0.02em',
              verticalAlign: 'middle',
              display: 'inline-block'
            }} 
          />
          <span>rse</span>
        </h1>

        <div className="verify-card shadow-2xl">


        <h1 className="verify-title" style={{ marginBottom: 'var(--verify-title-margin, 32px)' }}>
          {isAllDone ? 'Verification Success' : `Step 0${Math.min(3, currentStep)}`}
        </h1>

        {/* Interaction Area */}
        <div style={{ marginBottom: 'var(--verify-gap-y, 48px)', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {activeAd !== null ? (
            <div style={{ width: '100%', padding: '12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '110px', height: '110px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="46" stroke="#e5e7eb" strokeWidth="5" fill="none" />
                  <circle
                    cx="50" cy="50" r="46" stroke="#111111" strokeWidth="5" fill="none"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * (15 - countdown)) / 15}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s linear' }}
                  />
                </svg>
                <div style={{ position: 'relative', zIndex: 2, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '2.25rem', fontWeight: 900, color: '#111111', lineHeight: 1 }}>
                  {countdown}<span style={{ fontSize: '1rem', fontWeight: 700, color: '#9ca3af' }}>s</span>
                </div>
              </div>
              <p 
                className="animate-pulse"
                style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#9ca3af', textTransform: 'uppercase', lineHeight: 1.6, textAlign: 'center' }}
              >
                Validating Server 0{activeAd}... <br /> <span style={{ color: '#111111' }}>Please Wait</span>
              </p>
            </div>
          ) : !isAllDone ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', marginBottom: '16px', textAlign: 'center', letterSpacing: '0.02em', maxWidth: '280px', lineHeight: '1.5' }}>
                Please stay on the opened page for at least 15 seconds to complete the verification process successfully.
              </p>
              <button
                type="button"
                onClick={() => startAd(currentStep)}
                style={{
                  width: '100%',
                  padding: 'var(--ad-btn-padding, 24px 32px)',
                  backgroundColor: '#171717',
                  color: '#ffffff',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '36px', height: '36px', backgroundColor: '#ffffff', color: '#111111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                    0{currentStep}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Step {currentStep}</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#ffffff' }}>Click Here</span>
                  </div>
                </div>
                <svg style={{ width: '20px', height: '20px', color: '#ffffff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          ) : (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', marginBottom: '24px', border: '1px solid #dcfce7' }}>
                <svg style={{ width: '32px', height: '32px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em', textAlign: 'center', marginBottom: '24px', color: '#111111' }}>Handshake Complete</p>
              <button
                className="final-link-button"
                onClick={() => {
                  if (item.link) {
                    window.location.href = item.link;
                  } else {
                    alert("Link not found in database!");
                  }
                }}
              >
                Get Destination Link
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar (Moved DOWN) */}
        <div className="verify-progress-container mb-2">
          <div className="flex justify-between items-end mb-4 px-1">
            <span className="text-[10px] font-bold tracking-[0.2em] text-black/20 uppercase">Network Validation</span>
            <span className="verify-percentage-text">{Math.floor(progress)}%</span>
          </div>
          <div className="verify-progress-track">
            <div
              className="verify-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
