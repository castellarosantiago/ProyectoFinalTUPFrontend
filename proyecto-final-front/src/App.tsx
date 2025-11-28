import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoriesManager from './pages/CategoriesManager';
import ProductsManager from './pages/ProductManager';
import SalesRegister from './pages/SaleRegister';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ruta publica para logearse */}
        <Route path="/login" element={<LoginPage />} />
        {/* esta ruta tendria que ir privada */}
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* ruta para registrar ventas */}
        <Route path="/sales" element={<SalesRegister />} />
        {/* ruta para la gestión de categorias */}
        <Route path="/category" element={<CategoriesManager />} />
        {/* ruta para la gestión de prodcutos */}
        <Route path="/products" element={<ProductsManager />} />
        {/* link default te redirecciona a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
