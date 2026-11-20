import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function ProcessDraw({ steps, className = '' }) {
  const [active, setActive] = useState(0);
  const lineRef = useRef(null);

  useEffect(() => {
    if (steps.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % steps.length), 5000);
    return () => clearInterval(id);
  }, [steps.length]);

  const progress = (active / (steps.length - 1)) * 100;

  return (
    <section className={`relative max-w-[1100px] mx-auto px-5 lg:px-8 py-16 ${className}`}>
      <div className="relative mx-auto w-[600px]">
        <svg
          ref={lineRef}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 600 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="processLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path
            d="M 40 60 L 560 60"
            stroke="#E6E2E0"
            strokeWidth="3"
            fill="none"
          />
          <path
            d={`M 40 60 L ${40 + (520 * progress) / 100} 60`}
            stroke="url(#processLine)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-700"
          />
          {steps.map((_, i) => (
            <circle
              key={i}
              cx={40 + i * (520 / (steps.length - 1))}
              cy={60}
              r={i === active ? 7 : 4}
              fill={i === active ? '#6366f1' : '#E6E2E0'}
              stroke={i === active ? '#ffffff' : 'none'}
              strokeWidth={3}
              className="transition-all duration-500"
            />
          ))}
        </svg>
      </div>

      {/* connector line between cards */}
      <div className="hidden lg:block absolute left-1/2 top-[260px] -translate-x-1/2 w-[70%] h-[2px] bg-gradient-to-r from-transparent via-indigo-300 to-transparent pointer-events-none" />

      <div className="relative mt-16">
        {/* vertical connector lines between columns */}
        <div className="hidden lg:block absolute inset-y-0 left-1/4 w-px bg-gradient-to-b from-transparent via-indigo-300 to-transparent pointer-events-none" />
        <div className="hidden lg:block absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-indigo-300 to-transparent pointer-events-none" />
        <div className="hidden lg:block absolute inset-y-0 left-3/4 w-px bg-gradient-to-b from-transparent via-indigo-300 to-transparent pointer-events-none" />
        <div className="hidden md:block lg:hidden absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-indigo-300 to-transparent pointer-events-none" />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`group relative text-center p-4 rounded-xl border overflow-hidden transition-all duration-300 ${
              i === active
                ? 'border-indigo-300 bg-indigo-50/40 shadow-[0_8px_24px_-6px_rgba(99,102,241,0.3)]'
                : 'border-[#E6E2E0] hover:border-indigo-300 hover:shadow-[0_8px_24px_-6px_rgba(99,102,241,0.2)]'
            }`}
          >
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="pointer-events-none absolute -top-10 -right-10 w-24 h-24 rounded-full bg-indigo-400/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={`w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center border-2 transition-colors duration-500 ${
              i === active
                ? 'border-indigo-500 bg-indigo-500 text-white'
                : 'border-[#E6E2E0] text-[#9E9894] group-hover:border-indigo-500 group-hover:text-indigo-600'
            }`}>
              {i + 1}
            </div>
            <h4 className="text-[15px] font-bold text-[#2E2C2A] mb-1">{step.title}</h4>
            <p className="text-[12px] leading-relaxed text-[#9E9894]">{step.desc}</p>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}

