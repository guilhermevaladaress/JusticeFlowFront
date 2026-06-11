/**
 * Gráficos leves em SVG/CSS — sem dependências externas.
 * Usam a paleta institucional JusticeFlow (navy + ouro) via cores passadas por prop.
 */
import { useState, useRef } from 'react';

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
   TOOLTIP INTERNO
────────────────────────────────────────────────────────── */
interface TooltipInfo {
  label: string;
  value: number;
  pct?: number;
  extra?: string;
  color?: string;
  x: number;
  y: number;
}

function ChartTooltip({ info }: { info: TooltipInfo }) {
  return (
    <div className="chart-tooltip" style={{ left: info.x, top: info.y }}>
      <span className="chart-tooltip-label">
        {info.color && (
          <span className="chart-tooltip-dot" style={{ background: info.color }} />
        )}
        {info.label}
      </span>
      <span className="chart-tooltip-val">
        {info.extra ?? info.value}
        {info.pct !== undefined && (
          <span className="chart-tooltip-pct"> · {info.pct}%</span>
        )}
      </span>
    </div>
  );
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
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = (size - thickness) / 2;
  const circ = 2 * Math.PI * radius;
  const cx = size / 2;

  const getRelPos = (e: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  let acc = 0;

  return (
    <div className="donut">
      <div className="donut-svg" ref={containerRef} style={{ width: size, height: size }}>
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
                  style={{ animationDelay: `${i * 120}ms`, cursor: 'pointer' }}
                  onMouseMove={(e) => {
                    const pos = getRelPos(e);
                    setTooltip({
                      label: d.label,
                      value: d.value,
                      pct: total > 0 ? Math.round((d.value / total) * 100) : 0,
                      color: d.color,
                      ...pos,
                    });
                    setActiveLabel(d.label);
                  }}
                  onMouseLeave={() => { setTooltip(null); setActiveLabel(null); }}
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
        {tooltip && <ChartTooltip info={tooltip} />}
      </div>

      <ul className="donut-legenda">
        {data.map((d, i) => {
          const isActive = activeLabel === d.label;
          const isDimmed = activeLabel !== null && !isActive;
          return (
            <li
              key={i}
              style={{
                opacity: isDimmed ? 0.45 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              <span
                className="donut-bolinha"
                style={{
                  background: d.color,
                  transform: isActive ? 'scale(1.35)' : 'scale(1)',
                  transition: 'transform 0.15s',
                }}
              />
              <span
                className="donut-leg-label"
                style={{ fontWeight: isActive ? 600 : undefined, color: isActive ? '#0f172a' : undefined }}
              >
                {d.label}
              </span>
              <span className="donut-leg-val">{d.value}</span>
              <span className="donut-leg-pct">
                {total > 0 ? Math.round((d.value / total) * 100) : 0}%
              </span>
            </li>
          );
        })}
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
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  const getRelPos = (e: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative' }}
      onMouseLeave={() => { setTooltip(null); setActiveLabel(null); }}
    >
      <ul className="barlist">
        {data.map((d, i) => {
          const isActive = activeLabel === d.label;
          const isDimmed = activeLabel !== null && !isActive;
          return (
            <li
              key={i}
              className="barlist-row"
              style={{ opacity: isDimmed ? 0.45 : 1, transition: 'opacity 0.15s' }}
              onMouseMove={(e) => {
                setTooltip({ label: d.label, value: d.value, color: d.color, ...getRelPos(e) });
                setActiveLabel(d.label);
              }}
            >
              <span
                className="barlist-label"
                style={{ fontWeight: isActive ? 600 : undefined, color: isActive ? '#0f172a' : undefined }}
              >
                {d.label}
              </span>
              <span className="barlist-track">
                <span
                  className="barlist-fill"
                  style={{ width: `${(d.value / max) * 100}%`, background: d.color }}
                />
              </span>
              <span className="barlist-val">{d.value}</span>
            </li>
          );
        })}
      </ul>
      {tooltip && <ChartTooltip info={tooltip} />}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   BARRAS VERTICAIS (novo)
────────────────────────────────────────────────────────── */
interface VerticalBarProps {
  data: Slice[];
  height?: number;
}

export function VerticalBarChart({ data, height = 128 }: VerticalBarProps) {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  const getRelPos = (e: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div
      ref={containerRef}
      className="vbar-wrap"
      onMouseLeave={() => { setTooltip(null); setActiveLabel(null); }}
    >
      <div className="vbar-chart" style={{ height }}>
        {data.map((d, i) => {
          const isActive = activeLabel === d.label;
          const isDimmed = activeLabel !== null && !isActive;
          return (
            <div
              key={i}
              className="vbar-col"
              style={{ opacity: isDimmed ? 0.45 : 1, transition: 'opacity 0.15s' }}
              onMouseMove={(e) => {
                setTooltip({ label: d.label, value: d.value, color: d.color, ...getRelPos(e) });
                setActiveLabel(d.label);
              }}
            >
              <div className="vbar-val-top" />
              <div className="vbar-track">
                <div
                  className="vbar-fill"
                  style={{
                    height: `${(d.value / max) * 100}%`,
                    background: d.color,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              <span
                className="vbar-label"
                style={{ fontWeight: isActive ? 700 : undefined, color: isActive ? '#0f172a' : undefined }}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
      {tooltip && <ChartTooltip info={tooltip} />}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   GRÁFICO FINANCEIRO (honorários)
────────────────────────────────────────────────────────── */
interface FinanceBarProps {
  items: { label: string; value: number; color: string; formatted: string }[];
  total: number;
}

export function FinanceBarChart({ items, total }: FinanceBarProps) {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRelPos = (e: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative' }}
      onMouseLeave={() => { setTooltip(null); setActiveLabel(null); }}
    >
      {/* barra empilhada */}
      <div className="finance-stack">
        {items.filter((it) => it.value > 0).map((it, i) => {
          const isDimmed = activeLabel !== null && activeLabel !== it.label;
          return (
            <div
              key={i}
              className="finance-seg"
              style={{
                width: total > 0 ? `${(it.value / total) * 100}%` : '0%',
                background: it.color,
                opacity: isDimmed ? 0.35 : 1,
                transition: 'opacity 0.15s',
              }}
              onMouseMove={(e) => {
                const pct = total > 0 ? Math.round((it.value / total) * 100) : 0;
                setTooltip({ label: it.label, value: it.value, extra: it.formatted, pct, color: it.color, ...getRelPos(e) });
                setActiveLabel(it.label);
              }}
            />
          );
        })}
      </div>
      {/* legenda */}
      <ul className="finance-legenda">
        {items.map((it, i) => {
          const isActive = activeLabel === it.label;
          const isDimmed = activeLabel !== null && !isActive;
          return (
            <li
              key={i}
              className="finance-leg-item"
              style={{ opacity: isDimmed ? 0.45 : 1, transition: 'opacity 0.15s' }}
            >
              <span
                className="finance-bolinha"
                style={{
                  background: it.color,
                  transform: isActive ? 'scale(1.35)' : 'scale(1)',
                  transition: 'transform 0.15s',
                }}
              />
              <span
                className="finance-leg-label"
                style={{ fontWeight: isActive ? 600 : undefined, color: isActive ? '#0f172a' : undefined }}
              >
                {it.label}
              </span>
              <span className="finance-leg-val" style={{ color: it.color }}>{it.formatted}</span>
            </li>
          );
        })}
      </ul>
      {tooltip && <ChartTooltip info={tooltip} />}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   ESTADO VAZIO PARA GRÁFICO
────────────────────────────────────────────────────────── */
export function ChartEmpty({ texto = 'Sem dados para exibir' }: { texto?: string }) {
  return <div className="chart-vazio">{texto}</div>;
}
