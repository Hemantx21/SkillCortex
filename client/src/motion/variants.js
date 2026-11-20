import { useReducedMotion } from 'framer-motion';

export const motionTokens = {
  fast: 0.14,
  normal: 0.22,
  emphasis: 0.38,
  section: 0.55,
};

export const ease = [0.22, 1, 0.36, 1];

export const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: motionTokens.normal, ease } } };
export const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: motionTokens.normal, ease } } };
export const fadeDown = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: motionTokens.normal, ease } } };
export const slideInLeft = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: motionTokens.normal, ease } } };
export const slideInRight = { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: motionTokens.normal, ease } } };
export const scaleIn = { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1, transition: { duration: motionTokens.normal, ease } } };
export const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
export const staggerItem = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: motionTokens.normal, ease } } };
export const modalEnter = { hidden: { opacity: 0, scale: 0.96, y: 8 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: motionTokens.emphasis, ease } }, exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: motionTokens.fast, ease } } };
export const drawerEnter = { hidden: { x: '100%' }, visible: { x: 0, transition: { duration: motionTokens.emphasis, ease } }, exit: { x: '100%', transition: { duration: motionTokens.fast, ease } } };
export const pageEnter = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: motionTokens.fast, ease } }, exit: { opacity: 0, y: -8, transition: { duration: 0.1, ease } } };
export const reducedMotion = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } };

/**
 * Page transition variants (inspired by vercel-labs/agent-skills react-view-transitions)
 * Use these for shared-element and directional page transitions.
 */
export const pageTransition = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
};

export const sharedElement = {
  initial: { opacity: 0, scale: 0.9, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.9, filter: 'blur(4px)' },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
};

export function useMotion() {
  const reduce = useReducedMotion();
  return reduce;
}