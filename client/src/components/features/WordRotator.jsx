import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function WordRotator({ words, className = '' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
        >
          {word}
        </motion.span>
      ))}
      <span className="opacity-0">{words[0]}</span>
    </span>
  );
}