import { Menu, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { notificacoesApi } from '../../api/notificacoes';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const { data: naoLidas } = useQuery({
    queryKey: ['notificacoes-nao-lidas'],
    queryFn: () => notificacoesApi.naoLidas().then((r) => r.data),
    refetchInterval: 60000,
  });

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 flex-shrink-0">
      <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-gray-700">
        <Menu className="h-5 w-5" />
      </button>
      <span className="flex-1 text-sm font-semibold text-gray-700 md:hidden">JusticeFlow</span>
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={() => navigate('/notificacoes')}
          className="relative text-gray-500 hover:text-gray-700"
        >
          <Bell className="h-5 w-5" />
          {(naoLidas?.length ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {naoLidas!.length > 9 ? '9+' : naoLidas!.length}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="h-7 w-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.nomeCompleto?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <span className="hidden sm:block max-w-[120px] truncate">{user?.nomeCompleto}</span>
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500" title="Sair">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
