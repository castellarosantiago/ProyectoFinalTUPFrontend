import React, { useEffect, useState } from "react";
import type { Sale } from "../types/sale";
import { SaleService } from "../services/sale.service";
import type { FilterState } from "../types/sale";
import { Link } from 'react-router-dom';
import { getDatesForLastWeek } from "../utils/datesLastWeek";


// Valores iniciales (por defecto, la semana actual)
const initialFilters: FilterState = getDatesForLastWeek();

export default function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [error, setError] = useState<string | null>(null);

  // Carga inicial y al aplicar filtros
  useEffect(() => {
    loadSales(filters);
  }, [filters]); 

  // Función principal de carga de ventas
  const loadSales = async (currentFilters: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      // Llama al servicio con los filtros actualizados
      const data = await SaleService.getAll(currentFilters);
      setSales(data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el historial de ventas. Intenta recargar la página.");
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // Maneja el cambio en los campos de fecha
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Aplica los filtros (se llama automáticamente desde useEffect cuando 'filters' cambia)
  const handleApplyFilters = (e: React.FormEvent) => {
      e.preventDefault();
  };
  
  // Formatea la fecha de ISO a DD/MM/YYYY HH:MM
  const formatDateTime = (isoDate: string) => {
      try {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) {
          return 'Fecha inválida';
        }
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        return 'Error en fecha';
      }
  };

  // Cálculo del total general de las ventas filtradas
  const grandTotal = sales.reduce((acc, sale) => acc + sale.total, 0);


  return (
    <div className="max-w-6xl w-full">
      
      {/* 1. Encabezado y Opciones */}
      <div className="mb-6 border-b border-base-300 pb-4 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-base-content">
                Historial de Ventas
            </h1>
            <p className="text-sm text-base-content/70 mt-1">
                Visualiza, filtra y gestiona el registro completo de ventas.
            </p>
        </div>
        <Link to="/sales/create" className="btn btn-primary btn-sm md:btn-md shadow-lg">
            Registrar Nueva Venta
        </Link>
      </div>

      {/* 2. Formulario de Filtros */}
      <form onSubmit={handleApplyFilters} className="bg-base-200 p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="form-control w-full md:w-auto">
          <label className="label">
            <span className="label-text">Fecha Inicio</span>
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="input input-bordered input-sm"
            required
          />
        </div>

        <div className="form-control w-full md:w-auto">
          <label className="label">
            <span className="label-text">Fecha Fin</span>
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="input input-bordered input-sm"
            required
          />
        </div>
        
        <div className="pt-4 md:pt-7">
           {/* El botón solo sirve para evitar el submit nativo y forzar el update del useEffect */}
           <button type="submit" className="btn btn-primary btn-sm hidden">
             Aplicar Filtro
           </button>
        </div>
      </form>
      
      {/* 3. Indicador de Total Filtrado */}
      <div className="stats shadow bg-primary text-primary-content mb-6 w-full">
        <div className="stat">
            <div className="stat-title text-primary-content/80">Ventas Encontradas</div>
            <div className="stat-value">{sales.length}</div>
        </div>
        <div className="stat">
            <div className="stat-title text-primary-content/80">Total General ($)</div>
            <div className="stat-value tracking-tight">${grandTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* 4. Tabla de Historial */}
      {error && (
        <div className="alert alert-error shadow-lg my-4">
          <div><span>{error}</span></div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : sales.length === 0 ? (
        <div className="alert alert-warning shadow-lg my-4">
          <div><span>No se encontraron ventas para el rango de fechas seleccionado.</span></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-xl border border-base-300">
          <table className="table table-lg w-full">
            <thead className="bg-base-300 text-base-content">
              <tr>
                <th>ID Venta</th>
                <th>Fecha/Hora</th>
                <th className="text-right">Total</th>
                <th className="text-center">Artículos</th>
                <th>Vendedor</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id} className="hover:bg-base-100">
                  <td className="font-mono text-xs opacity-70">
                    {sale._id.slice(-8).toUpperCase()}
                  </td>
                  <td>{formatDateTime(sale.date)}</td>
                  <td className="font-bold text-right text-primary font-mono">
                    ${sale.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-center">
                    {Array.isArray(sale.detail) ? sale.detail.reduce((acc, d) => acc + d.amountSold, 0) : 0}
                  </td>
                  <td className="font-mono text-xs opacity-50">
                    {typeof sale.user === 'string'
                      ? sale.user
                      : sale.user && typeof sale.user === 'object' && 'name' in sale.user
                        ? sale.user.name
                        : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}