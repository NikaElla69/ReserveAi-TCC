/**
 * Design philosophy for role routing: every authenticated person should land in a purposeful workspace instead of a generic route.
 */
import type { UserRole } from '@/types/api';

export function getDefaultRouteByRole(role?: UserRole | null) {
  switch (role) {
    case 'OWNER':
      return '/owner/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    case 'CUSTOMER':
    default:
      return '/reservations';
  }
}

export function getNavigationByRole(role?: UserRole | null) {
  switch (role) {
    case 'OWNER':
      return [
        { to: '/owner/dashboard', label: 'Dashboard' },
        { to: '/owner/restaurant', label: 'Meu Restaurante' },
        { to: '/owner/tables', label: 'Mesas' },
        { to: '/owner/reservations', label: 'Reservas' },
        { to: '/profile', label: 'Perfil' }
      ];
    case 'ADMIN':
      return [
        { to: '/admin/dashboard', label: 'Dashboard Admin' },
        { to: '/admin/users', label: 'Usuários' },
        { to: '/admin/restaurants', label: 'Restaurantes' },
        { to: '/admin/reports', label: 'Relatórios' },
        { to: '/profile', label: 'Perfil' }
      ];
    case 'CUSTOMER':
    default:
      return [
        { to: '/restaurants', label: 'Restaurantes' },
        { to: '/reservations', label: 'Minhas Reservas' },
        { to: '/profile', label: 'Perfil' }
      ];
  }
}
