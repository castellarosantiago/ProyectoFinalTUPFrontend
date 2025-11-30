// components/AdminRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const AdminRoute = ({ children }: Props) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Si no está logeado, redirige a /login 
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está logeado pero NO es admin, redirige al dashboard (o a una página de "Acceso Denegado")
  if (user && user.role !== 'admin') { // Se verifica ambas por si el cliente capitaliza
    alert('Acceso Denegado. Se requiere ser Administrador.');
    return <Navigate to="/dashboard" replace />; 
  }

  // Si está logeado Y es admin, permite el acceso
  return <>{children}</>;
};