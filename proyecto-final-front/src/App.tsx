import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ruta publica para logearse */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* esta ruta tendria que ir privada */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* link default te redirecciona a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;