/**
 * User profile page for managing account settings and viewing history.
 * Provides a centralized hub for user account management.
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userService } from '@/services/user.service';
import { formatDate, formatUserRole } from '@/lib/format';
import { 
  Mail, 
  User, 
  Calendar, 
  Shield, 
  LogOut, 
  Settings, 
  Key, 
  Clock, 
  MapPin, 
  Users,
  Sparkles,
  ArrowRight,
  History,
  Star,
  Edit,
  ChevronRight,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import type { Reservation } from '@/types/api';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [reservationHistory, setReservationHistory] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReservationHistory = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const history = await userService.reservationHistory(user.id);
        setReservationHistory(history);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Não foi possível carregar o histórico.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadReservationHistory();
  }, [user]);

  if (!user) {
    return (
      <FullScreenLoader
        title="Carregando perfil"
        description="Aguarde enquanto carregamos seus dados..."
      />
    );
  }

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Carregando histórico"
        description="Buscando suas reservas anteriores..."
      />
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('👋 Você foi desconectado com sucesso!');
    navigate('/login');
  };

  // Estatísticas do histórico
  const stats = {
    total: reservationHistory.length,
    confirmadas: reservationHistory.filter(r => r.status === 'CONFIRMADA').length,
    pendentes: reservationHistory.filter(r => r.status === 'PENDENTE').length,
    canceladas: reservationHistory.filter(r => r.status === 'CANCELADA' || r.status === 'REJEITADA').length,
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5ede0] to-[#faf7f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header Premium */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#1a0f0a] via-[#2c1a12] to-[#1a0f0a] px-6 py-8 sm:px-8 lg:px-10 shadow-[0_30px_80px_rgba(35,21,15,0.25)]">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#f0d1a2]/5 to-transparent rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#8b5e34]/5 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#f0d1a2] to-[#c8944a] flex items-center justify-center shadow-2xl shadow-[#f0d1a2]/20">
              <span className="text-3xl sm:text-4xl font-bold text-[#1a0f0a]">
                {user.nome?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#f0d1a2] animate-pulse" />
                <p className="text-xs uppercase tracking-[0.3em] text-[#e9c791] font-medium">Meu Perfil</p>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-white">
                Olá, {user.nome?.split(' ')[0]}!
              </h1>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Conta ativa</span>
                <span className="text-white/20">•</span>
                <Shield className="w-3.5 h-3.5" />
                <span>{formatUserRole(user.papel)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-panel rounded-[2rem] p-6">
            <StatusMessage
              tone="error"
              title="Erro ao carregar histórico"
              description={error}
            />
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e9dccb] p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 text-[#8b5e34] mb-2">
              <History className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total</span>
            </div>
            <p className="text-2xl font-bold text-[#26170f]">{stats.total}</p>
            <p className="text-xs text-[#6b5647] mt-1">reservas</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e9dccb] p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Confirmadas</span>
            </div>
            <p className="text-2xl font-bold text-[#26170f]">{stats.confirmadas}</p>
            <p className="text-xs text-[#6b5647] mt-1">reservas</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e9dccb] p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Pendentes</span>
            </div>
            <p className="text-2xl font-bold text-[#26170f]">{stats.pendentes}</p>
            <p className="text-xs text-[#6b5647] mt-1">reservas</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e9dccb] p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <XCircle className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Canceladas</span>
            </div>
            <p className="text-2xl font-bold text-[#26170f]">{stats.canceladas}</p>
            <p className="text-xs text-[#6b5647] mt-1">reservas</p>
          </div>
        </div>

        {/* Profile Information & Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Info Card */}
          <Card className="border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-[0_14px_40px_rgba(78,50,28,0.08)] rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#f7ecd8] flex items-center justify-center">
                  <User className="h-4 w-4 text-[#8b5e34]" />
                </div>
                <CardTitle className="text-[#26170f]">Informações Pessoais</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="group p-4 rounded-2xl hover:bg-[#f8f0e2] transition-all duration-200">
                <p className="text-sm font-medium text-[#8b5e34] flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome completo
                </p>
                <p className="mt-1.5 text-lg font-semibold text-[#26170f]">{user.nome}</p>
              </div>
              
              <div className="group p-4 rounded-2xl hover:bg-[#f8f0e2] transition-all duration-200">
                <p className="text-sm font-medium text-[#8b5e34] flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="mt-1.5 text-lg font-semibold text-[#26170f]">{user.email}</p>
              </div>
              
              <div className="group p-4 rounded-2xl hover:bg-[#f8f0e2] transition-all duration-200">
                <p className="text-sm font-medium text-[#8b5e34] flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Tipo de Conta
                </p>
                <span className={`mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-semibold ${
                  user.papel === 'ADMIN' 
                    ? 'bg-red-100 text-red-700' 
                    : user.papel === 'OWNER'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    user.papel === 'ADMIN' ? 'bg-red-500' : user.papel === 'OWNER' ? 'bg-purple-500' : 'bg-emerald-500'
                  }`} />
                  {formatUserRole(user.papel)}
                </span>
              </div>
              
              <div className="group p-4 rounded-2xl hover:bg-[#f8f0e2] transition-all duration-200">
                <p className="text-sm font-medium text-[#8b5e34] flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Membro desde
                </p>
                <p className="mt-1.5 text-lg font-semibold text-[#26170f]">
                  {user.criadoEm ? formatDate(user.criadoEm) : 'Conta recém-criada'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-[0_14px_40px_rgba(78,50,28,0.08)] rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#f7ecd8] flex items-center justify-center">
                  <Settings className="h-4 w-4 text-[#8b5e34]" />
                </div>
                <CardTitle className="text-[#26170f]">Ações da Conta</CardTitle>
              </div>
              <CardDescription className="text-[#6b5647]">
                Gerencie as configurações da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] hover:border-[#8b5e34] transition-all duration-300 group py-6"
              >
                <Edit className="mr-3 h-4 w-4 text-[#8b5e34] group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="font-medium text-[#26170f]">Editar Perfil</p>
                  <p className="text-xs text-[#6b5647]">Atualize suas informações pessoais</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-[#8b5e34] opacity-0 group-hover:opacity-100 transition-all" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] hover:border-[#8b5e34] transition-all duration-300 group py-6"
              >
                <Key className="mr-3 h-4 w-4 text-[#8b5e34] group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="font-medium text-[#26170f]">Alterar Senha</p>
                  <p className="text-xs text-[#6b5647]">Mantenha sua conta segura</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-[#8b5e34] opacity-0 group-hover:opacity-100 transition-all" />
              </Button>
              
              <Button
                variant="destructive"
                className="w-full justify-start rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 group py-6"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <p className="font-medium">Sair da Conta</p>
                  <p className="text-xs text-white/80">Desconectar do sistema</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reservation History */}
        <div className="mt-8">
          <Card className="border-[#e9dccb] bg-white/80 backdrop-blur-sm shadow-[0_14px_40px_rgba(78,50,28,0.08)] rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#f7ecd8] flex items-center justify-center">
                    <History className="h-4 w-4 text-[#8b5e34]" />
                  </div>
                  <div>
                    <CardTitle className="text-[#26170f]">Histórico de Reservas</CardTitle>
                    <CardDescription className="text-[#6b5647]">
                      {reservationHistory.length === 0 
                        ? 'Nenhuma reserva encontrada' 
                        : `${reservationHistory.length} ${reservationHistory.length === 1 ? 'reserva' : 'reservas'} no total`
                      }
                    </CardDescription>
                  </div>
                </div>
                
                <Link 
                  to="/reservations"
                  className="hidden sm:flex items-center gap-2 text-sm text-[#8b5e34] hover:text-[#6b3a2a] font-medium transition-colors group"
                >
                  Ver todas
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {reservationHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-2xl bg-[#f7ecd8] flex items-center justify-center mx-auto mb-4">
                    <UtensilsCrossed className="h-10 w-10 text-[#8b5e34]/40" />
                  </div>
                  <p className="text-[#6b5647] font-medium mb-2">
                    Você ainda não tem reservas
                  </p>
                  <p className="text-sm text-[#8b5e34] mb-6">
                    Explore restaurantes e faça sua primeira reserva!
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] px-6 py-3 text-white font-medium shadow-lg shadow-[#8b5e34]/20 hover:shadow-xl hover:shadow-[#8b5e34]/30 transition-all duration-300 group"
                  >
                    <Sparkles className="h-4 w-4" />
                    Explorar restaurantes
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {reservationHistory.slice(0, 10).map((reservation) => (
                    <div
                      key={reservation.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#e9dccb] p-5 hover:border-[#8b5e34]/50 hover:bg-[#fef9f0] hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4 text-[#8b5e34]" />
                          <p className="font-semibold text-[#26170f] group-hover:text-[#8b5e34] transition-colors">
                            {reservation.restaurante?.nome || 'Restaurante'}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-[#6b5647]">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(reservation.dataReserva)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {reservation.horarioReserva}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {reservation.quantidadePessoas} {reservation.quantidadePessoas === 1 ? 'pessoa' : 'pessoas'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                          reservation.status === 'CONFIRMADA' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : reservation.status === 'PENDENTE' 
                            ? 'bg-amber-100 text-amber-700' 
                            : reservation.status === 'REJEITADA' || reservation.status === 'CANCELADA'
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            reservation.status === 'CONFIRMADA' ? 'bg-emerald-500' :
                            reservation.status === 'PENDENTE' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`} />
                          {reservation.status}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] hover:border-[#8b5e34] opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}