import type { User } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api/auth';

export interface LoginPayload {
  email: string;
  password: string;
  // NOTA: el rol NO se envía en login, se obtiene del backend según la BD
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'empleado' | 'admin';
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const AuthService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    return res.json();
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    return res.json();
  },
};
