import type { Product, ProductPayload } from "../types/product";

const API_URL = "http://localhost:5000/api/products";
const CAT_API_URL = "http://localhost:5000/api/categories";

export const ProductService = {
  // obtenet todos los productos
  getAll: async (): Promise<Product[]> => { // retorna una promesa con el array de productos
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener productos");
    return res.json(); // devuelve el array de productos
  },

  // buscar por nombre
  searchByName: async (name: string): Promise<Product[]> => { // recibe el nombre a buscar y retorna un array de productos
    if (!name.trim()) return ProductService.getAll();
    
    const res = await fetch(`${API_URL}/search?name=${name}`);
    
    // si la api devuelve 404 cuando no encuentra nada devolvemos array vacío
    if (res.status === 404) return [];
    if (!res.ok) throw new Error("Error en la búsqueda");
    
    const data = await res.json();
    // siempre devolvemos un array, aunque la API devuelva un solo objeto
    return Array.isArray(data) ? data : [data]; // si es array lo devuelve, si no lo convierte en array
  },

  //crear
  create: async (payload: ProductPayload): Promise<Product> => { // recibe los datos limpios sin el id
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al crear producto");
    const data = await res.json();
    return data.product; // devuelve { message, product }
  },

  // actualizar
  update: async (id: string, payload: Partial<ProductPayload>): Promise<Product> => { // recibe el id para saber cual actualizar y los datos nuevos sin el id
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al actualizar producto");
    const data = await res.json();
    return data.product; // devuelve { message, product }
  },

  // eliminar
  delete: async (id: string): Promise<void> => { // recibe el id del producto a eliminar
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar producto"); // no retorna nada
  },

  // helper para cargar categorías en el dropdown, hace que el formulario de productos pueda obtener las categorías
  getCategoriesForDropdown: async (): Promise<{_id: string, name: string}[]> => { // retorna un array de categorías con solo id y name
    try {
      const res = await fetch(CAT_API_URL);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return []; // en caso de error retorna array vacío
    }
  }
};