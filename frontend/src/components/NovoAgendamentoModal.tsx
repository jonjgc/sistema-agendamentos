import { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Para recarregar a tabela após salvar
}

interface Usuario {
  id: string;
  nome: string;
  perfil: string;
}

export function NovoAgendamentoModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [atendentes, setAtendentes] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [atendenteId, setAtendenteId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoAtendimento, setTipoAtendimento] = useState('Consulta');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');

  useEffect(() => {
    if (isOpen) {
      buscarAtendentes();
    }
  }, [isOpen]);

  const buscarAtendentes = async () => {
    try {
      const response = await api.get('/usuarios');
      const apenasAtendentes = response.data.filter((u: Usuario) => 
        u.perfil === 'Atendente' || String(u.perfil) === '2'
      );
      
      setAtendentes(apenasAtendentes);
    } catch (error) {
      toast.error('Erro ao carregar atendentes. Verifique se você é Administrador.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataHorario = new Date(`${data}T${hora}:00`).toISOString();

      await api.post('/agendamentos', {
        atendenteId,
        titulo,
        descricao,
        tipoAtendimento,
        dataHorario
      });

      toast.success('Agendamento criado com sucesso!');
      setTitulo(''); setDescricao(''); setData(''); setHora(''); setAtendenteId('');
      onSuccess(); 
      onClose();
    } catch (error: any) {
      const mensagemErro = error.response?.data?.message || 'Erro ao criar agendamento.';
      toast.error(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Novo Agendamento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="Ex: Reunião de Alinhamento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Atendente / Especialista</label>
            <select
              required
              value={atendenteId}
              onChange={(e) => setAtendenteId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
            >
              <option value="">Selecione um atendente...</option>
              {atendentes.map((atendente) => (
                <option key={atendente.id} value={atendente.id}>
                  {atendente.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input
                type="time"
                required
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Atendimento</label>
            <select
              value={tipoAtendimento}
              onChange={(e) => setTipoAtendimento(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
            >
              <option value="Consulta">Consulta</option>
              <option value="Exame">Exame</option>
              <option value="Mentoria">Mentoria</option>
              <option value="Reunião">Reunião</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
            <textarea
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !atendenteId}
              className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'A Salvar...' : 'Salvar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}