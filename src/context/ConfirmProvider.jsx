import { useCallback, useState } from "react";
import { ConfirmContext } from "./ConfirmContext";
import "../components/Confirm.css";

export default function ConfirmProvider({ children }) {
  const [estado, setEstado] = useState(null);

  const confirmar = useCallback(
    (opcoes) =>
      new Promise((resolve) => {
        setEstado({ opcoes, resolve });
      }),
    []
  );

  function responder(valor) {
    estado?.resolve(valor);
    setEstado(null);
  }

  const o = estado?.opcoes ?? {};
  const perigo = o.tipo === "perigo";

  return (
    <ConfirmContext.Provider value={confirmar}>
      {children}
      {estado && (
        <div className="confirm-overlay" onClick={() => responder(false)}>
          <div
            className="confirm-card"
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{o.titulo || "Confirmar ação"}</h2>
            {o.mensagem && <p>{o.mensagem}</p>}
            <div className="confirm-acoes">
              <button
                type="button"
                className="confirm-btn confirm-btn--cancelar"
                onClick={() => responder(false)}
              >
                {o.cancelar || "Cancelar"}
              </button>
              <button
                type="button"
                className={perigo ? "confirm-btn confirm-btn--perigo" : "confirm-btn confirm-btn--ok"}
                onClick={() => responder(true)}
              >
                {o.confirmar || "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
