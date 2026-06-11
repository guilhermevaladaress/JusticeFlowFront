import { cn } from '../../utils/cn';

const colorMap: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-800',
  Suspenso: 'bg-yellow-100 text-yellow-800',
  Encerrado: 'bg-gray-100 text-gray-700',
  Arquivado: 'bg-gray-200 text-gray-600',
  Pendente: 'bg-yellow-100 text-yellow-800',
  Cumprido: 'bg-green-100 text-green-800',
  Vencido: 'bg-red-100 text-red-800',
  Agendada: 'bg-blue-100 text-blue-800',
  Realizada: 'bg-green-100 text-green-800',
  Cancelada: 'bg-red-100 text-red-800',
  Adiada: 'bg-orange-100 text-orange-800',
  Pago: 'bg-green-100 text-green-800',
  Atrasado: 'bg-red-100 text-red-800',
  Inativo: 'bg-gray-200 text-gray-600',
  PessoaFisica: 'bg-blue-100 text-blue-800',
  PessoaJuridica: 'bg-purple-100 text-purple-800',
};

interface BadgeProps {
  status: string;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  const color = colorMap[status] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', color, className)}>
      {status}
    </span>
  );
}
