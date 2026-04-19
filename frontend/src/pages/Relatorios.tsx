import { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import toast from 'react-hot-toast';
import { Download, PieChart as PieChartIcon, TrendingUp, Users } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Estatisticas {
  totalPorAtendente: { atendente: string; total: number }[];
  agendamentosPorStatus: { status: string; total: number }[];
  taxaRealizadosVsCancelados: { realizados: number; cancelados: number };
  distribuicaoPorTipo: { tipo: string; total: number }[];
}

const COLORS = ['#005baa', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

export function Relatorios() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const response = await api.get('/relatorios/estatisticas');
      setEstatisticas(response.data);
    } catch (error) {
      toast.error('Erro ao carregar estatísticas.');
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = async () => {
    try {
      setExporting(true);
      const response = await api.get('/relatorios/detalhado');
      const dados = response.data;

      if (dados.length === 0) {
        toast.error('Não há dados para exportar.');
        return;
      }

      const cabecalhos = Object.keys(dados[0]).join(',');
      const linhas = dados.map((obj: any) => Object.values(obj).join(',')).join('\n');
      const csv = `${cabecalhos}\n${linhas}`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_fiesc_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar relatório.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">A carregar estatísticas...</div>;
  if (!estatisticas) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Relatórios Gerenciais</h1>
          <p className="text-gray-500 mt-1">Estatísticas e exportação de dados do sistema.</p>
        </div>
        <button 
          onClick={exportarCSV}
          disabled={exporting}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
        >
          <Download size={20} />
          {exporting ? 'A exportar...' : 'Exportar CSV Detalhado'}
        </button>
      </div>

      {/* Cards de KPIs (Indicadores) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600"><Users size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total de Atendentes</p>
            <p className="text-2xl font-bold text-gray-800">{estatisticas.totalPorAtendente.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-full text-green-600"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Atendimentos Realizados</p>
            <p className="text-2xl font-bold text-gray-800">{estatisticas.taxaRealizadosVsCancelados.realizados}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="bg-red-100 p-4 rounded-full text-red-600"><PieChartIcon size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Atendimentos Cancelados</p>
            <p className="text-2xl font-bold text-gray-800">{estatisticas.taxaRealizadosVsCancelados.cancelados}</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Agendamentos por Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estatisticas.agendamentosPorStatus}
                  dataKey="total"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {estatisticas.agendamentosPorStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico por Atendente */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Volume por Atendente</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={estatisticas.totalPorAtendente}>
                <XAxis dataKey="atendente" />
                <YAxis />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="total" fill="#005baa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}