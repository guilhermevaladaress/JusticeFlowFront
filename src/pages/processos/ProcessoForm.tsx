import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { processosApi } from '../../api/processos';
import { tribunaisApi } from '../../api/tribunais';

const schema = z.object({
  numeroProcesso: z.string().min(1, 'Obrigatório').max(25, 'Máximo 25 caracteres'),
  titulo: z.string().min(1, 'Obrigatório').max(200, 'Máximo 200 caracteres'),
  descricao: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  dataAbertura: z.string().min(1, 'Obrigatório'),
  tipoProcessoId: z.preprocess((v) => Number(v), z.number().min(1, 'Selecione o tipo')),
  tribunalId: z.preprocess((v) => Number(v), z.number().min(1, 'Selecione o tribunal')),
  varaId: z.preprocess((v) => v === '' || v === undefined ? undefined : Number(v), z.number().optional()),
});
type FormData = z.infer<typeof schema>;

export function ProcessoForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [error, setError] = useState('');

  const { data: tipos } = useQuery({ queryKey: ['tipos-processo'], queryFn: () => processosApi.listarTipos().then((r) => r.data) });
  const { data: tribunais } = useQuery({ queryKey: ['tribunais'], queryFn: () => tribunaisApi.listar().then((r) => r.data) });

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) as any });

  const tribunalId = watch('tribunalId');
  const { data: varas } = useQuery({
    queryKey: ['varas', tribunalId],
    queryFn: () => tribunaisApi.listarVaras(Number(tribunalId)).then((r) => r.data),
    enabled: !!tribunalId,
  });

  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryKey: ['processo', id],
    queryFn: () => processosApi.detalhar(Number(id)).then((r) => r.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) reset({
      numeroProcesso: existing.numeroProcesso,
      titulo: existing.titulo,
      descricao: existing.descricao ?? '',
      dataAbertura: existing.dataAbertura.split('T')[0],
      tipoProcessoId: existing.tipoProcessoId,
      tribunalId: existing.tribunalId,
      varaId: existing.varaId ?? undefined,
    });
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => isEdit ? processosApi.atualizar(Number(id), data) : processosApi.criar(data),
    onSuccess: (res) => { qc.invalidateQueries({ queryKey: ['processos'] }); navigate(`/processos/${res.data.id}`); },
    onError: (err: any) => setError(err.response?.data?.mensagem ?? 'Erro ao salvar.'),
  });

  if (loadingExisting) return <div className="estado" style={{ paddingTop: 80 }}>Carregando...</div>;

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>{isEdit ? 'Editar Processo' : 'Novo Processo'}</h1></div>
      </div>
      <div className="form-wrap">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d as FormData))} className="form-stack">
          <div className="form-campo">
            <label>Número CNJ</label>
            <input {...register('numeroProcesso')} maxLength={25} className="form-input" placeholder="0000000-00.0000.0.00.0000" />
            {errors.numeroProcesso && <span className="form-erro">{errors.numeroProcesso.message}</span>}
          </div>
          <div className="form-campo">
            <label>Título</label>
            <input {...register('titulo')} maxLength={200} className="form-input" />
            {errors.titulo && <span className="form-erro">{errors.titulo.message}</span>}
          </div>
          <div className="form-campo">
            <label>Descrição</label>
            <textarea {...register('descricao')} maxLength={1000} rows={3} className="form-textarea" />
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Tipo de Processo</label>
              <select {...register('tipoProcessoId')} className="form-select">
                <option value="">Selecione</option>
                {tipos?.map((t: any) => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
              {errors.tipoProcessoId && <span className="form-erro">{errors.tipoProcessoId.message}</span>}
            </div>
            <div className="form-campo">
              <label>Data de Abertura</label>
              <input type="date" {...register('dataAbertura')} className="form-input" />
              {errors.dataAbertura && <span className="form-erro">{errors.dataAbertura.message}</span>}
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Tribunal</label>
              <select {...register('tribunalId')} className="form-select">
                <option value="">Selecione</option>
                {tribunais?.map((t) => <option key={t.id} value={t.id}>{t.sigla} — {t.nome}</option>)}
              </select>
              {errors.tribunalId && <span className="form-erro">{errors.tribunalId.message}</span>}
            </div>
            <div className="form-campo">
              <label>Vara (opcional)</label>
              <select {...register('varaId')} className="form-select">
                <option value="">Nenhuma</option>
                {varas?.map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
            </div>
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
