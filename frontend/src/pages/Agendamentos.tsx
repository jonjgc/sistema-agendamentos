import { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import toast from 'react-hot-toast';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { NovoAgendamentoModal } from '../components/NovoAgendamentoModal';

interface Agendamento {
  id: string;
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

  const alterarStatus = async (id: string, novoStatus: string) => {
    try {
      const statusMap: Record<string, number> = {
        'PendenteConfirmacao': 1,
        'Confirmado': 2,
        'Recusado': 3,
        'Cancelado': 4,
        'Realizado': 5
      };

      const statusNumerico = statusMap[novoStatus];

      await api.patch(`/agendamentos/${id}/status`, { status: statusNumerico });
      
      toast.success(`Agendamento ${novoStatus.toLowerCase()} com sucesso!`);
      carregarAgendamentos(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao alterar o status.');
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
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace(/([A-Z])/g, ' $1').trim()}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
          <p className="text-gray-500 mt-1">Gerencie as consultas e atendimentos do sistema.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
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
                <th className="p-4 font-semibold">Responsável</th>
                <th className="p-4 font-semibold">Atendente</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Ações</th>
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
                agendamentos.map((ag) => (
                  <tr key={ag.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{ag.dataAtendimento}</div>
                      <div className="text-xs text-gray-500">{ag.horario} - {ag.tipoAtendimento}</div>
                    </td>
                    <td className="p-4 text-gray-800">{ag.nomeCliente}</td>
                    <td className="p-4 text-gray-600">{ag.nomeAtendente}</td>
                    <td className="p-4">{getStatusBadge(ag.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {ag.status === 'PendenteConfirmacao' && (
                          <button 
                            onClick={() => alterarStatus(ag.id, 'Confirmado')}
                            title="Confirmar Agendamento"
                            className="text-green-600 hover:text-green-800 transition-colors bg-green-50 p-2 rounded-lg"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        
                        {(ag.status === 'PendenteConfirmacao' || ag.status === 'Confirmado') && (
                          <button 
                            onClick={() => alterarStatus(ag.id, 'Cancelado')}
                            title="Cancelar Agendamento"
                            className="text-red-600 hover:text-red-800 transition-colors bg-red-50 p-2 rounded-lg"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        
                        {ag.status !== 'PendenteConfirmacao' && ag.status !== 'Confirmado' && (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
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