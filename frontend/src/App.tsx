import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Agendamentos } from './pages/Agendamentos';
import { Relatorios } from './pages/Relatorios';
import { Usuarios } from './pages/Usuarios';

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  return token ? <>{children}</> : <Navigate to="/" />;
}

function DashboardHome() {
  const { nome } = useAuthStore();
  const primeiroNome = nome ? nome.split(' ')[0] : 'Usuário';

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-4xl font-black text-gray-900">Olá, {primeiroNome}! 👋</h1>
        <p className="text-lg text-gray-500 mt-2">Veja o que está acontecendo no sistema hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary to-blue-700 p-6 rounded-2xl text-white shadow-lg">
          <p className="opacity-80 text-sm font-medium uppercase tracking-wider">Próximos Passos</p>
          <p className="text-xl font-bold mt-2">Verifique seus agendamentos para hoje.</p>
        </div>
      </div>
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
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;