import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { tribunaisApi } from '../../api/tribunais';

export function TribunaisList() {
  const qc = useQueryClient();
  const [importando, setImportando] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro'; mensagem: string } | null>(null);

  const { data: tribunais, isLoading } = useQuery({
    queryKey: ['tribunais'],
    queryFn: () => tribunaisApi.listar().then((r) => r.data),
  });

  async function importarCnj() {
    setImportando(true);
    setFeedback(null);
    try {
      const res = await tribunaisApi.importarCnj();
      const { criados, atualizados, total } = res.data as any;
      qc.invalidateQueries({ queryKey: ['tribunais'] });
      setFeedback({ tipo: 'sucesso', mensagem: `Importação concluída: ${criados} criados, ${atualizados} atualizados (${total} registros da base CNJ).` });
    } catch (err: any) {
      const msg = err.response?.data?.mensagem ?? 'Erro ao importar tribunais do CNJ.';
      setFeedback({ tipo: 'erro', mensagem: msg });
    } finally {
      setImportando(false);
    }
  }

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>Tribunais</h1><p>{tribunais?.length ?? 0} tribunal(is) no sistema</p></div>
        <button onClick={importarCnj} disabled={importando} className="btn-secundario">
          <RefreshCw size={14} strokeWidth={1.8} style={importando ? { animation: 'spin 1s linear infinite' } : undefined} />
          {importando ? 'Importando...' : 'Importar CNJ'}
        </button>
      </div>

      {feedback && (
        <div className={`form-mensagem-${feedback.tipo === 'sucesso' ? 'sucesso' : 'erro'}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {feedback.tipo === 'sucesso'
            ? <CheckCircle size={16} strokeWidth={2} />
            : <AlertTriangle size={16} strokeWidth={2} />}
          {feedback.mensagem}
        </div>
      )}

      <div className="card card--overflow">
        {isLoading ? (
          <div className="estado">Carregando tribunais...</div>
        ) : !tribunais || tribunais.length === 0 ? (
          <div className="estado">Nenhum tribunal. Clique em "Importar CNJ" para importar.</div>
        ) : (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr><th>Sigla</th><th>Nome</th><th>Tipo</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {tribunais.map((t) => (
                  <tr key={t.id}>
                    <td className="negrito">{t.sigla}</td>
                    <td>{t.nome}</td>
                    <td className="muted">{t.tipo}</td>
                    <td className="muted">{t.estado ?? '—'}</td>
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
