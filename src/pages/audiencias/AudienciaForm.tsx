import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { audienciasApi } from '../../api/audiencias';
import { processosApi } from '../../api/processos';

const schema = z.object({
  processoId: z.preprocess((v) => Number(v), z.number().min(1, 'Selecione o processo')),
  tipoAudienciaId: z.preprocess((v) => Number(v), z.number().min(1, 'Selecione o tipo')),
  dataHora: z.string().min(1, 'Obrigatório'),
  local: z.string().max(200, 'Máximo 200 caracteres').optional(),
  linkVirtual: z.string().max(300, 'Máximo 300 caracteres').optional(),
  observacoes: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
});
type FormData = z.infer<typeof schema>;

export function AudienciaForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [error, setError] = useState('');

  const { data: processos } = useQuery({ queryKey: ['processos'], queryFn: () => processosApi.listar().then((r) => r.data) });
  const { data: tipos } = useQuery({ queryKey: ['tipos-audiencia'], queryFn: () => audienciasApi.listarTipos().then((r) => r.data) });
  const { data: existing, isLoading } = useQuery({
    queryKey: ['audiencia', id],
    queryFn: () => audienciasApi.detalhar(Number(id)).then((r) => r.data),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) as any });

  useEffect(() => {
    if (existing) reset({
      processoId: existing.processoId,
      tipoAudienciaId: existing.tipoAudienciaId,
      dataHora: existing.dataHora.slice(0, 16),
      local: existing.local ?? '',
      linkVirtual: existing.linkVirtual ?? '',
      observacoes: existing.observacoes ?? '',
    });
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => isEdit ? audienciasApi.atualizar(Number(id), data as any) : audienciasApi.criar(data as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['audiencias'] }); navigate('/audiencias'); },
    onError: (err: any) => setError(err.response?.data?.mensagem ?? 'Erro ao salvar.'),
  });

  if (isLoading) return <div className="estado" style={{ paddingTop: 80 }}>Carregando...</div>;

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>{isEdit ? 'Editar Audiência' : 'Nova Audiência'}</h1></div>
      </div>
      <div className="form-wrap">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d as FormData))} className="form-stack">
          <div className="form-campo">
            <label>Processo</label>
            <select {...register('processoId')} className="form-select">
              <option value="">Selecione</option>
              {processos?.map((p) => <option key={p.id} value={p.id}>{p.titulo}</option>)}
            </select>
            {errors.processoId && <span className="form-erro">{errors.processoId.message}</span>}
          </div>
          <div className="form-campo">
            <label>Tipo de Audiência</label>
            <select {...register('tipoAudienciaId')} className="form-select">
              <option value="">Selecione</option>
              {tipos?.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            {errors.tipoAudienciaId && <span className="form-erro">{errors.tipoAudienciaId.message}</span>}
          </div>
          <div className="form-campo">
            <label>Data e Hora</label>
            <input type="datetime-local" {...register('dataHora')} className="form-input" />
            {errors.dataHora && <span className="form-erro">{errors.dataHora.message}</span>}
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Local</label>
              <input {...register('local')} maxLength={200} className="form-input" />
            </div>
            <div className="form-campo">
              <label>Link Virtual</label>
              <input {...register('linkVirtual')} maxLength={300} className="form-input" placeholder="https://..." />
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
