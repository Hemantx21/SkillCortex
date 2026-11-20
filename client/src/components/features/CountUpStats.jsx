import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function CountUpStat({ value, label, className = '', duration = 1.2, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let start = 0;
            const end = value;
            const startTime = performance.now();
            const step = (now) => {
              const elapsed = (now - startTime) / 1000;
              const t = Math.min(elapsed / duration, 1);
              const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
              setDisplay(Math.round(eased * end));
              if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-[32px] md:text-[48px] font-extrabold tabular text-[#2E2C2A]"
      >
        {prefix}{display}{suffix}
      </motion.div>
      <p className="mt-1 text-[12px] font-semibold text-[#9E9894] uppercase tracking-wider">{label}</p>
    </div>
  );
}

export function CountUpStats({ stats, className = '' }) {
  return (
    <section className={`relative border-y border-[#E6E2E0] bg-white ${className}`}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-12 lg:py-16 grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s) => (
          <CountUpStat key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}

