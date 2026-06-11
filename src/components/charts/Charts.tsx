/**
 * Gráficos leves em SVG/CSS — sem dependências externas.
 * Usam a paleta institucional JusticeFlow (navy + ouro) via cores passadas por prop.
 */

export interface Slice {
  label: string;
  value: number;
  color: string;
}

/** Mapeia o status textual para a cor da paleta (mesma lógica dos badges). */
export function statusColor(status: string): string {
  const s = (status || '').toLowerCase().replace(/\s+/g, '');
  if (['ativo', 'cumprido', 'realizada', 'pago', 'concluido', 'concluído'].includes(s)) return '#2e7d32';
  if (['pendente', 'suspenso', 'emanalise', 'emandamento'].includes(s)) return '#c8a951';
  if (['agendada', 'agendado'].includes(s)) return '#2563eb';
  if (['vencido', 'cancelada', 'cancelado', 'atrasado'].includes(s)) return '#c62828';
  if (['adiada', 'adiado'].includes(s)) return '#e65100';
  if (['encerrado', 'arquivado', 'inativo'].includes(s)) return '#64748b';
  return '#1B3A6B';
}

/* ──────────────────────────────────────────────────────────
   DONUT
────────────────────────────────────────────────────────── */
interface DonutProps {
  data: Slice[];
  size?: number;
  thickness?: number;
  centerValue?: string | number;
  centerLabel?: string;
}

export function DonutChart({
  data,
  size = 168,
  thickness = 20,
  centerValue,
  centerLabel,
}: DonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = (size - thickness) / 2;
  const circ = 2 * Math.PI * radius;
  const cx = size / 2;

  let acc = 0;

  return (
    <div className="donut">
      <div className="donut-svg" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* trilho de fundo */}
          <circle
            cx={cx}
            cy={cx}
            r={radius}
            fill="none"
            stroke="#eef2f7"
            strokeWidth={thickness}
          />
          {total > 0 &&
            data.map((d, i) => {
              const frac = d.value / total;
              const len = frac * circ;
              const seg = (
                <circle
                  key={i}
                  cx={cx}
                  cy={cx}
                  r={radius}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={thickness}
                  strokeLinecap="round"
                  strokeDasharray={`${Math.max(len - 2, 0)} ${circ - Math.max(len - 2, 0)}`}
                  strokeDashoffset={-acc}
                  transform={`rotate(-90 ${cx} ${cx})`}
                  className="donut-seg"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              );
              acc += len;
              return seg;
            })}
        </svg>
        <div className="donut-center">
          <span className="donut-center-valor">{centerValue ?? total}</span>
          {centerLabel && <span className="donut-center-rotulo">{centerLabel}</span>}
        </div>
      </div>

      <ul className="donut-legenda">
        {data.map((d, i) => (
          <li key={i}>
            <span className="donut-bolinha" style={{ background: d.color }} />
            <span className="donut-leg-label">{d.label}</span>
            <span className="donut-leg-val">{d.value}</span>
            <span className="donut-leg-pct">
              {total > 0 ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   BARRAS HORIZONTAIS
────────────────────────────────────────────────────────── */
interface BarListProps {
  data: Slice[];
}

export function BarList({ data }: BarListProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="barlist">
      {data.map((d, i) => (
        <li key={i} className="barlist-row">
          <span className="barlist-label">{d.label}</span>
          <span className="barlist-track">
            <span
              className="barlist-fill"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color }}
            />
          </span>
          <span className="barlist-val">{d.value}</span>
        </li>
      ))}
    </ul>
  );
}

/* ──────────────────────────────────────────────────────────
   ESTADO VAZIO PARA GRÁFICO
────────────────────────────────────────────────────────── */
export function ChartEmpty({ texto = 'Sem dados para exibir' }: { texto?: string }) {
  return <div className="chart-vazio">{texto}</div>;
}
