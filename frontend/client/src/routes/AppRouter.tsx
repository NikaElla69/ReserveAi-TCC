/**
 * Design philosophy for navigation: structure the dining journey with clear public discovery routes and purposeful private workspaces.
 */

import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultRouteByRole } from '@/lib/role-routing';
import { AdminDashboard } from '@/pages/AdminDashboard';
import Home from '@/pages/Home';
import { LoginPage } from '@/pages/LoginPage';
import NotFound from '@/pages/NotFound';
import { OwnerDashboard } from '@/pages/OwnerDashboard';
import { OwnerReservationsPage } from '@/pages/OwnerReservationsPage';
import { OwnerRestaurantPage } from '@/pages/OwnerRestaurantPage';
import { OwnerTablesPage } from '@/pages/OwnerTablesPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ReservationCreatePage } from '@/pages/ReservationCreatePage';
import { ReservationsPage } from '@/pages/ReservationsPage';
import { RestaurantDetailsPage } from '@/pages/RestaurantDetailsPage';
import { RestaurantsPage } from '@/pages/RestaurantsPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return null;
  }

  if (isAuthenticated) {
    const target =
      (location.state as { from?: string } | null)?.from ||
      getDefaultRouteByRole(user?.papel);

    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
          <Route
            path="/restaurants/:id/reserve"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <ReservationCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <ReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/restaurant"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerRestaurantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/tables"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerTablesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/reservations"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <OwnerReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/restaurants"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
