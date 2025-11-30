import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import type { Sale } from '../types/sale';
import { SaleService } from '../services/sale.service';
import { groupSalesByDate, getTopProducts, getSalesLastWeek } from '../utils/analytics'; // calculos matemáticos

export default function SalesDashboard() {
  const { user } = useAuth(); // datos del usuario logeado
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await SaleService.getAll();

        // ordenamos cronologicamente. Convertimos a .getTime() para restar números, no fechas.
        const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setSales(sorted);
      } catch (error) {
        console.error('Error al cargar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // usamos las funciones de analytics para preparar los datos
  const lastWeekCount = getSalesLastWeek(sales);
  const salesByDate = groupSalesByDate(sales);
  const topProducts = getTopProducts(sales);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-4 text-lg">Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto p-6">
      <div className="card shadow-xl bg-base-100 p-8 mb-6 border-l-8 border-primary">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">¡Hola, {user?.name || 'Usuario'}!</h1>
            <p className="text-xl italic mt-4 text-base-content/80">
              Tu negocio, bajo control. Un stock ordenado es sinónimo de rentabilidad.
            </p>
          </div>
          <div className="mt-4 md:mt-0 badge text-base-content/70 text-sm p-4 font-semibold border-base-content/20 bg-base-200">
            Modo {user?.role === 'admin' ? 'Admin' : 'Empleado'}
          </div>
        </div>
      </div>

      <div className="card shadow-lg bg-success text-success-content p-6 flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-5xl mr-4 bg-white/20 rounded-full p-2">📈</span>
          <div className="text-lg">
            <p className="font-semibold opacity-90">Ventas Registradas (Últimos 7 días):</p>
            <p className="text-4xl font-extrabold mt-1">{lastWeekCount}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to="/sales/create"
            className="btn bg-white text-success border-none hover:bg-gray-100 shadow-md"
          >
            Registrar Venta
          </Link>
          <Link
            to="/sales/get"
            className="btn btn-outline text-white border-white hover:bg-white/20 hover:border-white"
          >
            Ver Historial
          </Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 px-1 border-b border-base-300 pb-2">
        Análisis de Rendimiento
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* grafico ingresos por dia */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title mb-4 text-sm uppercase text-base-content/60">
              Ingresos por Día
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesByDate}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" fontSize={12} tickMargin={10} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, 'Ingresos']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* grafico productos mas vendidos */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title mb-4 text-sm uppercase text-base-content/60">
              Productos Más Vendidos
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={false} />
                  <XAxis type="number" fontSize={12} hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    fontSize={11}
                    tick={{ fill: '#666' }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} u.`, 'Vendidos']}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="quantity" fill="#36d399" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
