import type { Sale, SalePayload } from "../types/sale";
import type { SaleFilterParams } from "../types/sale";

const API_URL = "http://localhost:5000/api/sales";

// Helper para obtener el token del localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

export const SaleService = {
  

  getAll: async (filters: SaleFilterParams = {}): Promise<Sale[]> => { // obtener el historial de ventas
    try {
      const url = new URL(API_URL);

      if (filters.startDate) url.searchParams.append('startDate', filters.startDate);
      if (filters.endDate) url.searchParams.append('endDate', filters.endDate);

      const res = await fetch(url.toString(), {
        headers: {
          'Authorization': getAuthToken(),
        }
      });
      
      // si el servidor se cae (500) o no encuentra ruta (404) lanzamos error
      if (!res.ok) {
        console.error(`Error ${res.status}: ${res.statusText}`);
        throw new Error("Error al obtener el historial de ventas");
      }
      
      const data = await res.json();
      
      // Validar que la respuesta tenga el formato esperado
      if (!Array.isArray(data.sales)) {
        console.warn("La respuesta no tiene el formato esperado:", data);
        return [];
      }
      
      // Validar cada venta y asignar valores por defecto
      return data.sales.map((sale: any) => {
        // Extraer nombre del usuario (puede ser string o objeto)
        let userName = 'Desconocido';
        if (typeof sale.user === 'string') {
          userName = sale.user;
        } else if (sale.user && typeof sale.user === 'object' && sale.user.name) {
          userName = sale.user.name;
        }

        return {
          _id: sale._id || '',
          date: sale.date || new Date().toISOString(),
          user: userName,
          detail: Array.isArray(sale.detail) ? sale.detail : [],
          total: sale.total || 0,
        };
      });
    } catch (error) {
      console.error("Error en getAll sales:", error);
      return []; // si falla devolvemos array vacío para que la tabla no rompa la pantalla
    }
  },


  create: async (payload: SalePayload): Promise<Sale> => { // registrar una nueva venta
    try {
      const token = getAuthToken();
      
      // Debug: verificar si el token existe
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