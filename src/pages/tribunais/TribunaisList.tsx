import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { tribunaisApi } from '../../api/tribunais';

export function TribunaisList() {
  const qc = useQueryClient();
  const [importando, setImportando] = useState(false);

  const { data: tribunais, isLoading } = useQuery({
    queryKey: ['tribunais'],
    queryFn: () => tribunaisApi.listar().then((r) => r.data),
  });

  async function importarCnj() {
    setImportando(true);
    try {
      await tribunaisApi.importarCnj();
      qc.invalidateQueries({ queryKey: ['tribunais'] });
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
