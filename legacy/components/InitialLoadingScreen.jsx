import React, { useState, useEffect, useRef } from 'react';

export default function InitialLoadingScreen({ isVisible, isFirstLoad = false }) {
  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setIsFadingOut(false);
      startTimeRef.current = Date.now();
    } else {
      // First site load has 1000ms (1 sec) minimum; subsequent page transitions dismiss as soon as data arrives (instant)
      const minDisplayTime = isFirstLoad ? 1000 : 0;
      const elapsed = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      const dismissTimer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setShouldRender(false);
        }, 250); // fast smooth fadeout transition
      }, remainingTime);

      return () => clearTimeout(dismissTimer);
    }
  }, [isVisible, isFirstLoad]);

  if (!shouldRender) return null;

  return (
    <div
      className="beeg-initial-loading-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Animated Brand Logo in Unica One Text Font */}
        <div 
          className="tube-header-logo-text beeg-loading-pulse-logo"
          style={{
            fontSize: '42px',
            letterSpacing: '1px'
          }}
        >
          <span className="tube-logo-adult">AdulT</span><span className="tube-logo-x">X</span><span className="tube-logo-tube">Tube</span>
        </div>
      </div>
    </div>
  );
}

