// ...existing code...
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types/user';
import { getSalesCountLastWeek } from '../utils/salesCountLastWeek';

const API_URL_SALES = "http://localhost:5000/api/sales";

// Simulacion del usuario logeado
// Esto debe cambiarse por el estado real del usuario logeado
const dummyUser: User = {
    name: "Juan Pérez", 
    role: "Admin", 
};

export default function Dashboard() {
  const [salesCount, setSalesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
        const count = await getSalesCountLastWeek(API_URL_SALES);
        setSalesCount(count);
    } catch (error) {
      console.error("Error al cargar los datos del Dashboard:", error);
      setSalesCount(-1);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-4 text-lg">Cargando información ...</p>
      </div>
    );
  }

  const roleColor = dummyUser.role === "Admin" ? "badge-secondary" : "badge-info";

  return (
    <div className="max-w-6xl w-full">
      
      <div className="card shadow-xl bg-base-200 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">
            ¡Hola, {dummyUser.name}!
          </h1>
          <div className={`badge ${roleColor} text-white text-lg p-3 font-semibold`}>
            Modo {dummyUser.role}
          </div>
        </div>
        <p className="text-2xl italic mt-4 text-base-content/80">
            Tu negocio, bajo control. Un stock ordenado es sinónimo de rentabilidad.
        </p>
      </div>
      
      <div className="card shadow-lg bg-success text-success-content p-6 flex flex-row items-center justify-between">
        <div className="flex items-center">
            <span className="text-4xl mr-4">💰</span>
            <div className="text-lg">
                <p className="font-semibold">Ventas Registradas en los ultimos 7 días:</p>
                {salesCount === -1 ? (
                    <p className="text-sm opacity-80 text-error-content">
                        Error de conexión al obtener el conteo de ventas.
                    </p>
                ) : (
                    <p className="text-3xl font-extrabold">{salesCount}</p>
                )}
            </div>
        </div>
        <Link to="/sales" className="btn btn-success border-success-content/50 hover:bg-success-focus">
            Ver Ventas
        </Link>
      </div>
    </div>
  );
}
