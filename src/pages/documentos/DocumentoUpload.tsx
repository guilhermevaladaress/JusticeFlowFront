import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentosApi } from '../../api/documentos';
import { processosApi } from '../../api/processos';
import { Upload } from 'lucide-react';

const schema = z.object({
  processoId: z.preprocess((v) => Number(v), z.number().min(1, 'Selecione o processo')),
  tipoDocumentoId: z.preprocess((v) => Number(v), z.number().min(1, 'Selecione o tipo')),
  nome: z.string().min(1, 'Obrigatório'),
  descricao: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function DocumentoUpload() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [error, setError] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: processos } = useQuery({ queryKey: ['processos'], queryFn: () => processosApi.listar().then((r) => r.data) });
  const { data: tipos } = useQuery({ queryKey: ['tipos-documento'], queryFn: () => documentosApi.listarTipos().then((r) => r.data) });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) as any });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFileInfo({ name: file.name, base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  }

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (!fileInfo) throw new Error('Selecione um arquivo');
      return documentosApi.upload({ ...data, nomeArquivo: fileInfo.name, conteudoBase64: fileInfo.base64, mimeType: fileInfo.mimeType });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['documentos'] }); navigate('/documentos'); },
    onError: (err: any) => setError(err.message ?? err.response?.data?.mensagem ?? 'Erro ao enviar.'),
  });

  return (
    <div className="section-gap">
      <div className="page-header">
        <div><h1>Upload de Documento</h1></div>
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
            <label>Tipo de Documento</label>
            <select {...register('tipoDocumentoId')} className="form-select">
              <option value="">Selecione</option>
              {tipos?.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            {errors.tipoDocumentoId && <span className="form-erro">{errors.tipoDocumentoId.message}</span>}
          </div>
          <div className="form-campo">
            <label>Nome do Documento</label>
            <input {...register('nome')} className="form-input" />
            {errors.nome && <span className="form-erro">{errors.nome.message}</span>}
          </div>
          <div className="form-campo">
            <label>Descrição</label>
            <input {...register('descricao')} className="form-input" />
          </div>
          <div className="form-campo">
            <label>Arquivo</label>
            <div onClick={() => fileRef.current?.click()}
              className={`upload-zona${fileInfo ? ' upload-zona--selecionado' : ''}`}>
              <Upload size={28} strokeWidth={1.5} style={{ color: fileInfo ? 'var(--verde)' : '#94a3b8', margin: '0 auto 8px' }} />
              {fileInfo ? (
                <p style={{ color: 'var(--verde)', fontWeight: 500, margin: 0 }}>{fileInfo.name}</p>
              ) : (
                <p>Clique para selecionar um arquivo</p>
              )}
            </div>
            <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFile} />
          </div>
          {error && <p className="form-mensagem-erro">{error}</p>}
          <div className="form-acoes">
            <button type="button" className="btn-secundario" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" disabled={isSubmitting || !fileInfo} className="btn-primario">
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
