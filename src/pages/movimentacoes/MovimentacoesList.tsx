import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { movimentacoesApi } from '../../api/movimentacoes';
import { processosApi } from '../../api/processos';
import { usePermission } from '../../hooks/usePermission';
import { formatDateTime } from '../../utils/formatters';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

const TIPOS = ['Criacao', 'Atualizacao', 'Audiencia', 'Prazo', 'Documento', 'StatusChange'];

export function MovimentacoesList() {
  const { hasRole } = usePermission();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ processoId: '', descricao: '', tipo: 'Atualizacao' });
  const [formError, setFormError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['movimentacoes'],
    queryFn: () => movimentacoesApi.listar().then((r) => r.data),
  });

  const { data: processos } = useQuery({
    queryKey: ['processos'],
    queryFn: () => processosApi.listar().then((r) => r.data),
    enabled: showForm,
  });

  const mutation = useMutation({
    mutationFn: () => movimentacoesApi.criar({
      processoId: Number(form.processoId),
      descricao: form.descricao,
      tipo: form.tipo,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['movimentacoes'] });
      setShowForm(false);
      setForm({ processoId: '', descricao: '', tipo: 'Atualizacao' });
      setFormError('');
    },
    onError: (err: any) => setFormError(err.response?.data?.mensagem ?? 'Erro ao registrar.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.processoId) { setFormError('Selecione o processo.'); return; }
    if (!form.descricao.trim()) { setFormError('Descrição obrigatória.'); return; }
    setFormError('');
    mutation.mutate();
  };

  return (
    <div className="section-gap">
      <div className="page-header">
        <div>
          <h1>Movimentações</h1>
          <p>Histórico de movimentações processuais</p>
        </div>
        {hasRole('Administrador', 'Advogado') && (
          <button onClick={() => setShowForm((v) => !v)} className="btn-primario">
            <Plus size={15} strokeWidth={1.8} /> Registrar
          </button>
        )}
      </div>

      {showForm && (
        <div className="card">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>Nova Movimentação</h2>
          <form onSubmit={handleSubmit} className="form-stack">
            <div className="form-grid-2">
              <div className="form-campo">
                <label>Processo</label>
                <select className="form-select" value={form.processoId}
                  onChange={(e) => setForm((f) => ({ ...f, processoId: e.target.value }))}>
                  <option value="">Selecione</option>
                  {processos?.map((p) => <option key={p.id} value={p.id}>{p.titulo}</option>)}
                </select>
              </div>
              <div className="form-campo">
                <label>Tipo</label>
                <select className="form-select" value={form.tipo}
                  onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}>
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-campo">
              <label>Descrição</label>
              <textarea className="form-textarea" rows={2} maxLength={1000} value={form.descricao}
                onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} />
            </div>
            {formError && <p className="form-mensagem-erro">{formError}</p>}
            <div className="form-acoes">
              <button type="button" className="btn-secundario" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" disabled={mutation.isPending} className="btn-primario">
                {mutation.isPending ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card card--overflow">
        {isLoading ? (
          <div className="estado">Carregando movimentações...</div>
        ) : !data || data.length === 0 ? (
          <div className="estado">Nenhuma movimentação encontrada.</div>
        ) : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Data/Hora</th><th>Processo</th><th>Tipo</th><th>Descrição</th><th>Usuário</th>
                </tr>
              </thead>
              <tbody>
                {data.map((m) => (
                  <tr key={m.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(m.dataHora)}</td>
                    <td className="negrito truncar">{m.processoTitulo ?? '—'}</td>
                    <td><span className={bc(m.tipo)}>{m.tipo}</span></td>
                    <td className="truncar">{m.descricao}</td>
                    <td className="muted truncar">{m.usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
