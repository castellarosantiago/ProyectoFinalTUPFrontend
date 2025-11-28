import { Outlet, Link, useLocation } from "react-router-dom";

// Secciones de navegación
const ICON = "▸"

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard"},
  { path: "/categories", label: "Categorías", icon:ICON},
  { path: "/products", label: "Productos", icon:ICON},
  { path: "/sales/get", label: "Ver ventas", icon:ICON},
  { path: "/sales/create", label: "Crear venta", icon:ICON},
];

const APPNAME = "SIGN";

export default function Home() {
  const location = useLocation(); 



  const handleLogout = () => {
    // Lógica real de cierre de sesión
    alert("¡Sesión cerrada! (Redirigir a /login)"); 
    // Después de limpiar tokens/estado, se usaría navigate('/login')
  };


  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      
      {/* Navbar/Header principal */}
      <div className="navbar bg-primary text-primary-content shadow-lg sticky top-0 z-10">
        
        {/* Logo */}
        <div className="flex-1 px-2 mx-2">
          <Link to="/dashboard" className="text-xl font-bold">
            {APPNAME}
          </Link>
        </div>
        
        {/* Opciones de usuario */}
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-base-200 text-neutral-content grid place-items-center">
                <span className="text-lg">👤</span>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52 text-base-content">
              <li><a onClick={handleLogout}>Cerrar Sesión</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Navegacion lateral  */}
      <div className="flex flex-grow">

        <div className="w-64 bg-base-200 shadow-xl p-4 flex-none border-r border-base-300">
          <ul className="menu menu-vertical p-0">
            <li className="menu-title">Navegación Principal</li>
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path || (location.pathname === "/" && item.path === "/dashboard") ? 
                    "active bg-primary text-primary-content hover:bg-primary-focus" : "hover:bg-base-300"}>
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Renderizado del componente seleccionado*/}
        <main className="flex-grow p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <footer className="footer footer-center p-4 bg-base-300 text-base-content border-t border-base-content/10">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - {APPNAME} | 
            Sistema Integral de Gestion de Negocio
          </p>
        </aside>
      </footer>
    </div>
  );
}