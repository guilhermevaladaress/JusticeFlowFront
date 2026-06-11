import { useState, useEffect } from "react";
import "./LoadingScreen.css";

export default function LoadingScreen({ children }) {
  const [carregando, setCarregando] = useState(true);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    const tempoMinimo = new Promise((resolve) => setTimeout(resolve, 1400));
    const paginaPronta = new Promise((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", resolve, { once: true });
    });

    Promise.all([tempoMinimo, paginaPronta]).then(() => {
      setSaindo(true);
      setTimeout(() => setCarregando(false), 650);
    });
  }, []);

  return (
    <>
      {carregando && (
        <div className={`loading-screen${saindo ? " loading-screen--saindo" : ""}`}>
          <div className="loading-conteudo">
            <img src="/logo.png" alt="JusticeFlow" className="loading-logo" />
            <div className="loading-barra">
              <div className="loading-progresso" />
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
