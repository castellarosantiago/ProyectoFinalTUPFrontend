import type { UserGet } from "../types/user";
import type { UserUpdatePayload } from "../types/user";

const API_URL = "http://localhost:5000/api/users";

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

export const UserService = {
 
  getAll: async (): Promise<UserGet[]> => {
    const token = getAuthToken();
    const res = await fetch(API_URL, {
      headers: token ? { 'Authorization': token } : {},
    });
    if (!res.ok) throw new Error("Error al obtener usuarios");
    return res.json();
  },

  update: async (id: string, payload: UserUpdatePayload): Promise<UserGet> => {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { 'Authorization': token })
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al actualizar usuario");
    return data.user;
  },

  delete: async (id: string): Promise<void> => {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: token ? { 'Authorization': token } : {},
    });
    if (!res.ok) throw new Error("Error al eliminar usuario");
    // El backend retorna 200 con un mensaje, no necesitamos retornar nada específico
  },
};