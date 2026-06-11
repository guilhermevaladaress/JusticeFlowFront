import { useAuthStore } from '../store/authStore';

export function usePermission() {
  const user = useAuthStore((s) => s.user);
  return {
    isAdmin: () => user?.role === 'Administrador',
    isAdvogado: () => user?.role === 'Advogado',
    isCliente: () => user?.role === 'Cliente',
    hasRole: (...roles: string[]) => !!user && roles.includes(user.role),
  };
}
