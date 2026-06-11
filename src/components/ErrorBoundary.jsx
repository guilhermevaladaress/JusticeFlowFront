import { Component } from "react";
import "./ErrorBoundary.css";

export default class ErrorBoundary extends Component {
  state = { erro: false };

  static getDerivedStateFromError() {
    return { erro: true };
  }

  componentDidCatch(erro, info) {
    console.error("Erro capturado:", erro, info);
  }

  render() {
    if (this.state.erro) {
      return (
        <div className="erro-boundary">
          <h1>Algo deu errado</h1>
          <p>Ocorreu um erro inesperado. Tente recarregar a página.</p>
          <button type="button" onClick={() => window.location.reload()} className="erro-btn">
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
