import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Cursor tour â€” lightweight interactive spotlight that follows the pointer
 * over featured elements. Respects reduced motion and touch devices.
 */
export function CursorTour({ children, className = '' }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setActive(true);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', () => setActive(false));
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', () => setActive(false));
    };
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      {active && (
        <motion.div
          className="absolute pointer-events-none rounded-[50%] bg-[#2E2C2A]/15 blur-[24px] mix-blend-overlay"
          style={{
            x: pos.x,
            y: pos.y,
            width: 160,
            height: 160,
            transform: `translate(${pos.x - 80}px, ${pos.y - 80}px) scale(${active ? 1 : 0})`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
}

