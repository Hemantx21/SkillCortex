import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Review shuffle â€” illustrative demo reviews only.
 * Clearly marked as demo content; not real customer testimonials.
 */
const DEMO_REVIEWS = [
  { role: 'Software Engineer', text: 'The mock interviews helped me prepare for real technical rounds.', label: 'Demo' },
  { role: 'Product Designer', text: 'AJ Assistant gave clear, actionable feedback after every session.', label: 'Demo' },
  { role: 'Data Analyst', text: 'Skill Points kept me motivated to keep practicing weekly.', label: 'Demo' },
];

export function ReviewShuffle({ className = '' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (DEMO_REVIEWS.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % DEMO_REVIEWS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const review = DEMO_REVIEWS[index];

  return (
    <section className={`relative overflow-hidden py-12 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="mx-auto text-center"
        >
          <p className="text-[18px] md:text-[22px] font-semibold text-[#2E2C2A] leading-relaxed italic">
            {review.text}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-[12px] font-bold text-[#2E2C2A] uppercase tracking-wider">{review.label}</span>
            <span className="text-[13px] text-[#9E9894]">{review.role}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

