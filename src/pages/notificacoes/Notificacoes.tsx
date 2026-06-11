import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { notificacoesApi } from '../../api/notificacoes';
import { formatDateTime } from '../../utils/formatters';

export function Notificacoes() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: notificacoes, isLoading } = useQuery({
    queryKey: ['notificacoes'],
    queryFn: () => notificacoesApi.listar().then((r) => r.data),
  });

  const lerMutation = useMutation({
    mutationFn: (id: number) => notificacoesApi.marcarLida(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notificacoes'] });
      qc.invalidateQueries({ queryKey: ['notificacoes-nao-lidas'] });
    },
  });

  const lerTodasMutation = useMutation({
    mutationFn: () => notificacoesApi.marcarTodasLidas(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notificacoes'] });
      qc.invalidateQueries({ queryKey: ['notificacoes-nao-lidas'] });
    },
  });

  function handleClick(id: number, processoId?: number) {
    lerMutation.mutate(id);
    if (processoId) navigate(`/processos/${processoId}`);
  }

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>Notificações</h1><p>Avisos e alertas do sistema</p></div>
        <button onClick={() => lerTodasMutation.mutate()} disabled={lerTodasMutation.isPending}
          className="btn-secundario">
          <CheckCheck size={14} strokeWidth={1.8} /> Marcar todas como lidas
        </button>
      </div>

      <div className="card card--overflow">
        {isLoading ? (
          <div className="estado">Carregando notificações...</div>
        ) : !notificacoes || notificacoes.length === 0 ? (
          <div className="estado">Nenhuma notificação.</div>
        ) : (
          <ul className="notif-lista">
            {notificacoes.map((n) => (
              <li
                key={n.id}
                onClick={() => handleClick(n.id, n.processoId)}
                className={`notif-item${!n.lida ? ' notif-item--nao-lida' : ''}`}
              >
                <div className="notif-icone-wrap"
                  style={{ background: !n.lida ? '#dbeafe' : '#f1f5f9' }}>
                  <Bell size={16} strokeWidth={1.8}
                    style={{ color: !n.lida ? '#1e40af' : '#94a3b8' }} />
                </div>
                <div className="notif-corpo">
                  <p className="notif-titulo">{n.titulo}</p>
                  <p className="notif-mensagem">{n.mensagem}</p>
                  <p className="notif-data">{formatDateTime(n.dataCriacao)}</p>
                </div>
                {!n.lida && <div className="notif-bolinha" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
