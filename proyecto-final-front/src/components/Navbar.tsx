import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-lg border-b border-base-200">
      <div className="flex-1">
        <Link to="/dashboard" className="btn btn-ghost text-xl font-bold">
          📊 Sistema de Gestión
        </Link>
      </div>

      <div className="flex-none gap-2">
        {/* Menu desplegable */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <Link to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/sales/register">
                📋 Registrar Venta
              </Link>
            </li>
            <li>
              <Link to="/sales">
                📈 Historial de Ventas
              </Link>
            </li>
            <li>
              <Link to="/products">
                📦 Productos
              </Link>
            </li>
            <li>
              <Link to="/category">
                🏷️ Categorías
              </Link>
            </li>
            {user?.role === 'admin' && (
              <>
                <li><hr /></li>
                <li><span className="text-xs text-primary font-bold">ADMIN</span></li>
              </>
            )}
            <li>
              <button onClick={handleLogout} className="text-error">
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-sm">{user?.name}</p>
            <p className="text-xs opacity-70 capitalize">{user?.role}</p>
          </div>
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-10 flex items-center justify-center">
              <span className="text-lg font-bold">{user?.name?.charAt(0) ?? 'U'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
