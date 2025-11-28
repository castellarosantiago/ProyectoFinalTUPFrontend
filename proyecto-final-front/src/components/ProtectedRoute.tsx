import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'empleado' | 'admin';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading, token } = useAuth();

  // Debug logs
  useEffect(() => {
    console.log('[ProtectedRoute Debug]', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      user: user ? { name: user.name, email: user.email, role: user.role } : null,
      tokenLength: token?.length || 0,
      requiredRole,
      userRole: user?.role,
      timestamp: new Date().toISOString(),
    });
  }, [isLoading, isAuthenticated, user, token, requiredRole]);

  if (isLoading) {
    console.log('[ProtectedRoute] Loading auth state...');
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] NOT AUTHENTICATED - Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log('[ProtectedRoute] Role mismatch - Redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('[ProtectedRoute] AUTHORIZED - Rendering children');
  return <>{children}</>;
};
