import type { Sale, SalePayload } from "../types/sale";
import type { SaleFilterParams } from "../types/sale";

const API_URL = "http://localhost:5000/api/sales";

export const SaleService = {
  

  getAll: async (filters: SaleFilterParams = {}): Promise<Sale[]> => { // obtener el historial de ventas
    try {
      const url = new URL(API_URL);

      if (filters.startDate) url.searchParams.append('startDate', filters.startDate);
      if (filters.endDate) url.searchParams.append('endDate', filters.endDate);

      const res = await fetch(url.toString());
      
      // si el servidor se cae (500) o no encuentra ruta (404) lanzamos error
      if (!res.ok) throw new Error("Error al obtener el historial de ventas");
      
      const data = await res.json();
      return data.sales; // asumimos que el backend responde con { sales: Sale[] }
    } catch (error) {
      console.error("Error en getAll sales:", error);
      return []; // si falla devolvemos array vacío para que la tabla no rompa la pantalla
    }
  },


  create: async (payload: SalePayload): Promise<Sale> => { // registrar una nueva venta
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          //  implementemos AuthContext para enviar el token:
          // "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo registrar la venta");
      }
      
      return data.sale; // retornamos la venta creada
    } catch (error) {
      console.error("Error en create sale:", error);
      throw error; // re-lanzamos el error para que el componente visual pueda mostrar la alerta
    }
  },


  getById: async (id: string): Promise<Sale | null> => { // obtener detalle de una venta por su ID
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) return null;
      
      const data = await res.json();
      return data.sale;
    } catch (error) {
      console.error("Error al obtener detalle de venta:", error);
      return null;
    }
  }
};