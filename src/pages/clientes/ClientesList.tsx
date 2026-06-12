import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Plus, X, MapPin, Loader2 } from 'lucide-react';
import { clientesApi } from '../../api/clientes';
import { formatDate, formatCNPJ, maskCPF, maskCNPJ, maskCEP, maskTelefone } from '../../utils/formatters';
import type { CnpjResponse, ClienteRequest } from '../../types/cliente';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

const FORM_VAZIO: ClienteRequest = {
  nomeCompleto: '', email: '', tipo: 'PessoaFisica',
  cpf: '', cnpj: '', razaoSocial: '', nomeFantasia: '',
  telefone: '', cep: '', logradouro: '', numero: '',
  complemento: '', bairro: '', cidade: '', estado: '',
};

async function buscarViaCep(cep: string) {
  const res = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
  const data = await res.json();
  if (data.erro) throw new Error('CEP não encontrado.');
  return data;
}

export function ClientesList() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [cnpjBusca,  setCnpjBusca]  = useState('');
  const [cnpjResult, setCnpjResult] = useState<CnpjResponse | null>(null);
  const [cnpjError,  setCnpjError]  = useState('');

  const [modalAberto,  setModalAberto]  = useState(false);
  const [form,         setForm]         = useState<ClienteRequest>(FORM_VAZIO);
  const [buscandoCep,  setBuscandoCep]  = useState(false);
  const [erroCep,      setErroCep]      = useState('');
  const [erroForm,     setErroForm]     = useState('');
  const [senhaCriada,  setSenhaCriada]  = useState<string | null>(null);

  const { data: clientes, isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clientesApi.listar().then((r) => r.data),
  });

  const criar = useMutation({
    mutationFn: (data: ClienteRequest) => clientesApi.criar(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['clientes'] });
      fecharModal();
      setSenhaCriada(res.data.senhaTemporaria);
    },
    onError: (err: any) => setErroForm(err.response?.data?.mensagem ?? 'Erro ao cadastrar cliente.'),
  });

  async function buscarCnpj() {
    setCnpjError(''); setCnpjResult(null);
    try {
      const res = await clientesApi.consultarCnpj(cnpjBusca.replace(/\D/g, ''));
      setCnpjResult(res.data);
    } catch (err: any) {
      setCnpjError(err.response?.data?.mensagem ?? 'CNPJ não encontrado ou inválido.');
    }
  }

  async function handleCep(valor: string) {
    const masked = maskCEP(valor);
    setForm(f => ({ ...f, cep: masked }));
    const limpo = masked.replace(/\D/g, '');
    if (limpo.length !== 8) return;
    setBuscandoCep(true);
    setErroCep('');
    try {
      const data = await buscarViaCep(valor);
      setForm(f => ({
        ...f,
        logradouro: data.logradouro ?? '',
        bairro:     data.bairro     ?? '',
        cidade:     data.localidade ?? '',
        estado:     data.uf         ?? '',
      }));
    } catch (e: any) {
      setErroCep(e.message ?? 'Erro ao consultar CEP.');
    } finally {
      setBuscandoCep(false);
    }
  }

  function set(campo: keyof ClienteRequest, valor: string) {
    setForm(f => ({ ...f, [campo]: valor }));
  }

  function fecharModal() {
    setModalAberto(false);
    setForm(FORM_VAZIO);
    setErroCep('');
    setErroForm('');
  }

  function fecharSenhaCriada() {
    setSenhaCriada(null);
  }

  function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    setErroForm('');
    criar.mutate(form);
  }

  const pfAtivo = form.tipo === 'PessoaFisica';

  return (
    <div className="section-gap">
      <div className="page-header">
        <div>
          <h1>Clientes</h1>
          <p>{clientes?.length ?? 0} cliente(s) cadastrado(s)</p>
        </div>
        <button className="btn-primario" onClick={() => setModalAberto(true)}>
          <Plus size={15} strokeWidth={2} /> Novo Cliente
        </button>
      </div>

      {/* Consulta CNPJ */}
      <div className="card">
        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 10 }}>
          Consultar CNPJ (BrasilAPI)
        </p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={cnpjBusca}
            onChange={(e) => setCnpjBusca(maskCNPJ(e.target.value))}
            placeholder="00.000.000/0001-00"
            maxLength={18}
            className="form-input"
            style={{ maxWidth: 220 }}
          />
          <button onClick={buscarCnpj} className="btn-primario">
            <Search size={14} strokeWidth={1.8} /> Buscar
          </button>
        </div>
        {cnpjError && <p style={{ color: 'var(--vermelho)', fontSize: '0.78rem', marginTop: 6 }}>{cnpjError}</p>}
        {cnpjResult && (
          <div className="cnpj-resultado">
            <p className="cnpj-linha"><strong>Razão Social:</strong> {cnpjResult.razaoSocial}</p>
            {cnpjResult.nomeFantasia && <p className="cnpj-linha"><strong>Nome Fantasia:</strong> {cnpjResult.nomeFantasia}</p>}
            <p className="cnpj-linha"><strong>Situação:</strong> {cnpjResult.situacaoCadastral}</p>
            {cnpjResult.municipio && <p className="cnpj-linha"><strong>Município:</strong> {cnpjResult.municipio}/{cnpjResult.uf}</p>}
          </div>
        )}
      </div>

      {/* Tabela */}
      <div className="card card--overflow">
        {isLoading ? (
          <div className="estado">Carregando clientes...</div>
        ) : !clientes?.length ? (
          <div className="estado">Nenhum cliente cadastrado.</div>
        ) : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome</th><th>Email</th><th>Tipo</th><th>CPF/CNPJ</th><th>Cidade</th><th>Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id} className="clicavel" onClick={() => navigate(`/clientes/${c.id}`)}>
                    <td className="negrito">{c.nomeCompleto}</td>
                    <td className="muted">{c.email}</td>
                    <td><span className={bc(c.tipo)}>{c.tipo}</span></td>
                    <td className="mono">{c.cnpj ? formatCNPJ(c.cnpj) : c.cpf ?? '—'}</td>
                    <td className="muted">{c.cidade ? `${c.cidade}/${c.estado}` : '—'}</td>
                    <td className="muted">{formatDate(c.dataCadastro)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal senha temporária */}
      {senhaCriada && (
        <div className="modal-overlay" onClick={fecharSenhaCriada}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cliente cadastrado</h2>
              <button type="button" className="btn-icone" onClick={fecharSenhaCriada} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: 12 }}>
                Cliente criado com sucesso. Compartilhe a senha temporária abaixo com o cliente — ele poderá alterá-la após o primeiro acesso.
              </p>
              <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '12px 16px', fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '0.05em', textAlign: 'center', color: '#111827' }}>
                {senhaCriada}
              </div>
              <div className="form-acoes" style={{ marginTop: 20 }}>
                <button className="btn-primario" style={{ width: '100%' }} onClick={fecharSenhaCriada}>Entendido</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal novo cliente */}
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-box modal-box--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Novo Cliente</h2>
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
                  <input className="form-input" maxLength={150} value={form.nomeCompleto ?? ''} onChange={e => set('nomeCompleto', e.target.value)} placeholder="Nome do cliente" required />
                </div>
                <div className="form-campo">
                  <label>E-mail *</label>
                  <input type="email" className="form-input" maxLength={150} value={form.email ?? ''} onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com" required />
                </div>
                <div className="form-campo">
                  <label>Telefone</label>
                  <input className="form-input" maxLength={15} value={form.telefone ?? ''} onChange={e => set('telefone', maskTelefone(e.target.value))} placeholder="(00) 00000-0000" />
                </div>

                {pfAtivo ? (
                  <div className="form-campo">
                    <label>CPF</label>
                    <input className="form-input" maxLength={14} value={form.cpf ?? ''} onChange={e => set('cpf', maskCPF(e.target.value))} placeholder="000.000.000-00" />
                  </div>
                ) : (
                  <>
                    <div className="form-campo">
                      <label>CNPJ</label>
                      <input className="form-input" maxLength={18} value={form.cnpj ?? ''} onChange={e => set('cnpj', maskCNPJ(e.target.value))} placeholder="00.000.000/0001-00" />
                    </div>
                    <div className="form-campo">
                      <label>Razão Social</label>
                      <input className="form-input" maxLength={200} value={form.razaoSocial ?? ''} onChange={e => set('razaoSocial', e.target.value)} placeholder="Razão social" />
                    </div>
                    <div className="form-campo">
                      <label>Nome Fantasia</label>
                      <input className="form-input" maxLength={200} value={form.nomeFantasia ?? ''} onChange={e => set('nomeFantasia', e.target.value)} placeholder="Nome fantasia" />
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
                    {buscandoCep && (
                      <Loader2 size={15} className="cep-spinner" />
                    )}
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
                <button type="submit" className="btn-primario" disabled={criar.isPending}>
                  {criar.isPending ? 'Salvando...' : 'Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
