import { motion } from 'framer-motion';

export function HeroReveal({ lines, className = '' }) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[900px] mx-auto text-center"
      >
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            {line}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}