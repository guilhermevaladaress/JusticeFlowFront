import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Scale, Calendar, Clock, FileText,
  Users, Briefcase, BookOpen, DollarSign, Building2,
  BarChart2, Settings, Bell, LogOut, LogIn, X, User, History,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import "./Sidebar.css";

const LINKS = [
  { to: "/dashboard",    rotulo: "Dashboard",    icone: LayoutDashboard, soAdv: true },
  { to: "/processos",    rotulo: "Processos",     icone: Scale },
  { to: "/audiencias",   rotulo: "Audiências",    icone: Calendar },
  { to: "/prazos",       rotulo: "Prazos",        icone: Clock },
  { to: "/documentos",   rotulo: "Documentos",    icone: FileText },
  { to: "/notificacoes", rotulo: "Notificações",  icone: Bell },
];

const LINKS_JURIDICO = [
  { to: "/clientes",      rotulo: "Clientes",       icone: Users },
  { to: "/contratos",     rotulo: "Contratos",       icone: BookOpen },
  { to: "/honorarios",    rotulo: "Honorários",      icone: DollarSign },
  { to: "/movimentacoes", rotulo: "Movimentações",   icone: History },
  { to: "/relatorios",    rotulo: "Relatórios",      icone: BarChart2 },
];

const LINKS_ADMIN = [
  { to: "/advogados",    rotulo: "Advogados",    icone: Briefcase },
  { to: "/tribunais",    rotulo: "Tribunais",    icone: Building2 },
  { to: "/configuracao", rotulo: "Configuração", icone: Settings },
];

function itemClasse({ isActive }) {
  return isActive ? "sidebar-link ativo" : "sidebar-link";
}

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileAberto, setMobileAberto] = useState(false);

  const ehAdmin = user?.role === "Administrador";
  const ehAdvogado = user?.role === "Administrador" || user?.role === "Advogado";

  function aoSair() {
    logout();
    navigate("/", { replace: true });
  }

  function fecharMobile() {
    setMobileAberto(false);
  }

  return (
    <>
      {mobileAberto && (
        <div
          className="sidebar-overlay"
          onClick={fecharMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar${mobileAberto ? " sidebar--aberta" : ""}`}>
        {/* topo: logo + toggle */}
        <div className="sidebar-topo">
          <Link to={ehAdvogado ? "/dashboard" : "/processos"} className="sidebar-brand" onClick={fecharMobile}>
            <img src="/logo.png" alt="JusticeFlow" />
          </Link>
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setMobileAberto((v) => !v)}
            aria-label={mobileAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileAberto}
          >
            {mobileAberto ? <X size={22} strokeWidth={2} /> : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <line x1="3" y1="6"  x2="19" y2="6"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* corpo da navegação */}
        <div className="sidebar-corpo">
          <span className="sidebar-secao">Navegação</span>
          <nav className="sidebar-nav">
            {LINKS.filter((l) => !l.soAdv || ehAdvogado).map((l) => {
              const Icone = l.icone;
              return (
                <NavLink key={l.to} to={l.to} className={itemClasse} onClick={fecharMobile}>
                  <Icone size={18} strokeWidth={1.8} />
                  <span>{l.rotulo}</span>
                </NavLink>
              );
            })}
          </nav>

          {ehAdvogado && (
            <>
              <span className="sidebar-secao sidebar-secao--sep">Jurídico</span>
              <nav className="sidebar-nav">
                {LINKS_JURIDICO.map((l) => {
                  const Icone = l.icone;
                  return (
                    <NavLink key={l.to} to={l.to} className={itemClasse} onClick={fecharMobile}>
                      <Icone size={18} strokeWidth={1.8} />
                      <span>{l.rotulo}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </>
          )}

          {ehAdmin && (
            <>
              <span className="sidebar-secao sidebar-secao--sep">Administração</span>
              <nav className="sidebar-nav">
                {LINKS_ADMIN.map((l) => {
                  const Icone = l.icone;
                  return (
                    <NavLink key={l.to} to={l.to} className={itemClasse} onClick={fecharMobile}>
                      <Icone size={18} strokeWidth={1.8} />
                      <span>{l.rotulo}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </>
          )}
        </div>

        {/* rodapé: usuário */}
        <div className="sidebar-rodape">
          {user ? (
            <>
              <span className={ehAdmin ? "sidebar-avatar admin" : "sidebar-avatar"}>
                <User size={17} strokeWidth={2} />
              </span>
              <span className="sidebar-user">
                <strong className="sidebar-nome">{user.nomeCompleto}</strong>
                <span className="sidebar-meta">
                  <em className={ehAdmin ? "sidebar-perfil admin" : "sidebar-perfil"}>
                    {user.role}
                  </em>
                  <small>{user.email}</small>
                </span>
              </span>
              <button
                type="button"
                className="sidebar-icone-btn"
                onClick={aoSair}
                title="Sair"
                aria-label="Sair"
              >
                <LogOut size={16} strokeWidth={1.75} />
              </button>
            </>
          ) : (
            <Link to="/login" className="sidebar-entrar" onClick={fecharMobile}>
              <LogIn size={16} strokeWidth={1.75} />
              <span>Entrar</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
