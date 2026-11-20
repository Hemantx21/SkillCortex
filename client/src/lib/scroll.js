import Lenis from 'lenis';

let lenis = null;

export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
  let raf = 0;
  const loop = (time) => {
    lenis.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis.destroy();
    lenis = null;
  };
}

export function scrollToHash(hash) {
  const target = hash === '#top' ? 0 : document.querySelector(hash);
  if (target === null) return;
  if (lenis) lenis.scrollTo(target, { duration: 1.6 });
  else if (typeof target === 'number') window.scrollTo({ top: target });
  else target.scrollIntoView();
}