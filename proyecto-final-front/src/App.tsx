import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home"; // Layout principal
import Dashboard from "./components/Dashboard";
// importar componentes de ventas, productos, categorias y dashboard


export default function App() {
  return (
    <BrowserRouter>
      {/* La idea es que la ruta "/" cargue el layout de Home, y dentro de Home,
        el <Outlet /> renderice las rutas secundarias definidas.
      */}
      <Routes>
        {/* Aquí iría la ruta del Login (ej: <Route path="/login" element={<Login />} />) */}
        
        {/* Ruta principal que usa el Layout de Home */}
        <Route path="/" element={<Home />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* <Route path="categories" element={<CategoriesManager />} />
            <Route path="products" element={<ProductsManager />} /> */}
            {/* <Route path="sales" element={<SalesManager />} /> */}
            
            {/* Ruta para cualquier otra URL no encontrada */}
            <Route path="*" element={<h1 className="text-4xl text-error text-center p-10">404 - Página no encontrada</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
