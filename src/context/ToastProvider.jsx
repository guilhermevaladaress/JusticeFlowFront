import { useCallback, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { ToastContext } from "./ToastContext";
import "../components/Toast.css";

const ICONES = { sucesso: CheckCircle2, erro: AlertCircle, info: Info };

let seq = 0;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remover = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const mostrar = useCallback(
    (texto, tipo = "info") => {
      const id = ++seq;
      setToasts((t) => [...t, { id, texto, tipo }]);
      setTimeout(() => remover(id), 3800);
    },
    [remover]
  );

  const api = useMemo(
    () => ({
      mostrar,
      sucesso: (t) => mostrar(t, "sucesso"),
      erro: (t) => mostrar(t, "erro"),
      info: (t) => mostrar(t, "info"),
    }),
    [mostrar]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => {
          const Icone = ICONES[t.tipo] ?? Info;
          return (
            <div key={t.id} className={`toast toast--${t.tipo}`}>
              <Icone size={17} strokeWidth={1.75} className="toast-icone" />
              <span>{t.texto}</span>
              <button type="button" onClick={() => remover(t.id)} aria-label="Fechar">
                <X size={14} strokeWidth={1.75} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
