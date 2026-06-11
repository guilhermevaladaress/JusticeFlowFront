import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { advogadosApi } from '../../api/advogados';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { formatOAB } from '../../utils/formatters';
import { useState } from 'react';

function bc(s: string) { return 'badge badge--' + s?.toLowerCase().replace(/\s+/g, ''); }

export function AdvogadosList() {
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const { data: advogados, isLoading } = useQuery({
    queryKey: ['advogados'],
    queryFn: () => advogadosApi.listar().then((r) => r.data),
  });

  const inativarMutation = useMutation({
    mutationFn: (id: number) => advogadosApi.inativar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['advogados'] }); setConfirmId(null); },
  });

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>Advogados</h1><p>{advogados?.length ?? 0} advogado(s) cadastrado(s)</p></div>
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
                <tr><th>Nome</th><th>OAB</th><th>Especialidade</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {advogados.map((a) => (
                  <tr key={a.id}>
                    <td className="negrito">{a.nomeCompleto}</td>
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
