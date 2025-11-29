import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Importaciones de Páginas y Layout
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from "./pages/Home"; 
import Dashboard from './pages/Dashboard';
import CategoriesManager from './pages/CategoriesManager';
import ProductsManager from './pages/ProductManager';
import SalesHistory from './pages/SalesHistory';
import SalesRegister from './pages/SaleRegister';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        <Routes>
          {/* Rutas Públicas (Login y Register)     */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Ruta Principal Protegida (Home actúa como Layout para todas sus hijas) */}
          <Route
            path="/"
            element={
              // Protege el componente Home. Si el usuario no está logeado,
              // ProtectedRoute lo redirigirá a /login.
              <ProtectedRoute>
                <Home /> 
              </ProtectedRoute>
            }
          >
            {/* Rutas Hijas (Se renderizan en el <Outlet /> de Home) */}
            <Route index element={<Dashboard />} /> {/* / */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="products" element={<ProductsManager />} /> 
            <Route path="sales/get" element={<SalesHistory />} />
            <Route path="sales/create" element={<SalesRegister />} /> 
            
            {/* Ruta para cualquier otra URL no encontrada dentro del layout */}
            <Route path="*" element={<h1 className="text-4xl text-error text-center p-10">404 - Página no encontrada</h1>} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;