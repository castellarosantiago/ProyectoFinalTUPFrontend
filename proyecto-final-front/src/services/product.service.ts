import type { Product, ProductPayload } from "../types/product";
import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/api/products`;
const CAT_API_URL = `${API_BASE_URL}/api/categories`;

// Helper para obtener el token del localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

export const ProductService = {
  // obtenet todos los productos
  getAll: async (): Promise<Product[]> => { // retorna una promesa con el array de productos
    const token = getAuthToken();
    const res = await fetch(API_URL, {
      headers: token ? { 'Authorization': token } : {},
    });
    if (!res.ok) {
      throw new Error(`Error al obtener productos (${res.status})`);
    }
    const data = await res.json();
    return data;
  },

  // buscar por nombre
  searchByName: async (name: string): Promise<Product[]> => { // recibe el nombre a buscar y retorna un array de productos
    if (!name.trim()) return ProductService.getAll();
    
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/search/name?name=${name}`, {
      headers: token ? { 'Authorization': token } : {},
    });
    
    // si la api devuelve 404 cuando no encuentra nada devolvemos array vacío
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`Error en la búsqueda (${res.status})`);
    
    const data = await res.json();
    // siempre devolvemos un array, aunque la API devuelva un solo objeto
    return Array.isArray(data) ? data : [data]; // si es array lo devuelve, si no lo convierte en array
  },

  //crear
  create: async (payload: ProductPayload): Promise<Product> => { // recibe los datos limpios sin el id
    const token = getAuthToken();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { 'Authorization': token })
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Error al crear producto (${res.status})`);
    const data = await res.json();
    return data.product; // devuelve { message, product }
  },

  // actualizar
  update: async (id: string, payload: Partial<ProductPayload>): Promise<Product> => { // recibe el id para saber cual actualizar y los datos nuevos sin el id
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { 'Authorization': token })
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Error al actualizar producto (${res.status})`);
    const data = await res.json();
    return data.product; // devuelve { message, product }
  },

  // eliminar
  delete: async (id: string): Promise<void> => { // recibe el id del producto a eliminar
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: token ? { 'Authorization': token } : {},
    });
    if (!res.ok) throw new Error(`Error al eliminar producto (${res.status})`); // no retorna nada
  },

  // helper para cargar categorías en el dropdown, hace que el formulario de productos pueda obtener las categorías
  getCategoriesForDropdown: async (): Promise<{_id: string, name: string}[]> => { // retorna un array de categorías con solo id y name
    try {
      const token = getAuthToken();
      const res = await fetch(CAT_API_URL, {
        headers: token ? { 'Authorization': token } : {},
      });
      if (!res.ok) return [];
      return res.json();
    } catch (err) {
      console.error('[ProductService.getCategoriesForDropdown] Error:', err);
      return []; // en caso de error retorna array vacío
    }
  }
};