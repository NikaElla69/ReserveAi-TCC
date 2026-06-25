/**
 * Design philosophy for private routing: keep protected moments discreet, intelligible and aligned with each user's role.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultRouteByRole } from '@/lib/role-routing';
import type { UserRole } from '@/types/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <FullScreenLoader
        title="Preparando sua experiência"
        description="Verificando a sessão e conectando seu espaço de reservas."
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && user?.papel && !allowedRoles.includes(user.papel)) {
    return <Navigate to={getDefaultRouteByRole(user.papel)} replace />;
  }

  return <>{children}</>;
}
