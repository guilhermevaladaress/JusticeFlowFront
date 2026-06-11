import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Download } from 'lucide-react';
import { useState } from 'react';
import { documentosApi } from '../../api/documentos';
import { processosApi } from '../../api/processos';
import { usePermission } from '../../hooks/usePermission';
import { formatDateTime } from '../../utils/formatters';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

export function DocumentosList() {
  const navigate = useNavigate();
  const { hasRole } = usePermission();
  const [processoFilter, setProcessoFilter] = useState('');

  const { data: documentos, isLoading } = useQuery({
    queryKey: ['documentos'],
    queryFn: () => documentosApi.listar().then((r) => r.data),
  });
  const { data: processos } = useQuery({
    queryKey: ['processos'],
    queryFn: () => processosApi.listar().then((r) => r.data),
  });

  const filtered = documentos?.filter(
    (d) => !processoFilter || String(d.processoId) === processoFilter
  ) ?? [];

  async function handleDownload(id: number, nome: string, mimeType: string) {
    const res = await documentosApi.arquivo(id);
    const { conteudoBase64, nomeArquivo } = res.data;
    const blob = await fetch(`data:${mimeType};base64,${conteudoBase64}`).then((r) => r.blob());
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = nomeArquivo || nome; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="section-gap">
      <div className="page-header">
        <div>
          <h1>Documentos</h1>
          <p>{documentos?.length ?? 0} documento(s) armazenado(s)</p>
        </div>
        {hasRole('Administrador', 'Advogado') && (
          <button onClick={() => navigate('/documentos/upload')} className="btn-primario">
            <Plus size={15} strokeWidth={1.8} /> Upload
          </button>
        )}
      </div>

      <div className="card card--overflow">
        <div className="filtros">
          <select value={processoFilter} onChange={(e) => setProcessoFilter(e.target.value)}
            className="form-select" style={{ width: 'auto' }}>
            <option value="">Todos os processos</option>
            {processos?.map((p) => <option key={p.id} value={String(p.id)}>{p.titulo}</option>)}
          </select>
        </div>
        {isLoading ? (
          <div className="estado">Carregando documentos...</div>
        ) : filtered.length === 0 ? (
          <div className="estado">Nenhum documento encontrado.</div>
        ) : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome</th><th>Tipo</th><th>Processo</th>
                  <th>Upload</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td className="negrito truncar">{d.nome}</td>
                    <td className="muted">{d.tipoDocumentoNome}</td>
                    <td className="muted truncar">{d.numeroProcesso}</td>
                    <td style={{ whiteSpace: 'nowrap', color: '#6b7280', fontSize: '0.82rem' }}>{formatDateTime(d.dataUpload)}</td>
                    <td><span className={bc(d.status)}>{d.status}</span></td>
                    <td>
                      <button className="btn-icone" onClick={() => handleDownload(d.id, d.nome, d.mimeType)} title="Download">
                        <Download size={15} strokeWidth={1.8} />
                      </button>
                    </td>
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
