import { useEffect, useState } from "react";
import {
  Scale, Clock, FileText, Users, BarChart2,
  ChevronDown, Briefcase, Calendar,
  ArrowRight, CheckCircle, Settings, User,
} from "lucide-react";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Contador from "../components/Contador";
import "./LandingPage.css";

const FEATURES = [
  {
    icone: Scale,
    titulo: "Gestão de Processos",
    descricao: "Registre processos com número CNJ, vincule partes e advogados, e acompanhe o histórico completo de movimentações.",
  },
  {
    icone: Clock,
    titulo: "Controle de Prazos",
    descricao: "Prazos processuais com alerta por prioridade. Nunca perca uma data crítica com o sistema de notificações automáticas.",
  },
  {
    icone: Calendar,
    titulo: "Agenda de Audiências",
    descricao: "Gerencie a pauta de audiências, registre atas e receba alertas antecipados integrados ao calendário processual.",
  },
  {
    icone: FileText,
    titulo: "Documentos e Contratos",
    descricao: "Organize petições, contratos de honorários e documentos vinculados a cada processo com busca instantânea.",
  },
  {
    icone: Users,
    titulo: "Clientes e Advogados",
    descricao: "Cadastro completo de clientes com histórico de processos. Gerencie a equipe com controle por perfil de acesso.",
  },
  {
    icone: BarChart2,
    titulo: "Honorários e Relatórios",
    descricao: "Controle de honorários por processo e relatórios automáticos de produtividade e faturamento do escritório.",
  },
];

const SHOWCASE = [
  {
    icone: Scale,
    titulo: "Gestão de Processos",
    descricao:
      "Controle total do ciclo processual — do cadastro inicial ao encerramento, com partes, advogados e todas as movimentações registradas.",
    lista: [
      "Número CNJ com validação automática",
      "Vinculação de advogados responsáveis",
      "Histórico detalhado de movimentações",
      "Filtros por status, área e tribunal",
    ],
    destaque: true,
  },
  {
    icone: Clock,
    titulo: "Prazos e Audiências",
    descricao:
      "Sistema integrado de alertas para prazos críticos e agenda de audiências, garantindo pontualidade processual total.",
    lista: [
      "Alertas por grau de prioridade",
      "Agenda unificada por processo",
      "Notificações em tempo real",
    ],
    destaque: false,
  },
  {
    icone: FileText,
    titulo: "Documentos e Honorários",
    descricao:
      "Gestão documental vinculada aos processos com controle de honorários e relatórios financeiros automáticos.",
    lista: [
      "Upload de peças processuais",
      "Contratos de honorários digitais",
      "Relatórios de faturamento por período",
    ],
    destaque: false,
  },
];

const PERFIS = [
  {
    icone: Briefcase,
    rotulo: "Para o escritório",
    titulo: "Gestão sem complicação",
    descricao: "Visão completa do escritório em um só lugar. Controle equipe, produtividade e resultados sem planilhas ou e-mails perdidos.",
    beneficios: [
      "Equipe organizada por função e acesso",
      "Relatórios de desempenho automatizados",
      "Controle financeiro de honorários",
      "Configuração rápida, sem área de TI",
    ],
    destaque: false,
  },
  {
    icone: Scale,
    rotulo: "Para o advogado",
    titulo: "Foco total na advocacia",
    descricao: "Menos burocracia, mais resultado. Toda a informação que você precisa, no momento em que você precisa.",
    beneficios: [
      "Processos organizados e pesquisáveis",
      "Zero prazos perdidos com alertas inteligentes",
      "Audiências e documentos sempre integrados",
      "Acesso completo de qualquer dispositivo",
    ],
    destaque: true,
  },
  {
    icone: Users,
    rotulo: "Para o cliente",
    titulo: "Transparência que fideliza",
    descricao: "Seu cliente acompanha o caso em tempo real. Mais confiança, menos ligações de \"como está meu processo?\".",
    beneficios: [
      "Andamento do processo sempre visível",
      "Notificações automáticas de novidades",
      "Documentos acessíveis a qualquer hora",
      "Comunicação direta com o escritório",
    ],
    destaque: false,
  },
];

const STATS = [
  { valor: 1240, sufixo: "+", rotulo: "Processos gerenciados",  icone: Scale },
  { valor: 380,  sufixo: "+", rotulo: "Clientes cadastrados",   icone: Users },
  { valor: 99,   sufixo: "%", rotulo: "Pontualidade em prazos", icone: CheckCircle },
  { valor: 8500, sufixo: "+", rotulo: "Documentos organizados", icone: FileText },
];

const PASSOS = [
  {
    num: "01",
    icone: Briefcase,
    titulo: "Configure o escritório",
    texto:
      "Cadastre advogados, tribunais de atuação e configure os perfis de acesso da equipe em poucos minutos.",
  },
  {
    num: "02",
    icone: Scale,
    titulo: "Cadastre os processos",
    texto:
      "Registre processos com número CNJ, vincule clientes, advogados responsáveis e os documentos pertinentes.",
  },
  {
    num: "03",
    icone: BarChart2,
    titulo: "Monitore e gerencie",
    texto:
      "Acompanhe prazos, audiências e notificações em tempo real. Gere relatórios completos com um clique.",
  },
];

const ANTES = [
  "Processos espalhados em planilhas e papel",
  "Prazos perdidos por falta de controle",
  "Documentos difíceis de localizar",
  "Comunicação interna desorganizada",
  "Relatórios manuais e imprecisos",
  "Tempo desperdiçado em tarefas administrativas",
];

const DEPOIS = [
  "Todos os processos centralizados e organizados",
  "Alertas automáticos de prazos críticos",
  "Documentos acessíveis em segundos",
  "Equipe alinhada em tempo real",
  "Relatórios automáticos com um clique",
  "Foco total no que importa: a advocacia",
];

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="landing" id="topo">
      <LandingNavbar />

      {/* ── HERO ── */}
      <header className="hero">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-grid"   aria-hidden="true" />

        <div
          className="hero-conteudo"
          style={{
            opacity: Math.max(0, 1 - scrollY / 480),
            transform: `translateY(${scrollY * 0.22}px)`,
          }}
        >
          <h1 className="hero-titulo">
            <span className="hero-justice">Justice</span>
            <span className="hero-flow">Flow</span>
          </h1>

          <p className="hero-frase">
            A plataforma completa para gestão processual de escritórios jurídicos.
            <br />
            Processos, prazos, audiências e documentos — tudo integrado.
          </p>

          <div className="hero-acoes">
            <a href="/login" className="hero-btn hero-btn--primario">
              Acessar o sistema <ArrowRight size={17} strokeWidth={2} />
            </a>
            <a href="#recursos" className="hero-btn hero-btn--sec">
              Ver recursos <ChevronDown size={17} strokeWidth={1.75} />
            </a>
          </div>
        </div>

        <a
          href="#recursos"
          className="hero-scroll"
          aria-label="Rolar para baixo"
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <ChevronDown size={24} strokeWidth={1.75} />
        </a>
      </header>

      {/* ── MÓDULOS ── */}
      <section id="recursos" className="secao secao--cinza">
        <div className="secao-inner">
          <Reveal>
            <div className="secao-header">
              <span className="secao-tag">Módulos</span>
              <h2>Uma plataforma, todos os módulos</h2>
              <p className="secao-lead">
                Do cadastro processual à geração de relatórios — o JusticeFlow reúne em
                um só lugar todas as ferramentas que o escritório jurídico precisa.
              </p>
            </div>
          </Reveal>

          <div className="features-grid">
            {FEATURES.map((f, i) => {
              const Icone = f.icone;
              return (
                <Reveal as="div" className="feature-card" key={f.titulo} delay={i * 80}>
                  <div className="feature-icon">
                    <Icone size={23} strokeWidth={1.5} />
                  </div>
                  <h3>{f.titulo}</h3>
                  <p>{f.descricao}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PLATAFORMA EM DETALHE (dark) ── */}
      <section id="plataforma" className="secao secao--dark">
        <div className="secao-inner">
          <Reveal>
            <div className="secao-header">
              <span className="secao-tag claro">A plataforma</span>
              <h2 style={{ color: "#fff" }}>Controle processual em cada detalhe</h2>
              <p className="secao-lead claro">
                Do cadastro do processo até a geração do relatório final, o JusticeFlow
                acompanha cada etapa com precisão e segurança jurídica.
              </p>
            </div>
          </Reveal>

          <div className="showcase-grid">
            {SHOWCASE.map((s, i) => {
              const Icone = s.icone;
              return (
                <Reveal
                  as="div"
                  className={`showcase-card${s.destaque ? " showcase-card--destaque" : ""}`}
                  key={s.titulo}
                  delay={i * 110}
                >
                  <div className="showcase-icon">
                    <Icone size={s.destaque ? 32 : 26} strokeWidth={1.25} />
                  </div>
                  <h3>{s.titulo}</h3>
                  <p>{s.descricao}</p>
                  <ul className="showcase-list">
                    {s.lista.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PARA QUEM É ── */}
      <section id="perfis" className="secao secao--perfis">
        <div className="secao-inner">
          <Reveal>
            <div className="secao-header secao-header--centro">
              <span className="secao-tag">Para quem é</span>
              <h2>Uma plataforma, cada um no seu papel</h2>
              <p className="secao-lead" style={{ margin: "0 auto" }}>
                Do sócio ao cliente, o JusticeFlow entrega exatamente o que cada
                pessoa precisa — sem excesso, sem falta.
              </p>
            </div>
          </Reveal>

          <div className="perfis-grid">
            {PERFIS.map((p, i) => {
              const Icone = p.icone;
              return (
                <Reveal
                  as="div"
                  className={`perfil-card${p.destaque ? " perfil-card--destaque" : ""}`}
                  key={p.titulo}
                  delay={i * 110}
                >
                  <div className="perfil-icon">
                    <Icone size={p.destaque ? 28 : 24} strokeWidth={1.5} />
                  </div>
                  <span className="perfil-rotulo">{p.rotulo}</span>
                  <h3>{p.titulo}</h3>
                  <p>{p.descricao}</p>
                  <ul className="perfil-lista">
                    {p.beneficios.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NÚMEROS ── */}
      <section id="numeros" className="secao--stats">
        <div className="secao-inner">
          <div className="stats-grid">
            {STATS.map((s, i) => {
              const Icone = s.icone;
              return (
                <Reveal as="div" className="stat-item" key={s.rotulo} delay={i * 100}>
                  <Icone size={26} strokeWidth={1.25} className="stat-icon" />
                  <strong className="stat-valor">
                    <Contador valor={s.valor} sufixo={s.sufixo} />
                  </strong>
                  <span className="stat-rotulo">{s.rotulo}</span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARATIVO ── */}
      <section id="comparativo" className="secao">
        <div className="secao-inner">
          <Reveal>
            <div className="secao-header">
              <span className="secao-tag">Transformação</span>
              <h2>Da desorganização à clareza jurídica</h2>
              <p className="secao-lead">
                Veja o que muda quando o seu escritório adota uma gestão processual profissional.
              </p>
            </div>
          </Reveal>

          <div className="comparativo">
            <Reveal as="div" className="comp-card comp-card--antes" direcao="left">
              <div className="comp-header">
                <span className="comp-label comp-label--antes">Sem JusticeFlow</span>
              </div>
              <ul className="comp-lista">
                {ANTES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>

            <div className="comp-divider" aria-hidden="true">
              <div className="comp-divider-line" />
              <div className="comp-divider-icon">
                <ArrowRight size={18} strokeWidth={2} />
              </div>
              <div className="comp-divider-line comp-divider-line--baixo" />
            </div>

            <Reveal as="div" className="comp-card comp-card--depois" direcao="right">
              <div className="comp-header">
                <span className="comp-label comp-label--depois">Com JusticeFlow</span>
              </div>
              <ul className="comp-lista">
                {DEPOIS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="secao secao--passos">
        <div className="secao-inner">
          <Reveal>
            <div className="secao-header secao-header--centro">
              <span className="secao-tag claro">Como funciona</span>
              <h2 style={{ color: "#fff" }}>Comece em minutos</h2>
              <p className="secao-lead claro">
                Três passos simples para transformar a gestão processual do seu escritório de advocacia.
              </p>
            </div>
          </Reveal>

          <div className="passos-grid">
            {PASSOS.map((p, i) => {
              const Icone = p.icone;
              return (
                <Reveal as="div" className="passo" key={p.num} delay={i * 140}>
                  <span className="passo-num">{p.num}</span>
                  <div className="passo-icon">
                    <Icone size={26} strokeWidth={1.25} />
                  </div>
                  <h3>{p.titulo}</h3>
                  <p>{p.texto}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="secao secao--cta">
        <div className="secao-inner">
          <Reveal>
            <div className="cta-content">
              <div className="cta-emblema" aria-hidden="true">
                <Scale size={44} strokeWidth={1} />
              </div>
              <h2>Pronto para modernizar seu escritório?</h2>
              <p>
                Comece a usar o JusticeFlow e descubra como a gestão jurídica pode ser
                mais simples, segura e eficiente.
              </p>
              <div className="cta-acoes">
                <a href="/login" className="cta-btn">
                  Acessar o sistema <ArrowRight size={18} strokeWidth={2} />
                </a>
                <a href="#recursos" className="cta-btn-sec">
                  Conhecer os recursos
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
