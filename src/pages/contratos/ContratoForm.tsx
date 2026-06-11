import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contratosApi } from '../../api/contratos';
import { advogadosApi } from '../../api/advogados';
import { clientesApi } from '../../api/clientes';

const schema = z.object({
  advogadoId: z.preprocess((v) => Number(v), z.number().min(1, 'Selecione o advogado')),
  clienteId: z.preprocess((v) => Number(v), z.number().min(1, 'Selecione o cliente')),
  dataAssinatura: z.string().min(1, 'Obrigatório'),
  dataValidade: z.string().optional(),
  valorHonorarios: z.preprocess((v) => Number(v), z.number().min(0, 'Valor inválido')),
  formaPagamento: z.enum(['Fixo', 'PercentualExito', 'Misto']),
  status: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function ContratoForm() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [error, setError] = useState('');

  const { data: advogados } = useQuery({ queryKey: ['advogados'], queryFn: () => advogadosApi.listar().then((r) => r.data) });
  const { data: clientes } = useQuery({ queryKey: ['clientes'], queryFn: () => clientesApi.listar().then((r) => r.data) });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { formaPagamento: 'Fixo' },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => contratosApi.criar(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contratos'] }); navigate('/contratos'); },
    onError: (err: any) => setError(err.response?.data?.mensagem ?? 'Erro ao salvar.'),
  });

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>Novo Contrato</h1></div>
      </div>
      <div className="form-wrap">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d as FormData))} className="form-stack">
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Advogado</label>
              <select {...register('advogadoId')} className="form-select">
                <option value="">Selecione</option>
                {advogados?.map((a) => <option key={a.id} value={a.id}>{a.nomeCompleto}</option>)}
              </select>
              {errors.advogadoId && <span className="form-erro">{errors.advogadoId.message}</span>}
            </div>
            <div className="form-campo">
              <label>Cliente</label>
              <select {...register('clienteId')} className="form-select">
                <option value="">Selecione</option>
                {clientes?.map((c) => <option key={c.id} value={c.id}>{c.nomeCompleto}</option>)}
              </select>
              {errors.clienteId && <span className="form-erro">{errors.clienteId.message}</span>}
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Data de Assinatura</label>
              <input type="date" {...register('dataAssinatura')} className="form-input" />
              {errors.dataAssinatura && <span className="form-erro">{errors.dataAssinatura.message}</span>}
            </div>
            <div className="form-campo">
              <label>Data de Validade</label>
              <input type="date" {...register('dataValidade')} className="form-input" />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>Valor (R$)</label>
              <input type="number" step="0.01" {...register('valorHonorarios')} className="form-input" />
              {errors.valorHonorarios && <span className="form-erro">{errors.valorHonorarios.message}</span>}
            </div>
            <div className="form-campo">
              <label>Forma de Pagamento</label>
              <select {...register('formaPagamento')} className="form-select">
                <option value="Fixo">Fixo</option>
                <option value="PercentualExito">% Êxito</option>
                <option value="Misto">Misto</option>
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
