/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'empleado' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos guardados del localStorage al montar
  useEffect(() => {
    console.log('[AuthContext] Initializing - Loading from localStorage');
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    console.log('[AuthContext] localStorage state:', {
      hasUser: !!savedUser,
      hasToken: !!savedToken,
      tokenLength: savedToken?.length || 0,
    });
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        console.log('[AuthContext] Successfully restored user:', parsedUser.email);
      } catch (err) {
        console.error('[AuthContext] Error parsing localStorage:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      console.log('[AuthContext] No saved auth data in localStorage');
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: User, authToken: string) => {
    console.log('[AuthContext.login] Logging in user:', userData.email);
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    console.log('[AuthContext.login] User and token saved to localStorage');
  };

  const logout = () => {
    console.log('[AuthContext.logout] Logging out user');
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('[AuthContext.logout] User and token removed from localStorage');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
