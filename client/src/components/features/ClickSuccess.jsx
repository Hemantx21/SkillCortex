import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ClickSuccess({ children, onClick, className = '', successLabel = 'Done!' }) {
  const [state, setState] = useState('idle'); // idle | success

  const handleClick = (e) => {
    setState('success');
    onClick?.(e);
    setTimeout(() => setState('idle'), 1400);
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === 'success'}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[14px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E2C2A] ${className} ${
        state === 'success'
          ? 'bg-[#22C55E] text-white border-transparent'
          : 'bg-[#2E2C2A] text-white hover:bg-[#2E2C2A] active:scale-[0.98] border border-transparent'
      }`}
    >
      <AnimatePresence>
        {state === 'idle' ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        ) : (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            {successLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

