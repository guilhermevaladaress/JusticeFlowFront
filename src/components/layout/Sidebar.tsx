import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Scale, Calendar, Clock, FileText,
  Users, Briefcase, BookOpen, DollarSign, Building2,
  BarChart2, Settings, Bell, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: [] },
  { to: '/processos', icon: Scale, label: 'Processos', roles: [] },
  { to: '/audiencias', icon: Calendar, label: 'Audiências', roles: [] },
  { to: '/prazos', icon: Clock, label: 'Prazos', roles: [] },
  { to: '/documentos', icon: FileText, label: 'Documentos', roles: [] },
  { to: '/clientes', icon: Users, label: 'Clientes', roles: ['Administrador', 'Advogado'] },
  { to: '/advogados', icon: Briefcase, label: 'Advogados', roles: ['Administrador'] },
  { to: '/contratos', icon: BookOpen, label: 'Contratos', roles: ['Administrador', 'Advogado'] },
  { to: '/honorarios', icon: DollarSign, label: 'Honorários', roles: ['Administrador', 'Advogado'] },
  { to: '/tribunais', icon: Building2, label: 'Tribunais', roles: ['Administrador'] },
  { to: '/relatorios', icon: BarChart2, label: 'Relatórios', roles: ['Administrador', 'Advogado'] },
  { to: '/notificacoes', icon: Bell, label: 'Notificações', roles: [] },
  { to: '/configuracao', icon: Settings, label: 'Configuração', roles: ['Administrador'] },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();

  const visible = navItems.filter(
    (item) => item.roles.length === 0 || (user && item.roles.includes(user.role))
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30 flex flex-col transition-transform duration-200',
          'md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <span className="text-lg font-bold text-white">JusticeFlow</span>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {visible.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-5 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        {user && (
          <div className="px-5 py-4 border-t border-gray-700 text-xs text-gray-400">
            <p className="font-medium text-gray-200 truncate">{user.nomeCompleto}</p>
            <p>{user.role}</p>
          </div>
        )}
      </aside>
    </>
  );
}
