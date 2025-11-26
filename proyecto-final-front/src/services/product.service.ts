import type { Product, ProductPayload } from "../types/product";

const API_URL = "http://localhost:5000/api/products";
const CAT_API_URL = "http://localhost:5000/api/categories";

export const ProductService = {
  // obtenet todos los productos
  getAll: async (): Promise<Product[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener productos");
    return res.json();
  },

  // buscar por nombre
  searchByName: async (name: string): Promise<Product[]> => {
    if (!name.trim()) return ProductService.getAll();
    
    const res = await fetch(`${API_URL}/search?name=${name}`);
    
    // si la api devuelve 404 cuando no encuentra nada devolvemos array vacío
    if (res.status === 404) return [];
    if (!res.ok) throw new Error("Error en la búsqueda");
    
    const data = await res.json();
    // siempre devolvemos un array, aunque la API devuelva un solo objeto
    return Array.isArray(data) ? data : [data];
  },

  //crear
  create: async (payload: ProductPayload): Promise<Product> => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al crear producto");
    const data = await res.json();
    return data.product;
  },

  // actualizar
  update: async (id: string, payload: Partial<ProductPayload>): Promise<Product> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al actualizar producto");
    const data = await res.json();
    return data.product;
  },

  // eliminar
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar producto");
  },

  // Helper para cargar categorías en el dropdown
  getCategoriesForDropdown: async (): Promise<{_id: string, name: string}[]> => { // esto hace que solo traiga lo que necesitamos por ejemplo _id y name
    try {
      const res = await fetch(CAT_API_URL);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  }
};