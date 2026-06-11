import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const ano = new Date().getFullYear();
  return (
    <footer className="rodape">
      <div className="rodape-topo">
        <div className="rodape-marca">
          <img src="/logo.png" alt="JusticeFlow" className="rodape-logo-img" />
          <p className="rodape-tagline">
            Gestão inteligente de processos jurídicos para escritórios de advocacia modernos.
          </p>
        </div>

        <nav className="rodape-col">
          <h4>Navegação</h4>
          <a href="#recursos">Módulos</a>
          <a href="#plataforma">Plataforma</a>
          <a href="#perfis">Perfis de Acesso</a>
          <a href="#comparativo">Comparativo</a>
          <a href="#como-funciona">Como funciona</a>
        </nav>

        <nav className="rodape-col">
          <h4>Sistema</h4>
          <Link to="/dashboard">Painel</Link>
          <Link to="/processos">Processos</Link>
          <Link to="/prazos">Prazos</Link>
          <Link to="/audiencias">Audiências</Link>
          <Link to="/login">Entrar</Link>
        </nav>

        <div className="rodape-col">
          <h4>Funcionalidades</h4>
          <p>Gestão de processos jurídicos</p>
          <p>Controle de prazos e audiências</p>
          <p>Documentos e contratos</p>
          <p>Honorários e relatórios</p>
        </div>
      </div>

      <div className="rodape-base">
        <div className="rodape-base-inner">
          <span>© {ano} JusticeFlow · Gestão Jurídica Inteligente</span>
          <span>Feito para advogados.</span>
        </div>
      </div>

      <div className="rodape-faixa" aria-hidden="true" />
    </footer>
  );
}
