/**
 * Admin Dashboard Page
 * Painel administrativo com estatísticas e gerenciamento
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/admin.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import {
  Users,
  Store,
  Calendar,
  TrendingUp,
  BarChart3,
  LogOut,
  Search,
  Edit,
  Eye,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  Shield,
  Activity,
  Building2,
  MapPin,
  Clock,
  Filter
} from 'lucide-react';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  
  const defaultTab = useMemo(() => {
    if (location.pathname.startsWith('/admin/users')) return 'users';
    if (location.pathname.startsWith('/admin/reports')) return 'analytics';
    if (location.pathname.startsWith('/admin/restaurants')) return 'overview';
    return 'overview';
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (user?.papel !== 'ADMIN') {
      navigate('/');
      return;
    }
    loadDashboard();
  }, [user, navigate]);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboard();
      setDashboard(data);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
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

  // Calcular variações simuladas (substitua por dados reais quando disponíveis)
  const variacoes = {
    usuarios: 12.5,
    restaurantes: 8.3,
    reservas: 15.7,
    tenants: 5.2,
    tenantsAtivos: 3.8
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
                  <Crown className="w-6 h-6 text-[#1a0f0a]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">Painel Administrativo</h1>
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
        {/* Statistics Cards Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCardPremium
            icon={Users}
            label="Total de Usuários"
            value={stats.totalUsers || 0}
            variation={variacoes.usuarios}
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
            icon={Calendar}
            label="Reservas"
            value={stats.totalReservations || 0}
            variation={variacoes.reservas}
            gradient="from-purple-500 to-purple-600"
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCardPremium
            icon={Building2}
            label="Tenants"
            value={stats.totalTenants || 0}
            variation={variacoes.tenants}
            gradient="from-orange-500 to-orange-600"
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
          />
          <StatCardPremium
            icon={Activity}
            label="Tenants Ativos"
            value={stats.activeTenants || 0}
            variation={variacoes.tenantsAtivos}
            gradient="from-rose-500 to-rose-600"
            iconBg="bg-rose-100"
            iconColor="text-rose-600"
          />
        </div>

        {/* Tabs Premium */}
        <div className="glass-panel rounded-[2rem] p-1 shadow-[0_20px_65px_rgba(75,46,25,0.08)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 gap-2 p-2 bg-transparent">
              <TabsTrigger 
                value="overview"
                className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8b5e34] data-[state=active]:to-[#6b3a2a] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="users"
                className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8b5e34] data-[state=active]:to-[#6b3a2a] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Users className="w-4 h-4 mr-2" />
                Usuários
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
                              'bg-slate-500'
                            }`} />
                            <span className="text-[#4b382a] capitalize font-medium">{item.status.toLowerCase()}</span>
                          </div>
                          <span className="font-bold text-[#26170f] text-lg">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Usuários por Role */}
                  <Card className="p-6 rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#26170f]">Usuários por Tipo</h3>
                    </div>
                    <div className="space-y-4">
                      {dashboard?.data?.usersByRole?.map((item: any) => (
                        <div key={item.papel || item.role} className="group flex justify-between items-center p-3 rounded-xl hover:bg-[#f8f0e2] transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              (item.papel || item.role) === 'ADMIN' ? 'bg-red-100' :
                              (item.papel || item.role) === 'OWNER' ? 'bg-purple-100' :
                              'bg-emerald-100'
                            }`}>
                              {(item.papel || item.role) === 'ADMIN' ? <Crown className="w-5 h-5 text-red-600" /> :
                               (item.papel || item.role) === 'OWNER' ? <Store className="w-5 h-5 text-purple-600" /> :
                               <Users className="w-5 h-5 text-emerald-600" />}
                            </div>
                            <span className="text-[#4b382a] capitalize font-medium">{item.papel || item.role}</span>
                          </div>
                          <span className="font-bold text-[#26170f] text-lg">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Top Cidades */}
                <Card className="p-6 rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#26170f]">Top 10 Cidades</h3>
                  </div>
                  <div className="space-y-3">
                    {dashboard?.data?.restaurantsByCity?.map((item: any, idx: number) => (
                      <div key={idx} className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#f8f0e2] transition-all duration-200">
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-sm font-bold text-[#8b5e34] w-8">#{idx + 1}</span>
                          <span className="text-[#4b382a] font-medium">{item.city}</span>
                          <div className="flex-1 h-2 bg-[#f0e6d8] rounded-full overflow-hidden ml-4">
                            <div
                              className="h-full bg-gradient-to-r from-[#8b5e34] to-[#c8944a] rounded-full transition-all duration-500"
                              style={{
                                width: `${(item.count / (dashboard?.data?.restaurantsByCity?.[0]?.count || 1)) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                        <span className="font-bold text-[#26170f] ml-4">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="mt-0">
                <UsersTab />
              </TabsContent>

              {/* Reservations Tab */}
              <TabsContent value="reservations" className="mt-0">
                <ReservationsTab />
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-0">
                <AnalyticsTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
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
  iconColor
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: number;
  variation: number;
  gradient: string;
  iconBg: string;
  iconColor: string;
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
          <p className="text-3xl font-bold text-[#26170f] mt-2 tracking-tight">{value.toLocaleString()}</p>
        </div>
        
        <div className="mt-4 h-1 bg-[#f0e6d8] rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 group-hover:w-full`} style={{ width: '60%' }} />
        </div>
      </div>
    </Card>
  );
}

/**
 * Users Tab Premium
 */
function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, [search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.listUsers({ search, limit: 10 });
      setUsers(data.users || []);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#f8f0e2] rounded-2xl h-20 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b5e34]" />
        <input
          type="text"
          placeholder="Buscar usuário por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#e9dccb] bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#8b5e34]/20 focus:border-[#8b5e34] transition-all duration-300"
        />
      </div>

      <div className="rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#f8f0e2] to-[#fef9f0]">
                <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Nome</th>
                <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Tipo</th>
                <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#f0e6d8] hover:bg-[#f8f0e2]/50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5e34]/10 to-[#c8944a]/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#8b5e34]" />
                      </div>
                      <span className="font-medium text-[#26170f]">{user.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#6b5647]">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold capitalize ${
                      user.papel === 'ADMIN' ? 'bg-red-100 text-red-700' :
                      user.papel === 'OWNER' ? 'bg-purple-100 text-purple-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {user.papel === 'ADMIN' ? <Crown className="w-3 h-3" /> :
                       user.papel === 'OWNER' ? <Store className="w-3 h-3" /> :
                       <Users className="w-3 h-3" />}
                      {user.papel}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      user.ativo
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.ativo ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {user.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] hover:border-[#8b5e34] transition-all duration-300 group"
                    >
                      <Edit className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Editar
                    </Button>
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
 * Reservations Tab Premium
 */
function ReservationsTab() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await adminService.listReservations({ limit: 10 });
      setReservations(data.reservations || []);
    } catch (err) {
      console.error('Erro ao carregar reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#f8f0e2] rounded-2xl h-20 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#f8f0e2] to-[#fef9f0]">
              <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Usuário</th>
              <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Restaurante</th>
              <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Data</th>
              <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 text-[#8b5e34] font-semibold text-sm uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className="border-b border-[#f0e6d8] hover:bg-[#f8f0e2]/50 transition-colors duration-200">
                <td className="py-4 px-6">
                  <span className="font-medium text-[#26170f]">{res.usuario?.nome || res.nomeUsuario}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#8b5e34]" />
                    <span className="text-[#6b5647]">{res.restaurante?.nome || res.nomeRestaurante}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-[#6b5647]">
                    <Clock className="w-4 h-4 text-[#8b5e34]" />
                    {new Date(res.dataReserva).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold capitalize ${
                    res.status === 'CONFIRMADA' ? 'bg-emerald-100 text-emerald-700' :
                    res.status === 'PENDENTE' ? 'bg-amber-100 text-amber-700' :
                    res.status === 'CANCELADA' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      res.status === 'CONFIRMADA' ? 'bg-emerald-500' :
                      res.status === 'PENDENTE' ? 'bg-amber-500' :
                      res.status === 'CANCELADA' ? 'bg-red-500' :
                      'bg-slate-500'
                    }`} />
                    {res.status.toLowerCase()}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] hover:border-[#8b5e34] transition-all duration-300 group"
                  >
                    <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Analytics Tab Premium
 */
function AnalyticsTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsageStats();
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#f8f0e2] rounded-2xl h-40 animate-pulse" />
      <div className="bg-[#f8f0e2] rounded-2xl h-40 animate-pulse" />
    </div>
  );

  const cancellationRate = stats?.data?.cancellationRate?.total > 0
    ? Math.round((stats.data.cancellationRate.cancelled / stats.data.cancellationRate.total) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#26170f]">Taxa de Cancelamento</h3>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#f0e6d8"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="url(#cancelGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - cancellationRate / 100)}`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="cancelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-[#26170f]">{cancellationRate}%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-[#6b5647]">{stats?.data?.cancellationRate?.cancelled || 0} canceladas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f0e6d8]" />
              <span className="text-[#6b5647]">{stats?.data?.cancellationRate?.total || 0} total</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 rounded-[1.5rem] border border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#26170f]">Tendência de Reservas (7 dias)</h3>
        </div>
        
        <div className="space-y-4">
          {stats?.data?.reservationsTrend?.slice(-7).map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#8b5e34]" />
                <span className="text-[#6b5647]">
                  {new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-[#f0e6d8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8b5e34] to-[#c8944a] rounded-full transition-all duration-500 group-hover:opacity-80"
                    style={{ width: `${Math.min((item.count / 10) * 100, 100)}%` }}
                  />
                </div>
                <span className="font-semibold text-[#26170f] min-w-[3rem] text-right">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}