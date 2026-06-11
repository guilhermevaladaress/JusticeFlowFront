import { useQuery } from '@tanstack/react-query';
import { relatoriosApi } from '../../api/relatorios';
import { formatMoney } from '../../utils/formatters';
import { usePermission } from '../../hooks/usePermission';
import { Calendar, Clock, Scale, DollarSign } from 'lucide-react';
import { DonutChart, BarList, ChartEmpty, statusColor, type Slice } from '../../components/charts/Charts';
import type {
  RelatorioPrazos, RelatorioAudiencias, RelatorioProcessos, RelatorioHonorarios,
} from '../../types/relatorio';

export function Relatorios() {
  const { isAdmin } = usePermission();

  const { data: prazos,     isLoading: lp  } = useQuery({ queryKey: ['rel-prazos'],     queryFn: () => relatoriosApi.prazos().then((r) => r.data as RelatorioPrazos) });
  const { data: audiencias, isLoading: la  } = useQuery({ queryKey: ['rel-audiencias'], queryFn: () => relatoriosApi.audiencias().then((r) => r.data as RelatorioAudiencias) });
  const { data: processos,  isLoading: lpr } = useQuery({ queryKey: ['rel-processos'],  queryFn: () => relatoriosApi.processos().then((r) => r.data as RelatorioProcessos), enabled: isAdmin() });
  const { data: honorarios, isLoading: lh  } = useQuery({ queryKey: ['rel-honorarios'], queryFn: () => relatoriosApi.honorarios().then((r) => r.data as RelatorioHonorarios), enabled: isAdmin() });

  if (lp || la) return <div className="estado" style={{ paddingTop: 80 }}>Carregando relatórios...</div>;

  const audSlices: Slice[] = (audiencias?.porStatus ?? [])
    .map((g) => ({ label: g.status, value: g.total, color: statusColor(g.status) }))
    .filter((s) => s.value > 0);

  const prazoSlices: Slice[] = (prazos?.porStatus ?? [])
    .map((g) => ({ label: g.status, value: g.total, color: statusColor(g.status) }))
    .filter((s) => s.value > 0);

  const procStatus: Slice[] = (processos?.porStatus ?? [])
    .map((g) => ({ label: g.status, value: g.total, color: statusColor(g.status) }));

  const procTipo: Slice[] = (processos?.porTipo ?? [])
    .map((g, i) => ({ label: g.tipo, value: g.total, color: ['#1B3A6B', '#2563eb', '#c8a951', '#5b21b6', '#2e7d32', '#e65100'][i % 6] }));

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>Relatórios</h1><p>Visão consolidada dos dados do escritório</p></div>
      </div>

      {/* Gráficos por situação */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-header-icon"><Calendar size={16} strokeWidth={1.8} /></div>
            <h2 className="card-header-title">Audiências por situação</h2>
          </div>
          {audSlices.length === 0 ? <ChartEmpty /> : <DonutChart data={audSlices} centerLabel="audiências" />}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-header-icon"><Clock size={16} strokeWidth={1.8} /></div>
            <h2 className="card-header-title">Prazos por situação</h2>
          </div>
          {prazoSlices.length === 0 ? <ChartEmpty /> : <DonutChart data={prazoSlices} centerLabel="prazos" />}
        </div>

        {prazos && (
          <div className="card">
            <div className="card-header">
              <div className="card-header-icon"><Clock size={16} strokeWidth={1.8} /></div>
              <h2 className="card-header-title">Indicadores de prazos</h2>
            </div>
            <div className="resumo-lista">
              <div className="resumo-item">
                <span className="resumo-ic" style={{ background: '#1B3A6B1a', color: '#1B3A6B' }}><Clock size={15} strokeWidth={2} /></span>
                <span className="resumo-label">Total de prazos</span>
                <span className="resumo-valor">{prazos.total}</span>
              </div>
              <div className="resumo-item">
                <span className="resumo-ic" style={{ background: '#c628281a', color: '#c62828' }}><Clock size={15} strokeWidth={2} /></span>
                <span className="resumo-label">Vencidos</span>
                <span className="resumo-valor">{prazos.vencidos}</span>
              </div>
              <div className="resumo-item">
                <span className="resumo-ic" style={{ background: '#e651001a', color: '#e65100' }}><Clock size={15} strokeWidth={2} /></span>
                <span className="resumo-label">Vencendo em 7 dias</span>
                <span className="resumo-valor">{prazos.vencendoEm7Dias}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Processos (Admin) */}
      {isAdmin() && !lpr && processos && (
        <div className="charts-grid">
          <div className="card">
            <div className="card-header">
              <div className="card-header-icon"><Scale size={16} strokeWidth={1.8} /></div>
              <h2 className="card-header-title">Processos por status</h2>
            </div>
            {procStatus.length === 0 ? <ChartEmpty /> : <BarList data={procStatus} />}
          </div>
          <div className="card">
            <div className="card-header">
              <div className="card-header-icon"><Scale size={16} strokeWidth={1.8} /></div>
              <h2 className="card-header-title">Processos por tipo</h2>
            </div>
            {procTipo.length === 0 ? <ChartEmpty /> : <BarList data={procTipo} />}
          </div>
        </div>
      )}

      {/* Honorários (Admin) */}
      {isAdmin() && !lh && honorarios && (
        <div className="card">
          <div className="card-header">
            <div className="card-header-icon"><DollarSign size={16} strokeWidth={1.8} /></div>
            <h2 className="card-header-title">Honorários</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16 }}>
            {[
              { label: 'Valor total',    value: honorarios.valorTotal,    cor: '#1B3A6B' },
              { label: 'Recebido',       value: honorarios.valorRecebido, cor: '#2e7d32' },
              { label: 'Pendente',       value: honorarios.valorPendente, cor: '#92640a' },
              { label: 'Atrasado',       value: honorarios.valorAtrasado, cor: '#c62828' },
            ].map(({ label, value, cor }) => (
              <div key={label} style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: cor }}>{formatMoney(value)}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
