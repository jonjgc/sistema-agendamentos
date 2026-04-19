import { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { NovoAgendamentoModal } from '../components/NovoAgendamentoModal';

interface Agendamento {
  nomeCliente: string;
  nomeAtendente: string;
  dataAtendimento: string;
  horario: string;
  tipoAtendimento: string;
  status: string;
}

export function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/relatorios/detalhado');
      setAgendamentos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar os agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PendenteConfirmacao: 'bg-yellow-100 text-yellow-800',
      Confirmado: 'bg-blue-100 text-blue-800',
      Realizado: 'bg-green-100 text-green-800',
      Cancelado: 'bg-red-100 text-red-800',
      Recusado: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace(/([A-Z])/g, ' $1').trim()}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
          <p className="text-gray-500 mt-1">Gira as consultas e atendimentos do sistema.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)} // <-- Adicione o onClick aqui
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Novo Agendamento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 text-sm">
                <th className="p-4 font-semibold">Data/Hora</th>
                <th className="p-4 font-semibold">Utente</th>
                <th className="p-4 font-semibold">Atendente</th>
                <th className="p-4 font-semibold">Tipo</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">A carregar dados...</td>
                </tr>
              ) : agendamentos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum agendamento encontrado.</td>
                </tr>
              ) : (
                agendamentos.map((ag, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{ag.dataAtendimento}</div>
                      <div className="text-xs text-gray-500">{ag.horario}</div>
                    </td>
                    <td className="p-4 text-gray-800">{ag.nomeCliente}</td>
                    <td className="p-4 text-gray-600">{ag.nomeAtendente}</td>
                    <td className="p-4 text-gray-600">{ag.tipoAtendimento}</td>
                    <td className="p-4">{getStatusBadge(ag.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <NovoAgendamentoModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={carregarAgendamentos} 
      />
    </div>
  );
}