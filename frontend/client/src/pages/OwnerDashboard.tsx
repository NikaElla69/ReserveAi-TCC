/**
 * Owner Dashboard Page
 * Painel do proprietário de restaurante com design premium
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ownerService } from '@/services/owner.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Store,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Table2,
  Eye,
  Filter,
  Search,
  Building2,
  MapPin,
  Star
} from 'lucide-react';

export function OwnerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.papel !== 'OWNER') {
      navigate('/');
      return;
    }
    loadDashboard();
  }, [user, navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ownerService.getDashboard();
      setDashboard(data);

      if (data.restaurants && data.restaurants.length > 0) {
        setSelectedRestaurant(data.restaurants[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5ede0] to-[#faf7f2]">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <div className="h-10 w-64 bg-gradient-to-r from-[#e8d5c0] to-[#d4c4af] rounded-xl animate-pulse" />
            <div className="h-5 w-48 bg-[#e8d5c0]/50 rounded-lg mt-2 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-[1.5rem] h-32 animate-pulse border border-[#e9dccb]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5ede0] to-[#faf7f2] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-[2rem] p-8 text-center">
            <StatusMessage
              tone="error"
              title="Erro ao carregar dashboard"
              description={error}
            />
            <Button onClick={loadDashboard} className="mt-6 bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] hover:shadow-lg hover:shadow-[#8b5e34]/25 transition-all duration-300">
              <Activity className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboard?.data?.statistics || {};
  const restaurants = dashboard?.data?.restaurants || [];

  // Variações simuladas
  const variacoes = {
    reservas: 15.7,
    restaurantes: 8.3,
    mesas: 5.2,
    ocupacao: 12.1
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5ede0] to-[#faf7f2]">
      {/* Header Premium */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a0f0a] via-[#2c1a12] to-[#1a0f0a] border-b border-[#3d2a1a]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE4YzAtNC40LTMuNi04LTgtOHMtOCAzLjYtOCA4IDMuNiA4IDggOCA4LTMuNiA4LTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f0d1a2] to-[#c8944a] flex items-center justify-center shadow-lg shadow-[#f0d1a2]/20">
                  <Store className="w-6 h-6 text-[#1a0f0a]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">Meu Restaurante</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[#c4a97d] text-sm">Bem-vindo, {user?.nome}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 px-6 py-3 text-white hover:bg-white/20 hover:border-white/25 transition-all duration-300 active:scale-[0.98]"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <LogOut className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {restaurants.length === 0 ? (
          <div className="glass-panel rounded-[2rem] p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#f7ecd8] flex items-center justify-center mx-auto mb-6">
              <Store className="h-10 w-10 text-[#8b5e34]" />
            </div>
            <StatusMessage
              tone="default"
              title="Nenhum restaurante encontrado"
              description="Você ainda não criou nenhum restaurante. Crie um para começar a gerenciar reservas."
            />
            <Button className="mt-6 bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] text-white hover:shadow-lg hover:shadow-[#8b5e34]/25 transition-all duration-300">
              <Store className="w-4 h-4 mr-2" />
              Criar Restaurante
            </Button>
          </div>
        ) : (
          <>
            {/* Restaurant Selector Premium */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#f7ecd8] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#8b5e34]" />
                </div>
                <label className="text-lg font-semibold text-[#26170f]">
                  Selecione um restaurante
                </label>
              </div>
              <select
                value={selectedRestaurant || ''}
                onChange={(e) => setSelectedRestaurant(String(e.target.value))}
                className="w-full px-6 py-4 rounded-2xl border-2 border-[#e9dccb] bg-white/80 backdrop-blur-sm text-[#26170f] font-medium focus:outline-none focus:ring-2 focus:ring-[#8b5e34]/20 focus:border-[#8b5e34] transition-all duration-300 cursor-pointer hover:border-[#8b5e34]/50"
              >
                {restaurants.map((r: any) => (
                  <option key={r.id} value={r.id}>
                    {r.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Statistics Cards Premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCardPremium
                icon={Calendar}
                label="Total de Reservas"
                value={stats.totalReservations || 0}
                variation={variacoes.reservas}
                gradient="from-blue-500 to-blue-600"
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
              />
              <StatCardPremium
                icon={Store}
                label="Restaurantes"
                value={stats.totalRestaurants || 0}
                variation={variacoes.restaurantes}
                gradient="from-emerald-500 to-emerald-600"
                iconBg="bg-emerald-100"
                iconColor="text-emerald-600"
              />
              <StatCardPremium
                icon={Table2}
                label="Total de Mesas"
                value={stats.totalTables || 0}
                variation={variacoes.mesas}
                gradient="from-purple-500 to-purple-600"
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
              />
              <StatCardPremium
                icon={TrendingUp}
                label="Ocupação Média"
                value={Math.round(stats.avgOccupancy || 0)}
                variation={variacoes.ocupacao}
                gradient="from-orange-500 to-orange-600"
                iconBg="bg-orange-100"
                iconColor="text-orange-600"
                suffix="pessoas"
              />
            </div>

            {/* Tabs Premium */}
            <div className="glass-panel rounded-[2rem] p-1 shadow-[0_20px_65px_rgba(75,46,25,0.08)]">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 gap-2 p-2 bg-transparent">
                  <TabsTrigger 
                    value="overview"
                    className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8b5e34] data-[state=active]:to-[#6b3a2a] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Visão Geral
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reservations"
                    className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8b5e34] data-[state=active]:to-[#6b3a2a] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics"
                    className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8b5e34] data-[state=active]:to-[#6b3a2a] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Análises
                  </TabsTrigger>
                </TabsList>

                <div className="p-6">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Reservas por Status */}
                      <Card className="p-6 rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-[#26170f]">Reservas por Status</h3>
                        </div>
                        <div className="space-y-4">
                          {dashboard?.data?.reservationsByStatus?.map((item: any) => (
                            <div key={item.status} className="group flex justify-between items-center p-3 rounded-xl hover:bg-[#f8f0e2] transition-all duration-200">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  item.status === 'CONFIRMADA' ? 'bg-emerald-500' :
                                  item.status === 'PENDENTE' ? 'bg-amber-500' :
                                  item.status === 'CANCELADA' ? 'bg-red-500' :
                                  'bg-blue-500'
                                }`} />
                                <span className="text-[#4b382a] capitalize font-medium">{item.status.toLowerCase()}</span>
                              </div>
                              <span className="font-bold text-[#26170f] text-lg">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Próximas Reservas */}
                      <Card className="p-6 rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-emerald-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-[#26170f]">Próximas Reservas</h3>
                        </div>
                        <div className="space-y-3">
                          {dashboard?.data?.upcomingReservations?.slice(0, 5).map((res: any) => (
                            <div key={res.id} className="group flex justify-between items-center p-3 rounded-xl hover:bg-[#f8f0e2] transition-all duration-200 border-b border-[#f0e6d8] last:border-0">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-[#8b5e34]" />
                                  <p className="font-medium text-[#26170f]">{res.usuario?.nome || res.nomeUsuario}</p>
                                </div>
                                <p className="text-xs text-[#6b5647] mt-1 ml-6">
                                  {new Date(res.dataReserva).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short'
                                  })} às {res.horarioReserva}
                                </p>
                              </div>
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#f8f0e2] text-[#8b5e34] text-sm font-semibold">
                                <Users className="w-3 h-3" />
                                {res.quantidadePessoas}
                              </span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    {/* Tendência de Reservas */}
                    <Card className="p-6 rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#26170f]">Tendência (Últimos 7 dias)</h3>
                      </div>
                      <div className="space-y-4">
                        {dashboard?.data?.reservationsTrend?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-[#8b5e34]" />
                              <span className="text-[#6b5647]">
                                {new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-[#f0e6d8] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#8b5e34] to-[#c8944a] rounded-full transition-all duration-500 group-hover:opacity-80"
                                  style={{
                                    width: `${(item.count / (Math.max(...dashboard?.data?.reservationsTrend?.map((i: any) => i.count) || [1]))) * 100}%`
                                  }}
                                />
                              </div>
                              <span className="font-semibold text-[#26170f] min-w-[2rem] text-right">{item.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Reservations Tab */}
                  <TabsContent value="reservations" className="mt-0">
                    <ReservationsTab restaurantId={selectedRestaurant} />
                  </TabsContent>

                  {/* Analytics Tab */}
                  <TabsContent value="analytics" className="mt-0">
                    <AnalyticsTab restaurantId={selectedRestaurant} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Premium Stat Card Component
 */
function StatCardPremium({
  icon: Icon,
  label,
  value,
  variation,
  gradient,
  iconBg,
  iconColor,
  suffix
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: number;
  variation: number;
  gradient: string;
  iconBg: string;
  iconColor: string;
  suffix?: string;
}) {
  const isPositive = variation > 0;

  return (
    <Card className="group relative overflow-hidden rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl hover:shadow-[#8b5e34]/10 transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`${iconBg} p-3 rounded-xl`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(variation)}%
          </div>
        </div>
        
        <div>
          <p className="text-sm text-[#6b5647] font-medium">{label}</p>
          <p className="text-3xl font-bold text-[#26170f] mt-2 tracking-tight">
            {value.toLocaleString()}
            {suffix && <span className="text-lg ml-1 text-[#6b5647] font-normal">{suffix}</span>}
          </p>
        </div>
        
        <div className="mt-4 h-1 bg-[#f0e6d8] rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 group-hover:w-full`} style={{ width: '60%' }} />
        </div>
      </div>
    </Card>
  );
}

/**
 * Reservations Tab Premium
 */
function ReservationsTab({ restaurantId }: { restaurantId: string | null }) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (restaurantId) {
      loadReservations();
    }
  }, [restaurantId, filter]);

  const loadReservations = async () => {
    if (!restaurantId) return;

    try {
      setLoading(true);
      const data = await ownerService.listReservations(restaurantId, {
        status: filter === 'all' ? undefined : filter,
        limit: 20
      });
      setReservations(data.reservations || []);
    } catch (err) {
      console.error('Erro ao carregar reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmReservation = async (reservationId: string) => {
    try {
      await ownerService.confirmReservation(reservationId);
      loadReservations();
    } catch (err) {
      console.error('Erro ao confirmar reserva:', err);
    }
  };

  const rejectReservation = async (reservationId: string) => {
    try {
      await ownerService.rejectReservation(reservationId, 'Rejeitado pelo proprietário');
      loadReservations();
    } catch (err) {
      console.error('Erro ao rejeitar reserva:', err);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#f8f0e2] rounded-2xl h-20 animate-pulse" />
      ))}
    </div>
  );

  const statusFilters = [
    { value: 'all', label: 'Todas', color: 'bg-slate-500' },
    { value: 'PENDENTE', label: 'Pendentes', color: 'bg-amber-500' },
    { value: 'CONFIRMADA', label: 'Confirmadas', color: 'bg-emerald-500' },
    { value: 'CONCLUIDA', label: 'Concluídas', color: 'bg-blue-500' },
    { value: 'CANCELADA', label: 'Canceladas', color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {statusFilters.map(({ value, label, color }) => (
          <Button
            key={value}
            variant={filter === value ? 'default' : 'outline'}
            onClick={() => setFilter(value)}
            size="sm"
            className={`rounded-xl transition-all duration-300 ${
              filter === value 
                ? 'bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] text-white shadow-lg' 
                : 'border-[#e9dccb] hover:border-[#8b5e34]/50 hover:bg-[#f8f0e2]'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${color} mr-2 ${filter === value ? 'bg-white' : ''}`} />
            {label}
          </Button>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#f8f0e2] to-[#fef9f0]">
                <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Usuário</th>
                <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Data/Hora</th>
                <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Pessoas</th>
                <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Mesa</th>
                <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id} className="border-b border-[#f0e6d8] hover:bg-[#f8f0e2]/50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5e34]/10 to-[#c8944a]/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#8b5e34]" />
                      </div>
                      <span className="font-medium text-[#26170f]">{res.usuario?.nome || res.nomeUsuario}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <p className="text-[#26170f] font-medium">
                        {new Date(res.dataReserva).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-[#6b5647] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {res.horarioReserva}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#f8f0e2] text-[#8b5e34] font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      {res.quantidadePessoas}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Table2 className="w-4 h-4 text-[#8b5e34]" />
                      <span className="text-[#26170f] font-medium">Mesa {res.mesa?.numero || res.numeroMesa}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold capitalize ${
                      res.status === 'CONFIRMADA' ? 'bg-emerald-100 text-emerald-700' :
                      res.status === 'PENDENTE' ? 'bg-amber-100 text-amber-700' :
                      res.status === 'CANCELADA' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        res.status === 'CONFIRMADA' ? 'bg-emerald-500' :
                        res.status === 'PENDENTE' ? 'bg-amber-500' :
                        res.status === 'CANCELADA' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`} />
                      {res.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {res.status === 'PENDENTE' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => confirmReservation(res.id)}
                          className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectReservation(res.id)}
                          className="rounded-xl border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * Analytics Tab Premium
 */
function AnalyticsTab({ restaurantId }: { restaurantId: string | null }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    if (restaurantId) {
      loadStats();
    }
  }, [restaurantId, period]);

  const loadStats = async () => {
    if (!restaurantId) return;

    try {
      setLoading(true);
      const data = await ownerService.getOccupancyStats(restaurantId, period);
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#f8f0e2] rounded-xl h-10 w-24 animate-pulse" />
        ))}
      </div>
      <div className="bg-[#f8f0e2] rounded-2xl h-64 animate-pulse" />
    </div>
  );

  const periods = [
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' },
    { value: 'year', label: 'Ano' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {periods.map(({ value, label }) => (
          <Button
            key={value}
            variant={period === value ? 'default' : 'outline'}
            onClick={() => setPeriod(value)}
            size="sm"
            className={`rounded-xl transition-all duration-300 ${
              period === value 
                ? 'bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] text-white shadow-lg' 
                : 'border-[#e9dccb] hover:border-[#8b5e34]/50 hover:bg-[#f8f0e2]'
            }`}
          >
            {label}
          </Button>
        ))}
      </div>

      <Card className="p-6 rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#26170f]">Ocupação por Dia</h3>
        </div>
        <div className="space-y-4">
          {stats?.data?.occupancyByDay?.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#8b5e34]" />
                <span className="text-[#6b5647]">
                  {new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-[#f0e6d8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8b5e34] to-[#c8944a] rounded-full transition-all duration-500 group-hover:opacity-80"
                    style={{
                      width: `${(item.reservations / (Math.max(...stats?.data?.occupancyByDay?.map((i: any) => i.reservations) || [1]))) * 100}%`
                    }}
                  />
                </div>
                <span className="font-semibold text-[#26170f] min-w-[2rem] text-right">{item.reservations}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#26170f]">Ocupação por Hora</h3>
        </div>
        <div className="space-y-4">
          {stats?.data?.occupancyByHour?.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between group">
              <span className="text-[#6b5647] font-medium">{String(item.hour).padStart(2, '0')}:00</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-[#f0e6d8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 group-hover:opacity-80"
                    style={{
                      width: `${(item.reservations / (Math.max(...stats?.data?.occupancyByHour?.map((i: any) => i.reservations) || [1]))) * 100}%`
                    }}
                  />
                </div>
                <span className="font-semibold text-[#26170f] min-w-[2rem] text-right">{item.reservations}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}