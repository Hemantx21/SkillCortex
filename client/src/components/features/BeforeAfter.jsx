import { useState, useRef, useEffect } from 'react';

export function BeforeAfter({ before, after, className = '' }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  const setPos = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    let p = ((clientX - rect.left) / rect.width) * 100;
    p = Math.max(0, Math.min(100, p));
    setPosition(p);
  };

  useEffect(() => {
    const container = containerRef.current;
    const slider = sliderRef.current;
    if (!container || !slider) return;

    const onMove = (e) => setPos(e.clientX || e.touches?.[0]?.clientX);
    const onStart = () => {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove, { passive: true });
    };
    const onEnd = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    };

    slider.addEventListener('mousedown', onStart);
    slider.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative rounded-[20px] overflow-hidden border border-[#E6E2E0] bg-white ${className}`} role="img" aria-label="Before and after comparison">
      <div className="relative size-full aspect-video">
        <img src={before} alt="Before" className="size-full object-cover" />
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img src={after} alt="After" className="size-full object-cover" />
        </div>
        <div className="absolute inset-y-0 left-[calc(50%-1px)] w-2 bg-[#2E2C2A] shadow-[0_0_10px_rgba(91,79,232,0.4)]" style={{ left: `${position}%` }} />
      </div>
      <button
        ref={sliderRef}
        type="button"
        aria-label="Adjust comparison"
        className="absolute top-1/2 left-[calc(50%-12px)] -translate-y-1/2 w-24 h-24 rounded-full bg-white border border-[#E6E2E0] shadow-sm flex items-center justify-center cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[#2E2C2A] transition-transform active:scale-95"
        style={{ left: `${position}%` }}
      >
        <svg className="w-6 h-6 text-[#2E2C2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5v14" /></svg>
      </button>
    </div>
  );
}

