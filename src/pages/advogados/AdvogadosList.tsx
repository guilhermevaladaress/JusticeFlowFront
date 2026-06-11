import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { advogadosApi } from '../../api/advogados';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { formatOAB, maskCPF, maskTelefone } from '../../utils/formatters';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { CreateAdvogadoRequest } from '../../types/advogado';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

const FORM_VAZIO: CreateAdvogadoRequest = {
  nomeCompleto: '', email: '', senha: '', numeroOAB: '', uf: '',
  especialidade: '', cpf: '', telefone: '',
};

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

export function AdvogadosList() {
  const qc = useQueryClient();
  const [confirmId,    setConfirmId]    = useState<number | null>(null);
  const [modalAberto,  setModalAberto]  = useState(false);
  const [form,         setForm]         = useState<CreateAdvogadoRequest>(FORM_VAZIO);
  const [erroForm,     setErroForm]     = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const { data: advogados, isLoading } = useQuery({
    queryKey: ['advogados'],
    queryFn: () => advogadosApi.listar().then((r) => r.data),
  });

  const inativarMutation = useMutation({
    mutationFn: (id: number) => advogadosApi.inativar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['advogados'] }); setConfirmId(null); },
  });

  const criarMutation = useMutation({
    mutationFn: (data: CreateAdvogadoRequest) => advogadosApi.criar(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['advogados'] });
      fecharModal();
    },
    onError: (err: any) => setErroForm(err.response?.data?.mensagem ?? 'Erro ao cadastrar advogado.'),
  });

  function set(campo: keyof CreateAdvogadoRequest, valor: string) {
    setForm(f => ({ ...f, [campo]: valor }));
  }

  function fecharModal() {
    setModalAberto(false);
    setForm(FORM_VAZIO);
    setErroForm('');
  }

  function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    setErroForm('');
    criarMutation.mutate(form);
  }

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>Advogados</h1><p>{advogados?.length ?? 0} advogado(s) cadastrado(s)</p></div>
        <button className="btn-primario" onClick={() => setModalAberto(true)}>
          <Plus size={15} strokeWidth={2} /> Novo Advogado
        </button>
      </div>

      <div className="card card--overflow">
        {isLoading ? (
          <div className="estado">Carregando advogados...</div>
        ) : !advogados || advogados.length === 0 ? (
          <div className="estado">Nenhum advogado cadastrado.</div>
        ) : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr><th>Nome</th><th>E-mail</th><th>OAB</th><th>Especialidade</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {advogados.map((a) => (
                  <tr key={a.id}>
                    <td className="negrito">{a.nomeCompleto}</td>
                    <td className="muted">{a.email}</td>
                    <td className="mono">{formatOAB(a.numeroOAB, a.uf)}</td>
                    <td className="muted">{a.especialidade ?? '—'}</td>
                    <td><span className={bc(a.status)}>{a.status}</span></td>
                    <td>
                      {a.status === 'Ativo' && (
                        <button className="btn-acao btn-acao--perigo" onClick={() => setConfirmId(a.id)}>
                          Inativar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal novo advogado */}
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-box modal-box--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Novo Advogado</h2>
              <button type="button" className="btn-icone" onClick={fecharModal} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={aoEnviar} className="modal-body">
              {erroForm && <p className="form-mensagem-erro">{erroForm}</p>}

              <p className="modal-secao-titulo">Dados pessoais</p>
              <div className="form-grid-2">
                <div className="form-campo col-2">
                  <label>Nome completo *</label>
                  <input className="form-input" maxLength={150} required
                    value={form.nomeCompleto} onChange={e => set('nomeCompleto', e.target.value)} />
                </div>
                <div className="form-campo">
                  <label>E-mail *</label>
                  <input type="email" className="form-input" maxLength={150} required
                    value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="form-campo">
                  <label>Senha *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      className="form-input"
                      minLength={6} maxLength={50} required
                      value={form.senha} onChange={e => set('senha', e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      style={{ paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(v => !v)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '0.75rem' }}
                    >
                      {mostrarSenha ? 'ocultar' : 'mostrar'}
                    </button>
                  </div>
                </div>
                <div className="form-campo">
                  <label>CPF</label>
                  <input className="form-input" maxLength={14} placeholder="000.000.000-00"
                    value={form.cpf ?? ''} onChange={e => set('cpf', maskCPF(e.target.value))} />
                </div>
                <div className="form-campo">
                  <label>Telefone</label>
                  <input className="form-input" maxLength={15} placeholder="(00) 00000-0000"
                    value={form.telefone ?? ''} onChange={e => set('telefone', maskTelefone(e.target.value))} />
                </div>
              </div>

              <p className="modal-secao-titulo" style={{ marginTop: 20 }}>Dados profissionais</p>
              <div className="form-grid-2">
                <div className="form-campo">
                  <label>Número OAB *</label>
                  <input className="form-input" maxLength={20} required placeholder="Ex: 123456"
                    value={form.numeroOAB} onChange={e => set('numeroOAB', e.target.value)} />
                </div>
                <div className="form-campo">
                  <label>UF *</label>
                  <select className="form-select" required
                    value={form.uf} onChange={e => set('uf', e.target.value)}>
                    <option value="">Selecione</option>
                    {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                </div>
                <div className="form-campo col-2">
                  <label>Especialidade</label>
                  <input className="form-input" maxLength={100} placeholder="Ex: Direito Civil, Trabalhista..."
                    value={form.especialidade ?? ''} onChange={e => set('especialidade', e.target.value)} />
                </div>
              </div>

              <div className="form-acoes" style={{ marginTop: 24 }}>
                <button type="button" className="btn-secundario" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="btn-primario" disabled={criarMutation.isPending}>
                  {criarMutation.isPending ? 'Cadastrando...' : 'Cadastrar Advogado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Inativar Advogado"
        description="Tem certeza? O advogado não poderá ser vinculado a novos processos."
        onConfirm={() => confirmId !== null && inativarMutation.mutate(confirmId)}
        onCancel={() => setConfirmId(null)}
        loading={inativarMutation.isPending}
      />
    </div>
  );
}
