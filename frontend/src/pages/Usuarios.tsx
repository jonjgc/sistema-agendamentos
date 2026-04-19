import { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import toast from 'react-hot-toast';
import { UserPlus, ShieldCheck, Mail, CreditCard } from 'lucide-react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
}

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      toast.error('Você não tem permissão para ver esta página.');
    } finally {
      setLoading(false);
    }
  };

  const getPerfilBadge = (perfil: string) => {
    const styles: Record<string, string> = {
      'Administrador': 'bg-purple-100 text-purple-800',
      'Atendente': 'bg-blue-100 text-blue-800',
      'Cliente': 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[perfil] || 'bg-gray-100 text-gray-800'}`}>
        {perfil}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestão de Usuários</h1>
          <p className="text-gray-500 mt-1">Administre os acessos e permissões do sistema.</p>
        </div>
        <button className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
          <UserPlus size={20} />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 text-sm">
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">E-mail / Perfil</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Buscando usuários...</td></tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{u.nome}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-gray-600 flex items-center gap-1"><Mail size={14} /> {u.email}</div>
                      <div>{getPerfilBadge(u.perfil)}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${u.ativo ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${u.ativo ? 'bg-green-600' : 'bg-red-600'}`}></div>
                      {u.ativo ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-primary hover:underline text-sm font-medium">Editar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}