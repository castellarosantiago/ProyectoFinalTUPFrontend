import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CategoriesManager from './pages/CategoriesManager';
import ProductsManager from './pages/ProductManager';
import SalesHistory from './pages/SalesHistory';
import SalesRegister from './pages/SaleRegister';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* rutas publicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* rutas privadas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CategoriesManager />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProductsManager />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SalesHistory />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sales/get"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SalesHistory />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sales/register"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SalesRegister />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* ruta default */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
