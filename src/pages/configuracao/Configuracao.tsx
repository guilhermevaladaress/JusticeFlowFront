import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

interface Config {
  id: number;
  nomeEscritorio: string;
  cnpj: string;
  telefone?: string;
  email: string;
  logoBase64?: string;
  logoMimeType?: string;
}

export function Configuracao() {
  const qc = useQueryClient();
  const [success, setSuccess] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['configuracao'],
    queryFn: () => api.get<Config>('/configuracao').then((r) => r.data),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Config>();

  useEffect(() => { if (data) reset(data); }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (d: Config) => api.put('/configuracao', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['configuracao'] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  if (isLoading) return <div className="estado" style={{ paddingTop: 80 }}>Carregando...</div>;

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>Configuração do Escritório</h1><p>Dados gerais do escritório jurídico</p></div>
      </div>
      <div className="form-wrap">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="form-stack">
          <div className="form-campo">
            <label>Nome do Escritório</label>
            <input {...register('nomeEscritorio')} className="form-input" />
          </div>
          <div className="form-grid-2">
            <div className="form-campo">
              <label>CNPJ</label>
              <input {...register('cnpj')} className="form-input" />
            </div>
            <div className="form-campo">
              <label>Telefone</label>
              <input {...register('telefone')} className="form-input" />
            </div>
          </div>
          <div className="form-campo">
            <label>E-mail</label>
            <input type="email" {...register('email')} className="form-input" />
          </div>
          {success && <p className="form-mensagem-ok">Configurações salvas com sucesso!</p>}
          <div className="form-acoes">
            <button type="submit" disabled={isSubmitting} className="btn-primario">
              {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
