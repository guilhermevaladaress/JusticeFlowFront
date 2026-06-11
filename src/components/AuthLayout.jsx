import { Link } from "react-router-dom";
import { Scale, Clock, FileText, Users, Shield, Gavel } from "lucide-react";
import "./AuthLayout.css";

const CARDS = [
  {
    icone: Scale,
    titulo: "Processos",
    desc: "Gerencie todos os processos jurídicos em um só lugar com visão completa.",
  },
  {
    icone: Clock,
    titulo: "Prazos",
    desc: "Alertas automáticos para nunca perder um prazo crítico.",
  },
  {
    icone: FileText,
    titulo: "Documentos",
    desc: "Armazenamento centralizado de contratos e peças processuais.",
  },
  {
    icone: Users,
    titulo: "Clientes",
    desc: "Cadastro completo de clientes com histórico e controle de acesso.",
  },
  {
    icone: Gavel,
    titulo: "Audiências",
    desc: "Agendamento e acompanhamento de todas as audiências.",
  },
  {
    icone: Shield,
    titulo: "Segurança",
    desc: "Controle de acesso por perfil com dados protegidos.",
  },
];

const PARTICULAS = [
  { left: "6%",  dur: "17s", delay: "0s"  },
  { left: "19%", dur: "23s", delay: "5s"  },
  { left: "33%", dur: "15s", delay: "11s" },
  { left: "50%", dur: "20s", delay: "3s"  },
  { left: "63%", dur: "26s", delay: "8s"  },
  { left: "76%", dur: "13s", delay: "15s" },
  { left: "88%", dur: "19s", delay: "2s"  },
  { left: "96%", dur: "22s", delay: "9s"  },
];

export default function AuthLayout({ children }) {
  return (
    <div className="auth-pg">

      {/* ── PAINEL ESQUERDO: branding ── */}
      <div className="auth-esq">
        <div className="auth-esq-fundo" aria-hidden="true" />

        <div className="auth-particulas" aria-hidden="true">
          {PARTICULAS.map((p, i) => (
            <span
              key={i}
              style={{
                left:              p.left,
                animationDuration: p.dur,
                animationDelay:    p.delay,
              }}
            />
          ))}
        </div>

        <div className="auth-esq-inner">
          {/* Logo */}
          <Link to="/" className="auth-esq-logo-link">
            <img src="/logo.png" alt="JusticeFlow" className="auth-esq-logo" />
          </Link>

          {/* Bloco central */}
          <div className="auth-esq-centro">
            <div className="auth-esq-hero">
              <h2>Gestão Jurídica<br /><span>Inteligente</span></h2>
              <p>A plataforma completa para escritórios jurídicos modernos gerenciarem processos, prazos e documentos.</p>
            </div>

            <div className="auth-esq-divider" />

            <div className="auth-esq-stats">
              {CARDS.map(({ icone: Icone, titulo, desc }, i) => (
                <div key={i} className="auth-stat-card">
                  <div className="auth-stat-icone">
                    <Icone size={15} strokeWidth={2} />
                  </div>
                  <p className="auth-stat-titulo">{titulo}</p>
                  <p className="auth-stat-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PAINEL DIREITO: formulário ── */}
      <div className="auth-dir">
        <header className="auth-dir-topbar">
          {/* Logo visível apenas no mobile */}
          <Link to="/" className="auth-dir-logo-mobile">
            <img src="/logo.png" alt="JusticeFlow" />
          </Link>
          <Link to="/" className="auth-dir-voltar">← Voltar ao site</Link>
        </header>

        <main className="auth-dir-main">
          {children}
        </main>

        <footer className="auth-dir-rodape">
          © 2025 JusticeFlow · Todos os direitos reservados
        </footer>
      </div>

    </div>
  );
}
