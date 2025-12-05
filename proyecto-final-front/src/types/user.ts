export type UserRole = 'empleado' | 'admin';

export interface User {
    name: string;
    role: "Admin" | "Empleado"; 
}

// La interfaz del usuario tal como la recibe el frontend desde la API
// Incluye _id de Mongoose y excluye la password.
export interface UserGet {
  _id: string; // ID de Mongoose
  name: string;
  email: string;
  role: 'Empleado' | 'Admin'; // **Ajuste:** Asumimos que la API o el cliente capitaliza
  // Adicionalmente, podrías tener createdAt y updatedAt si tu repo los retorna
}

export interface UserUpdatePayload {
    name: string
    email: string
    role: UserRole 
}

