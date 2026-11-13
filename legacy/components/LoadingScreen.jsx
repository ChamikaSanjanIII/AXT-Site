import { useState, useEffect, useRef } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  // Constants for the circular progress
  const size = 120;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const duration = 1800; // 1.8 seconds auto load
    const interval = 20;
    const step = (interval / duration) * 100;

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timerRef.current);
  }, []);

  // Handle completion side-effect safely outside the render cycle
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-10 overflow-hidden select-none touch-none">

      {/* Background Decorative Element */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative flex flex-col items-center max-w-[400px] w-full text-center">

        {/* Title */}
        <div
          className="animate-in fade-in slide-in-from-top-4 duration-1000"
          style={{ marginBottom: '90px' }}
        >
          <div className="h-px w-8 bg-black/10 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
            Unlock Pink Horse
          </h2>
        </div>

        {/* Interaction Circle */}
        <div
          className="relative group pointer-events-none select-none"
          style={{ marginBottom: '60px' }}
        >
          <div className="w-24 h-24 md:w-28 md:h-28 relative transition-transform duration-500">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
              <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f3f4f6" strokeWidth={strokeWidth} fill="none" />
              <circle
                cx={size / 2} cy={size / 2} r={radius} stroke="black" strokeWidth={strokeWidth} fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-75 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="transition-all duration-300 scale-100 opacity-90">
                <img
                  src="/loading.png"
                  alt="Loading"
                  className="w-14 h-14 md:w-16 md:h-16 object-contain pointer-events-none animate-pulse"
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div
          className="font-mono text-[9px] font-bold text-black/40 tracking-widest"
          style={{ marginBottom: '40px' }}
        >
          CONNECTING <span className="text-black ml-2">{Math.floor(progress)}%</span>
        </div>

        {/* Instruction Text */}
        <p
          className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 max-w-[240px] mx-auto leading-relaxed animate-in fade-in duration-1000"
          style={{ marginTop: '10px' }}
        >
          Loading Pink Horse...
        </p>

      </div>

      {/* Footer Disclaimer */}
      <div className="absolute bottom-12 text-[9px] font-bold tracking-[0.3em] uppercase text-gray-300">
        System Protocol v2.0
      </div>

    </div>
  );
}
