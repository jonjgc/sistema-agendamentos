import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Agendamentos } from './pages/Agendamentos';
import { Relatorios } from './pages/Relatorios';

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  return token ? <>{children}</> : <Navigate to="/" />;
}

function DashboardHome() {
  const { nome } = useAuthStore();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">Bem-vindo(a), {nome}!</h1>
      <p className="text-gray-500">Utilize o menu lateral para navegar pelo sistema.</p>
    </div>
  );
}

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/usuarios" element={<div className="p-4">Página de Utilizadores em construção...</div>} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;