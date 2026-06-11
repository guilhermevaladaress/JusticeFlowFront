import { FileX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({ title = 'Nenhum registro encontrado', description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <FileX className="h-12 w-12 mb-3 text-gray-300" />
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="text-xs mt-1">{description}</p>}
    </div>
  );
}
