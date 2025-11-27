import type { Category, CategoryPayload } from "../types/category";

const API_URL = "http://localhost:5000/api/categories";

export const CategoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener categorías");
    return res.json();
  }, // retorna una promesa con el array de categorías (Category[])

  create: async (payload: CategoryPayload): Promise<Category> => { // recibe los datos limpios sin el id
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al crear categoría");
    const data = await res.json();
    return data.category; // devuelve { message, category }
  }, // retorna la categoia creada con el id nuevo generado por mongo

  update: async (id: string, payload: CategoryPayload): Promise<Category> => { // recibe el id para saber cual actualizar y los datos nuevos sin el id
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al actualizar categoría");
    const data = await res.json();
    return data.category; // devuelve { message, category }
  }, // retorna la categoria actualizada

  delete: async (id: string): Promise<void> => { //recibe el id de la categoría a eliminar
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar categoría");
  } // no retorna nada
};