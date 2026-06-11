import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Edit2, MapPin, X, Loader2 } from 'lucide-react';
import { clientesApi } from '../../api/clientes';
import { contratosApi } from '../../api/contratos';
import { formatDate, formatCNPJ } from '../../utils/formatters';
import type { ClienteRequest } from '../../types/cliente';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

async function buscarViaCep(cep: string) {
  const res = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
  const data = await res.json();
  if (data.erro) throw new Error('CEP não encontrado.');
  return data;
}

export function ClienteDetail() {
  const { id } = useParams();
  const qc = useQueryClient();

  const [modalAberto, setModalAberto] = useState(false);
  const [form,        setForm]        = useState<ClienteRequest | null>(null);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep,     setErroCep]     = useState('');
  const [erroForm,    setErroForm]    = useState('');

  const { data: cliente, isLoading } = useQuery({
    queryKey: ['cliente', id],
    queryFn: () => clientesApi.detalhar(Number(id)).then((r) => r.data),
  });

  const { data: contratos } = useQuery({
    queryKey: ['contratos'],
    queryFn: () => contratosApi.listar().then((r) => r.data),
  });

  const atualizar = useMutation({
    mutationFn: (data: ClienteRequest) => clientesApi.atualizar(Number(id), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cliente', id] });
      fecharModal();
    },
    onError: (err: any) => setErroForm(err.response?.data?.mensagem ?? 'Erro ao atualizar cliente.'),
  });

  function abrirModal() {
    if (!cliente) return;
    setForm({
      nomeCompleto: cliente.nomeCompleto,
      email:        cliente.email,
      tipo:         cliente.tipo,
      cpf:          cliente.cpf          ?? '',
      cnpj:         cliente.cnpj         ?? '',
      razaoSocial:  cliente.razaoSocial  ?? '',
      nomeFantasia: cliente.nomeFantasia ?? '',
      telefone:     cliente.telefone     ?? '',
      cep:          cliente.cep          ?? '',
      logradouro:   cliente.logradouro   ?? '',
      numero:       cliente.numero       ?? '',
      complemento:  cliente.complemento  ?? '',
      bairro:       cliente.bairro       ?? '',
      cidade:       cliente.cidade       ?? '',
      estado:       cliente.estado       ?? '',
    });
    setErroForm('');
    setErroCep('');
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setForm(null);
  }

  async function handleCep(valor: string) {
    setForm(f => f ? { ...f, cep: valor } : f);
    const limpo = valor.replace(/\D/g, '');
    if (limpo.length !== 8) return;
    setBuscandoCep(true);
    setErroCep('');
    try {
      const data = await buscarViaCep(valor);
      setForm(f => f ? {
        ...f,
        logradouro: data.logradouro ?? '',
        bairro:     data.bairro     ?? '',
        cidade:     data.localidade ?? '',
        estado:     data.uf         ?? '',
      } : f);
    } catch (e: any) {
      setErroCep(e.message ?? 'Erro ao consultar CEP.');
    } finally {
      setBuscandoCep(false);
    }
  }

  function set(campo: keyof ClienteRequest, valor: string) {
    setForm(f => f ? { ...f, [campo]: valor } : f);
  }

  function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setErroForm('');
    atualizar.mutate(form);
  }

  if (isLoading) return <div className="estado" style={{ paddingTop: 80 }}>Carregando...</div>;
  if (!cliente)  return <div className="estado">Cliente não encontrado.</div>;

  const contratosCliente = contratos?.filter((c) => c.clienteId === cliente.id) ?? [];
  const temEndereco = cliente.logradouro || cliente.cidade;
  const pfAtivo = form?.tipo === 'PessoaFisica';

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>{cliente.nomeCompleto}</h1><p>Dados do cliente</p></div>
        <button className="btn-secundario" onClick={abrirModal}>
          <Edit2 size={14} strokeWidth={1.8} /> Editar
        </button>
      </div>

      {/* Dados principais */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-header-title">Informações</h2>
        </div>
        <dl className="detalhe-grid">
          {([
            ['E-mail',      cliente.email],
            ['Tipo',        cliente.tipo],
            ['CPF',         cliente.cpf       ?? '—'],
            ['CNPJ',        cliente.cnpj ? formatCNPJ(cliente.cnpj) : '—'],
            ['Razão Social', cliente.razaoSocial ?? '—'],
            ['Telefone',    cliente.telefone  ?? '—'],
            ['Cadastro',    formatDate(cliente.dataCadastro)],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k} className="detalhe-campo">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Endereço */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-icon">
            <MapPin size={15} strokeWidth={1.8} />
          </div>
          <h2 className="card-header-title">Endereço</h2>
          {!temEndereco && (
            <button className="btn-acao" onClick={abrirModal}>+ Adicionar endereço</button>
          )}
        </div>

        {temEndereco ? (
          <dl className="detalhe-grid">
            {([
              ['CEP',         cliente.cep         ?? '—'],
              ['Logradouro',  cliente.logradouro  ?? '—'],
              ['Número',      cliente.numero      ?? '—'],
              ['Complemento', cliente.complemento ?? '—'],
              ['Bairro',      cliente.bairro      ?? '—'],
              ['Cidade',      cliente.cidade      ?? '—'],
              ['Estado',      cliente.estado      ?? '—'],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="detalhe-campo">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', padding: '8px 0' }}>
            Nenhum endereço cadastrado.
          </p>
        )}
      </div>

      {/* Contratos */}
      {contratosCliente.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-header-title">Contratos</h2>
            <span className="card-header-badge">{contratosCliente.length}</span>
          </div>
          <ul className="lista-divide">
            {contratosCliente.map((c) => (
              <li key={c.id}>
                <div>
                  <p style={{ fontWeight: 500, color: '#0f172a', fontSize: '0.875rem' }}>{c.advogadoNome}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Assinado em {formatDate(c.dataAssinatura)}</p>
                </div>
                <span className={bc(c.status)}>{c.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal de edição */}
      {modalAberto && form && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-box modal-box--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Cliente</h2>
              <button type="button" className="btn-icone" onClick={fecharModal} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={aoEnviar} className="modal-body">
              {erroForm && <p className="form-mensagem-erro">{erroForm}</p>}

              {/* Dados pessoais */}
              <p className="modal-secao-titulo">Dados pessoais</p>
              <div className="form-grid-2">
                <div className="form-campo col-2">
                  <label>Tipo de pessoa</label>
                  <div style={{ display: 'flex', gap: 16, marginTop: 2 }}>
                    {(['PessoaFisica', 'PessoaJuridica'] as const).map(t => (
                      <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input type="radio" name="tipo" value={t} checked={form.tipo === t} onChange={() => set('tipo', t)} />
                        {t === 'PessoaFisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-campo">
                  <label>Nome completo *</label>
                  <input className="form-input" maxLength={150} value={form.nomeCompleto ?? ''} onChange={e => set('nomeCompleto', e.target.value)} required />
                </div>
                <div className="form-campo">
                  <label>E-mail *</label>
                  <input type="email" className="form-input" maxLength={150} value={form.email ?? ''} onChange={e => set('email', e.target.value)} required />
                </div>
                <div className="form-campo">
                  <label>Telefone</label>
                  <input className="form-input" maxLength={15} value={form.telefone ?? ''} onChange={e => set('telefone', e.target.value)} placeholder="(00) 00000-0000" />
                </div>

                {pfAtivo ? (
                  <div className="form-campo">
                    <label>CPF</label>
                    <input className="form-input" maxLength={14} value={form.cpf ?? ''} onChange={e => set('cpf', e.target.value)} placeholder="000.000.000-00" />
                  </div>
                ) : (
                  <>
                    <div className="form-campo">
                      <label>CNPJ</label>
                      <input className="form-input" maxLength={18} value={form.cnpj ?? ''} onChange={e => set('cnpj', e.target.value)} />
                    </div>
                    <div className="form-campo">
                      <label>Razão Social</label>
                      <input className="form-input" maxLength={200} value={form.razaoSocial ?? ''} onChange={e => set('razaoSocial', e.target.value)} />
                    </div>
                    <div className="form-campo">
                      <label>Nome Fantasia</label>
                      <input className="form-input" maxLength={200} value={form.nomeFantasia ?? ''} onChange={e => set('nomeFantasia', e.target.value)} />
                    </div>
                  </>
                )}
              </div>

              {/* Endereço */}
              <p className="modal-secao-titulo" style={{ marginTop: 20 }}>
                <MapPin size={13} strokeWidth={2} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                Endereço
              </p>
              <div className="form-grid-2">
                <div className="form-campo">
                  <label>CEP</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-input"
                      value={form.cep ?? ''}
                      onChange={e => handleCep(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      style={{ paddingRight: buscandoCep ? 36 : undefined }}
                    />
                    {buscandoCep && <Loader2 size={15} className="cep-spinner" />}
                  </div>
                  {erroCep && <span style={{ color: 'var(--vermelho)', fontSize: '0.75rem' }}>{erroCep}</span>}
                </div>
                <div className="form-campo">
                  <label>Logradouro</label>
                  <input className="form-input" maxLength={200} value={form.logradouro ?? ''} onChange={e => set('logradouro', e.target.value)} placeholder="Rua, Av., Travessa..." />
                </div>
                <div className="form-campo">
                  <label>Número</label>
                  <input className="form-input" maxLength={10} value={form.numero ?? ''} onChange={e => set('numero', e.target.value)} placeholder="123" />
                </div>
                <div className="form-campo">
                  <label>Complemento</label>
                  <input className="form-input" maxLength={100} value={form.complemento ?? ''} onChange={e => set('complemento', e.target.value)} placeholder="Apto, sala, bloco..." />
                </div>
                <div className="form-campo">
                  <label>Bairro</label>
                  <input className="form-input" maxLength={100} value={form.bairro ?? ''} onChange={e => set('bairro', e.target.value)} placeholder="Bairro" />
                </div>
                <div className="form-campo">
                  <label>Cidade</label>
                  <input className="form-input" maxLength={100} value={form.cidade ?? ''} onChange={e => set('cidade', e.target.value)} placeholder="Cidade" />
                </div>
                <div className="form-campo">
                  <label>Estado (UF)</label>
                  <input className="form-input" value={form.estado ?? ''} onChange={e => set('estado', e.target.value)} placeholder="SP" maxLength={2} style={{ textTransform: 'uppercase' }} />
                </div>
              </div>

              <div className="form-acoes" style={{ marginTop: 24 }}>
                <button type="button" className="btn-secundario" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="btn-primario" disabled={atualizar.isPending}>
                  {atualizar.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
