/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Sale, SalePayload, FilterState, PaginatedSalesResponse } from "../types/sale"; 

const API_URL = "http://localhost:5000/api/sales";

// Helper para obtener el token del localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

export const SaleService = {
  
  getAll: async (filters: FilterState): Promise<PaginatedSalesResponse> => { 
    try {
      const url = new URL(API_URL);

      // Agregar filtros de fecha
      if (filters.startDate) url.searchParams.append('startDate', filters.startDate);
      if (filters.endDate) url.searchParams.append('endDate', filters.endDate);
    
      url.searchParams.append('page', filters.page.toString());
      url.searchParams.append('limit', filters.limit.toString());

      const res = await fetch(url.toString(), {
        headers: {
          'Authorization': getAuthToken(),
        }
      });
      
      if (!res.ok) {
        console.error(`Error ${res.status}: ${res.statusText}`);
        throw new Error("Error al obtener el historial de ventas");
      }
      
      const data = await res.json();
      
      // Validar la nueva estructura paginada
      if (!Array.isArray(data.sales) || typeof data.totalCount !== 'number' || typeof data.totalPages !== 'number') {
        throw new Error("Respuesta del servidor inválida o sin formato paginado.");
      }

      // Retornar la respuesta completa
      return {
          sales: data.sales, 
          totalCount: data.totalCount, 
          totalPages: data.totalPages,
          currentPage: data.currentPage,
      };

    } catch (error) {
      console.error("Error en getAll sales:", error);
      throw error; 
    }
  },

  create: async (payload: SalePayload): Promise<Sale> => { // registrar una nueva venta
    try {
      const token = getAuthToken();
      
      if (!token || token === 'Bearer ') {
        throw new Error("No hay token de autenticación. Por favor, inicia sesión nuevamente.");
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Si el servidor devuelve un error detallado, usarlo
        if (data.message) {
          throw new Error(data.message);
        }
        // Si hay errores de validación, mostrarlos
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((e: any) => `${e.field}: ${e.message}`).join('; ');
          throw new Error(`Errores de validación: ${errorMessages}`);
        }
        throw new Error(`Error ${res.status}: No se pudo registrar la venta`);
      }
      
      return data.sale; // retornamos la venta creada
    } catch (error) {
      console.error("Error en create sale:", error);
      throw error; // re-lanzamos el error para que el componente visual pueda mostrar la alerta
    }
  },


  getById: async (id: string): Promise<Sale | null> => { // obtener detalle de una venta por su ID
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        headers: {
          'Authorization': getAuthToken(),
        }
      });
      if (!res.ok) return null;
      
      const data = await res.json();
      return data.sale;
    } catch (error) {
      console.error("Error al obtener detalle de venta:", error);
      return null;
    }
  }
};