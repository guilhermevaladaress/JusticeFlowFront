import { useEffect, useRef, useState } from "react";
import "./Reveal.css";

export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  direcao = "up",
}) {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisivel(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cls = `reveal reveal--${direcao} ${visivel ? "reveal--on" : ""} ${className}`.trim();

  return (
    <Tag
      ref={ref}
      className={cls}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
