import { useCallback, useEffect, useRef, useState } from 'react';

export default function useTabSwitchLimit(active, onLimitReached) {
  const [switchCount, setSwitchCount] = useState(0);
  const switchCountRef = useRef(0);
  const onLimitReachedRef = useRef(onLimitReached);
  const reset = useCallback(() => {
    switchCountRef.current = 0;
    setSwitchCount(0);
  }, []);

  useEffect(() => {
    onLimitReachedRef.current = onLimitReached;
  }, [onLimitReached]);

  useEffect(() => {
    if (!active) return undefined;

    switchCountRef.current = 0;

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'hidden') return;
      const nextCount = switchCountRef.current + 1;
      switchCountRef.current = nextCount;
      setSwitchCount(nextCount);
      if (nextCount === 3) onLimitReachedRef.current();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [active]);

  return { switchCount, reset };
}
