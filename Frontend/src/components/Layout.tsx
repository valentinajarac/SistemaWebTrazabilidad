import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Warehouse,
  Sprout, 
  ClipboardList, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  const menuItems = isAdmin ? [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Usuarios', path: '/admin/users' },
    { icon: Users, label: 'Clientes', path: '/admin/clients' }
  ] : [
    { icon: Home, label: 'Dashboard', path: '/producer' },
    { icon: Warehouse, label: 'Fincas', path: '/producer/farms' },
    { icon: Sprout, label: 'Cultivos', path: '/producer/crops' },
    { icon: ClipboardList, label: 'Remisiones', path: '/producer/remissions' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <img 
              src="/logo.svg" 
              alt="TrazaFrutas Logo" 
              className="h-16 w-auto"
            />
          </div>
          {children}
        </div>
      </main>

      {/* Barra lateral derecha */}
      <aside className="w-64 bg-gray-900">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-32 bg-gray-800 p-4">
            <img 
              src="/logo.svg" 
              alt="TrazaFrutas Logo" 
              className="h-24 w-auto"
            />
          </div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full px-4 py-2 text-sm rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-800"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}