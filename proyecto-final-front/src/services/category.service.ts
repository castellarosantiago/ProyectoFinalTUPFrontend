import type { Category, CategoryPayload } from "../types/category";

const API_URL = "http://localhost:5000/api/categories";

export const CategoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener categorías");
    return res.json();
  },

  create: async (payload: CategoryPayload): Promise<Category> => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al crear categoría");
    const data = await res.json();
    return data.category; // devuelve { message, category }
  },

  update: async (id: string, payload: CategoryPayload): Promise<Category> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al actualizar categoría");
    const data = await res.json();
    return data.category; // devuelve { message, category }
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar categoría");
  }
};