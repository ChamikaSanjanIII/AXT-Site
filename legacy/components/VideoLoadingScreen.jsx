import { useEffect, useState } from 'react';

export default function VideoLoadingScreen({ item, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'ready'

  useEffect(() => {
    // Auto-animate progress from 0 to 100 in ~2.5 seconds
    const duration = 2500;
    const intervalTime = 30;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setPhase('ready');
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Auto-complete when ready
  useEffect(() => {
    if (phase === 'ready') {
      const t = setTimeout(() => onComplete(), 300);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const size = 100;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0px',
      }}
    >
      {/* Blurred background thumbnail */}
      {item?.image && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(30px) brightness(0.18)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', padding: '20px' }}>

        {/* Thumbnail with spinner ring */}
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          {/* Circular progress ring */}
          <svg
            viewBox={`0 0 ${size} ${size}`}
            style={{ position: 'absolute', inset: '-10px', width: 'calc(100% + 20px)', height: 'calc(100% + 20px)', transform: 'rotate(-90deg)' }}
          >
            <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />
            <circle
              cx={size / 2} cy={size / 2} r={radius} stroke="#ffffff" strokeWidth={strokeWidth} fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * progress) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.03s linear' }}
            />
          </svg>

          {/* Thumbnail */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.1)',
              background: '#1a1a1a',
            }}
          >
            {item?.image ? (
              <img
                src={item.image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                  <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        {item?.title && (
          <p style={{
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '15px',
            textAlign: 'center',
            maxWidth: '260px',
            lineHeight: 1.4,
            opacity: 0.9,
            letterSpacing: '-0.01em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {item.title}
          </p>
        )}

        {/* Progress bar */}
        <div style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: '#ffffff',
                borderRadius: '99px',
                width: `${progress}%`,
                transition: 'width 0.03s linear',
              }}
            />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            {phase === 'ready' ? 'READY' : 'LOADING...'}
          </span>
        </div>
      </div>
    </div>
  );
}
