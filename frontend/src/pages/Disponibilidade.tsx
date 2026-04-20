import { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import toast from 'react-hot-toast';
import { Clock, Plus, Trash2 } from 'lucide-react';

interface Horario {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
}

export function Disponibilidade() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [diaSemana, setDiaSemana] = useState('1');
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFim, setHoraFim] = useState('18:00');

  useEffect(() => {
    carregarHorarios();
  }, []);

  const carregarHorarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/disponibilidade');
      setHorarios(response.data);
    } catch (error) {
      toast.error('Erro ao carregar disponibilidade.');
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/disponibilidade', {
        diaSemana: Number(diaSemana),
        horaInicio,
        horaFim
      });
      toast.success('Horário adicionado com sucesso!');
      carregarHorarios();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar horário.');
    }
  };

  const mapDiaSemana = (dia: number) => {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return dias[dia] || 'Desconhecido';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Minha Disponibilidade</h1>
        <p className="text-gray-500 mt-1">Defina os seus horários de atendimento para os clientes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-primary" /> Novo Horário
          </h2>
          <form onSubmit={handleSalvar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dia da Semana</label>
              <select 
                value={diaSemana} 
                onChange={(e) => setDiaSemana(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
              >
                <option value="1">Segunda-feira</option>
                <option value="2">Terça-feira</option>
                <option value="3">Quarta-feira</option>
                <option value="4">Quinta-feira</option>
                <option value="5">Sexta-feira</option>
                <option value="6">Sábado</option>
                <option value="0">Domingo</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
                <input type="time" required value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
                <input type="time" required value={horaFim} onChange={(e) => setHoraFim(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none" />
              </div>
            </div>
            <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors">
              <Plus size={20} /> Adicionar
            </button>
          </form>
        </div>

        {/* Lista de Horários */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 text-sm">
                <th className="p-4 font-semibold">Dia da Semana</th>
                <th className="p-4 font-semibold">Horário</th>
                <th className="p-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={3} className="p-8 text-center text-gray-500">A carregar...</td></tr>
              ) : horarios.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-gray-500">Nenhuma disponibilidade registada.</td></tr>
              ) : (
                horarios.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{mapDiaSemana(h.diaSemana)}</td>
                    <td className="p-4 text-gray-600">{h.horaInicio} às {h.horaFim}</td>
                    <td className="p-4 text-center">
                      <button title="Remover" className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}