import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { CalendarDays, Users, PieChart, LogOut, LayoutDashboard, Clock } from 'lucide-react';

export function Layout() {
  const { nome, perfil, logout } = useAuthStore();

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/agendamentos', icon: <CalendarDays size={20} />, label: 'Agendamentos' },
    { path: '/disponibilidade', icon: <Clock size={20} />, label: 'Disponibilidade' },
    ...(perfil === 'Administrador' ? [
      { path: '/usuarios', icon: <Users size={20} />, label: 'Utilizadores' },
      { path: '/relatorios', icon: <PieChart size={20} />, label: 'Relatórios' }
    ] : [])
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <CalendarDays />
            FIESC Agenda
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-4 px-4">
            <p className="text-sm font-semibold text-gray-800">{nome}</p>
            <p className="text-xs text-gray-500">{perfil}</p>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}