import { useEffect, useRef, useState } from 'react';

/**
 * Anima um número de 0 até `target` ao montar.
 * Para acessibilidade, prefere-reduzir-movimento ignora a animação.
 */
export function useCountUp(target: number | undefined, duration = 900): number | undefined {
  const [value, setValue] = useState<number | undefined>(undefined);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (target === undefined) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(ease * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}
