import { useEffect, useRef, useState } from "react";

const semMovimento = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function Contador({ valor, prefixo = "", sufixo = "", duracao = 1500 }) {
  const ref = useRef(null);
  const [n, setN] = useState(() => (semMovimento() ? valor : 0));
  const [iniciou, setIniciou] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || semMovimento()) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIniciou(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!iniciou) return;
    let raf;
    const t0 = performance.now();
    const tick = (agora) => {
      const p = Math.min((agora - t0) / duracao, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * valor));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [iniciou, valor, duracao]);

  return (
    <span ref={ref}>
      {prefixo}{n}{sufixo}
    </span>
  );
}
