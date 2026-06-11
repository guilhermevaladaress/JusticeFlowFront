import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { differenceInDays, parseISO } from 'date-fns';
import {
  Scale, Calendar, Clock, FileText, Users, TrendingUp,
  AlertTriangle, CheckCircle, Briefcase, ArrowUpRight,
  PieChart, BarChart3, Gavel, Flame, AlertCircle,
} from 'lucide-react';
import { relatoriosApi } from '../../api/relatorios';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { usePermission } from '../../hooks/usePermission';
import { useAuthStore } from '../../store/authStore';
import { useCountUp } from '../../hooks/useCountUp';
import {
  DonutChart, BarList, ChartEmpty, statusColor, type Slice,
} from '../../components/charts/Charts';
import type {
  DashboardData, RelatorioAudiencias, RelatorioPrazos,
  PrazoResumo, AudienciaResumo, ProcessoResumo,
} from '../../types/relatorio';

/* ── KPI animado ─────────────────────────────────────────── */
function KpiCard({
  label, value, icon: Icon, cor, to, index,
}: {
  label: string; value: number | undefined; icon: React.ElementType;
  cor: string; to: string; index: number;
}) {
  const animated = useCountUp(value);
  return (
    <Link
      to={to}
      className="kpi-card kpi-card--link"
      style={{ '--accent': cor, '--delay': `${index * 60}ms` } as React.CSSProperties}
    >
      <div className="kpi-icone" style={{ background: cor }}>
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="kpi-valor">{animated ?? '—'}</div>
        <div className="kpi-rotulo">{label}</div>
      </div>
      <ArrowUpRight size={16} className="kpi-seta" />
    </Link>
  );
}

/* ── Skeleton ────────────────────────────────────────────── */
function LoadingCard() {
  return (
    <div className="kpi-card kpi-card--skel">
      <div className="kpi-icone" style={{ background: '#e2e8f0' }} />
      <div style={{ flex: 1 }}>
        <div className="skel-line" style={{ height: 26, width: '55%', marginBottom: 8 }} />
        <div className="skel-line" style={{ height: 11, width: '80%' }} />
      </div>
    </div>
  );
}

function badgeClasse(status: string) {
  return 'badge badge--' + status?.toLowerCase().replace(/\s+/g, '');
}

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/** Retorna ícone e cor baseados em quantos dias faltam para vencer. */
function urgencia(dataVencimento: string): { icon: React.ElementType; cor: string; label: string } | null {
  try {
    const dias = differenceInDays(parseISO(dataVencimento), new Date());
    if (dias < 0)  return { icon: AlertCircle, cor: '#c62828', label: 'Vencido' };
    if (dias === 0) return { icon: Flame,       cor: '#e65100', label: 'Vence hoje' };
    if (dias <= 2)  return { icon: Flame,       cor: '#e65100', label: `${dias}d` };
    if (dias <= 5)  return { icon: AlertTriangle, cor: '#c8a951', label: `${dias}d` };
  } catch {/* ignore */}
  return null;
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════ */
export function Dashboard() {
  const { isCliente, isAdmin } = usePermission();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => relatoriosApi.dashboard().then((r) => r.data as DashboardData),
  });

  const { data: relAud } = useQuery({
    queryKey: ['rel-audiencias'],
    queryFn: () => relatoriosApi.audiencias().then((r) => r.data as RelatorioAudiencias),
  });

  const { data: relPrazos } = useQuery({
    queryKey: ['rel-prazos'],
    queryFn: () => relatoriosApi.prazos().then((r) => r.data as RelatorioPrazos),
  });

  const cards = data ? [
    { label: 'Processos Ativos',  value: data.processosAtivos,  icon: Scale,    cor: '#1B3A6B', to: '/processos' },
    { label: 'Audiências Hoje',   value: data.audienciasHoje,   icon: Calendar, cor: '#2563eb', to: '/audiencias' },
    { label: 'Prazos Vencendo',   value: data.prazosVencendo,   icon: Clock,    cor: '#e65100', to: '/prazos' },
    { label: 'Documentos',        value: data.totalDocumentos,  icon: FileText, cor: '#2e7d32', to: '/documentos' },
    ...(!isCliente()
      ? [{ label: 'Clientes', value: data.totalClientes, icon: Users, cor: '#c8a951', to: '/clientes' }]
      : []),
  ] : [];

  const audSlices: Slice[] = (relAud?.porStatus ?? [])
    .map((g) => ({ label: g.status, value: g.total, color: statusColor(g.status) }))
    .filter((s) => s.value > 0);

  const prazoSlices: Slice[] = (relPrazos?.porStatus ?? [])
    .map((g) => ({ label: g.status, value: g.total, color: statusColor(g.status) }))
    .filter((s) => s.value > 0);

  const panorama: Slice[] = data ? [
    { label: 'Processos ativos',   value: data.processosAtivos,    color: '#1B3A6B' },
    { label: 'Encerrados',         value: data.processosEncerrados, color: '#64748b' },
    { label: 'Audiências (mês)',   value: data.audienciasMes,       color: '#2563eb' },
    { label: 'Prazos cumpridos',   value: data.prazosCumpridos,     color: '#2e7d32' },
    { label: 'Documentos',         value: data.totalDocumentos,     color: '#c8a951' },
    ...(!isCliente() ? [{ label: 'Clientes', value: data.totalClientes, color: '#5b21b6' }] : []),
  ].filter((s) => s.value > 0) : [];

  const resumo = [
    { label: 'Processos encerrados', value: data?.processosEncerrados, cor: '#2e7d32', ic: CheckCircle },
    { label: 'Audiências do mês',    value: data?.audienciasMes,       cor: '#2563eb', ic: Calendar },
    { label: 'Prazos cumpridos',     value: data?.prazosCumpridos,     cor: '#c8a951', ic: Gavel },
    { label: 'Honorários atrasados', value: data?.honariosAtrasados,   cor: '#c62828', ic: AlertTriangle },
    ...(isAdmin()
      ? [{ label: 'Advogados ativos', value: data?.totalAdvogados, cor: '#1B3A6B', ic: Briefcase }]
      : []),
    { label: 'Novos clientes (mês)', value: data?.novosClientesMes, cor: '#5b21b6', ic: Users },
  ];

  return (
    <div className="section-gap dash-root">
      {/* ── hero ──────────────────────────────────────────── */}
      <div className="dash-hero dash-fade-in">
        <div className="dash-hero-texto">
          <span className="dash-hero-eyebrow">Painel de controle</span>
          <h1>
            {saudacao()}{user?.nomeCompleto ? `, ${user.nomeCompleto.split(' ')[0]}` : ''}
          </h1>
          <p>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
            })}
            {' · '}visão geral do escritório
          </p>
        </div>
        {!isCliente() && (
          <div className="dash-hero-acoes">
            <Link to="/processos/novo" className="btn-hero btn-hero--ouro">
              <Scale size={16} strokeWidth={2} /> Novo processo
            </Link>
            <Link to="/audiencias/nova" className="btn-hero">
              <Calendar size={16} strokeWidth={2} /> Nova audiência
            </Link>
            <Link to="/prazos/novo" className="btn-hero">
              <Clock size={16} strokeWidth={2} /> Novo prazo
            </Link>
          </div>
        )}
      </div>

      {/* ── KPI cards ──────────────────────────────────────── */}
      <div className="kpi-grid">
        {isLoading
          ? Array(5).fill(null).map((_, i) => <LoadingCard key={i} />)
          : cards.map(({ label, value, icon, cor, to }, i) => (
              <KpiCard key={label} label={label} value={value} icon={icon} cor={cor} to={to} index={i} />
            ))
        }
      </div>

      {/* ── gráficos ───────────────────────────────────────── */}
      <div className="charts-grid">
        <div className="card card-anim" style={{ '--card-delay': '0ms' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-icon"><PieChart size={16} strokeWidth={1.8} /></div>
            <h2 className="card-header-title">Audiências por situação</h2>
          </div>
          {audSlices.length === 0
            ? <ChartEmpty />
            : <DonutChart data={audSlices} centerLabel="audiências" />}
        </div>

        <div className="card card-anim" style={{ '--card-delay': '80ms' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-icon"><Clock size={16} strokeWidth={1.8} /></div>
            <h2 className="card-header-title">Prazos por situação</h2>
          </div>
          {prazoSlices.length === 0
            ? <ChartEmpty />
            : <DonutChart data={prazoSlices} centerLabel="prazos" />}
        </div>

        <div className="card card-anim" style={{ '--card-delay': '160ms' } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-header-icon"><BarChart3 size={16} strokeWidth={1.8} /></div>
            <h2 className="card-header-title">Panorama do escritório</h2>
          </div>
          {panorama.length === 0
            ? <ChartEmpty />
            : <BarList data={panorama} />}
        </div>
      </div>

      {/* ── conteúdo principal ─────────────────────────────── */}
      <div className="app-grid">
        <div className="painel-col">
          {/* Prazos próximos */}
          <div className="card card-anim" style={{ '--card-delay': '0ms' } as React.CSSProperties}>
            <div className="card-header">
              <div className="card-header-icon"><AlertTriangle size={16} strokeWidth={1.8} /></div>
              <h2 className="card-header-title">Prazos vencendo (7 dias)</h2>
              {data && (
                <Link to="/prazos" className="card-header-link">ver todos</Link>
              )}
            </div>

            {isLoading ? (
              <div className="estado">Carregando prazos...</div>
            ) : !data || data.prazosProximos.length === 0 ? (
              <div className="estado estado--ok">
                <CheckCircle size={26} strokeWidth={1.5} />
                <span>Nenhum prazo próximo. Tudo em dia.</span>
              </div>
            ) : (
              <ul className="lista-divide">
                {data.prazosProximos.map((p: PrazoResumo, i: number) => {
                  const urg = urgencia(p.dataVencimento);
                  return (
                    <li key={p.id} className="lista-item-anim" style={{ '--item-delay': `${i * 50}ms` } as React.CSSProperties}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="lista-titulo">{p.descricao}</div>
                        <div className="lista-sub">{p.processoTitulo}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        {urg && (
                          <span className="urgencia-chip" style={{ color: urg.cor, borderColor: `${urg.cor}44`, background: `${urg.cor}12` }}>
                            <urg.icon size={11} strokeWidth={2.5} />
                            {urg.label}
                          </span>
                        )}
                        <span className="lista-data">{formatDate(p.dataVencimento)}</span>
                        <span className={badgeClasse(p.status)}>{p.status}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Processos recentes */}
          <div className="card card--overflow card-anim" style={{ '--card-delay': '80ms' } as React.CSSProperties}>
            <div className="card-header" style={{ padding: '20px 22px 0' }}>
              <div className="card-header-icon"><Scale size={16} strokeWidth={1.8} /></div>
              <h2 className="card-header-title">Processos recentes</h2>
              {data?.processosRecentes && (
                <Link to="/processos" className="card-header-link">ver todos</Link>
              )}
            </div>

            {isLoading ? (
              <div className="estado">Carregando processos...</div>
            ) : !data?.processosRecentes?.length ? (
              <div className="estado">Nenhum processo recente.</div>
            ) : (
              <div className="tabela-wrap">
                <table className="tabela">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Título</th>
                      <th>Área</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.processosRecentes.map((p: ProcessoResumo) => (
                      <tr key={p.id} className="clicavel">
                        <td className="mono">{p.numero}</td>
                        <td className="negrito truncar">{p.titulo}</td>
                        <td className="muted">{p.areaDireito}</td>
                        <td><span className={badgeClasse(p.status)}>{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* coluna lateral */}
        <div className="painel-col">
          {/* Próximas audiências */}
          <div className="card card-anim" style={{ '--card-delay': '40ms' } as React.CSSProperties}>
            <div className="card-header">
              <div className="card-header-icon"><Calendar size={16} strokeWidth={1.8} /></div>
              <h2 className="card-header-title">Próximas audiências</h2>
              {data && <Link to="/audiencias" className="card-header-link">ver</Link>}
            </div>

            {isLoading ? (
              <div className="estado">Carregando...</div>
            ) : !data || data.audienciasProximas.length === 0 ? (
              <div className="estado">Nenhuma audiência próxima.</div>
            ) : (
              <ul className="timeline">
                {data.audienciasProximas.map((a: AudienciaResumo, i: number) => (
                  <li key={a.id} className="timeline-item lista-item-anim" style={{ '--item-delay': `${i * 50}ms` } as React.CSSProperties}>
                    <span className="timeline-ponto" />
                    <div style={{ minWidth: 0 }}>
                      <div className="lista-titulo truncar">{a.processoTitulo}</div>
                      <div className="timeline-meta">
                        <span>{a.tipoAudienciaNome}</span>
                        <span className="timeline-data">{formatDateTime(a.dataHora)}</span>
                      </div>
                      <span className={badgeClasse(a.status)}>{a.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Resumo rápido */}
          <div className="card card-anim" style={{ '--card-delay': '120ms' } as React.CSSProperties}>
            <div className="card-header">
              <div className="card-header-icon"><TrendingUp size={16} strokeWidth={1.8} /></div>
              <h2 className="card-header-title">Resumo</h2>
            </div>
            <div className="resumo-lista">
              {resumo.map(({ label, value, cor, ic: Ic }) => (
                <div key={label} className="resumo-item">
                  <span className="resumo-ic" style={{ background: `${cor}1a`, color: cor }}>
                    <Ic size={15} strokeWidth={2} />
                  </span>
                  <span className="resumo-label">{label}</span>
                  <AnimatedResumoValue value={value} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Valor animado isolado para evitar re-render do pai. */
function AnimatedResumoValue({ value }: { value: number | undefined }) {
  const animated = useCountUp(value);
  return <span className="resumo-valor">{animated ?? '—'}</span>;
}
