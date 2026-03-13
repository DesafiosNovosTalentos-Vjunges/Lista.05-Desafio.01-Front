import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Dashboard - Bem-vindo!</h1>
    <p>Se estás aqui, o login/registo funcionou.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Redireciona qualquer rota inexistente para o Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
