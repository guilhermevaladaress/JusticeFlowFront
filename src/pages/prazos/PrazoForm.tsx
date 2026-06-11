import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prazosApi } from '../../api/prazos';
import { processosApi } from '../../api/processos';
import { advogadosApi } from '../../api/advogados';

const schema = z.object({
  processoId: z.preprocess((v) => Number(v), z.number().min(1, 'Selecione o processo')),
  tipoPrazoId: z.preprocess((v) => Number(v), z.number().min(1, 'Selecione o tipo')),
  descricao: z.string().min(1, 'Obrigatório').max(200, 'Máximo 200 caracteres'),
  dataVencimento: z.string().min(1, 'Obrigatório'),
  observacoes: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  advogadoId: z.preprocess((v) => v === '' || v === undefined ? undefined : Number(v), z.number().optional()),
});
type FormData = z.infer<typeof schema>;

export function PrazoForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [error, setError] = useState('');

  const { data: processos } = useQuery({ queryKey: ['processos'], queryFn: () => processosApi.listar().then((r) => r.data) });
  const { data: tipos } = useQuery({ queryKey: ['tipos-prazo'], queryFn: () => prazosApi.listarTipos().then((r) => r.data) });
  const { data: advogados } = useQuery({ queryKey: ['advogados'], queryFn: () => advogadosApi.listar().then((r) => r.data) });
  const { data: existing, isLoading } = useQuery({
    queryKey: ['prazo', id],
    queryFn: () => prazosApi.detalhar(Number(id)).then((r) => r.data),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) as any });

  useEffect(() => {
    if (existing) reset({
      processoId: existing.processoId,
      tipoPrazoId: existing.tipoPrazoId,
      descricao: existing.descricao,
      dataVencimento: existing.dataVencimento.slice(0, 10),
      observacoes: existing.observacoes ?? '',
      advogadoId: existing.advogadoId,
    });
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit ? prazosApi.atualizar(Number(id), data as any) : prazosApi.criar(data as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['prazos'] }); navigate('/prazos'); },
    onError: (err: any) => setError(err.response?.data?.mensagem ?? 'Erro ao salvar.'),
  });

  if (isEdit && isLoading) return <div className="estado" style={{ paddingTop: 80 }}>Carregando...</div>;

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>{isEdit ? 'Editar Prazo' : 'Novo Prazo'}</h1></div>
      </div>
      <div className="form-wrap">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d as FormData))} className="form-stack">
          <div className="form-campo">
            <label>Processo</label>
            <select {...register('processoId')} className="form-select" disabled={isEdit}>
              <option value="">Selecione</option>
              {processos?.map((p) => <option key={p.id} value={p.id}>{p.titulo}</option>)}
            </select>
            {errors.processoId && <span className="form-erro">{errors.processoId.message}</span>}
          </div>
          <div className="form-campo">
            <label>Tipo de Prazo</label>
            <select {...register('tipoPrazoId')} className="form-select">
              <option value="">Selecione</option>
              {tipos?.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            {errors.tipoPrazoId && <span className="form-erro">{errors.tipoPrazoId.message}</span>}
          </div>
          <div className="form-campo">
            <label>Descrição</label>
            <input {...register('descricao')} maxLength={200} className="form-input" />
            {errors.descricao && <span className="form-erro">{errors.descricao.message}</span>}
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Data de Vencimento</label>
              <input type="date" {...register('dataVencimento')} className="form-input" />
              {errors.dataVencimento && <span className="form-erro">{errors.dataVencimento.message}</span>}
            </div>
            <div className="form-campo">
              <label>Advogado Responsável</label>
              <select {...register('advogadoId')} className="form-select">
                <option value="">Nenhum</option>
                {advogados?.map((a) => <option key={a.id} value={a.id}>{a.nomeCompleto}</option>)}
              </select>
            </div>
          </div>
          <div className="form-campo">
            <label>Observações</label>
            <textarea {...register('observacoes')} maxLength={1000} rows={3} className="form-textarea" />
          </div>
          {error && <p className="form-mensagem-erro">{error}</p>}
          <div className="form-acoes">
            <button type="button" className="btn-secundario" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="btn-primario">
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
