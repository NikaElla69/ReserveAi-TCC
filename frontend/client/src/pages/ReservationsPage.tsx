/**
 * Design philosophy for reservation history: turn personal bookings into a readable, role-focused control area with stronger hierarchy and contrast.
 */
import { 
  CalendarRange, 
  RefreshCcw, 
  Sparkles, 
  TimerReset, 
  ArrowRight,
  History,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Shield,
  Filter
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { ReservationCard } from '@/components/reservations/ReservationCard';
import { useAuth } from '@/contexts/AuthContext';
import { formatRole } from '@/lib/formatters';
import { reservationService } from '@/services/reservation.service';
import { userService } from '@/services/user.service';
import type { Reservation } from '@/types/api';

type FilterStatus = 'all' | 'CONFIRMADA' | 'PENDENTE' | 'CANCELADA' | 'CONCLUIDA';

export function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [historyCount, setHistoryCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const loadReservations = useCallback(async () => {
    try {
      setError(null);
      const active = await reservationService.list();
      setReservations(active);

      if (user?.id) {
        const history = await userService.reservationHistory(user.id);
        setHistoryCount(history.length);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar suas reservas.');
    }
  }, [user?.id]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setIsLoading(true);
        await loadReservations();
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, [loadReservations]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadReservations();
      toast.success('✨ Reservas atualizadas com sucesso!');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCancel = async (reservationId: string) => {
    const id = Number(reservationId);

    if (Number.isNaN(id)) {
      toast.error('ID de reserva inválido.');
      return;
    }

    try {
      setCancelId(reservationId);
      await reservationService.updateStatus(id, { status: 'CANCELADA' });
      toast.success('✅ Reserva cancelada com sucesso.');
      await loadReservations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível cancelar a reserva.');
    } finally {
      setCancelId(null);
    }
  };

  const summary = useMemo(
    () => ({
      active: reservations.length,
      confirmed: reservations.filter((reservation) => reservation.status === 'CONFIRMADA').length,
      pending: reservations.filter((reservation) => reservation.status === 'PENDENTE').length,
      cancelled: reservations.filter((reservation) => reservation.status === 'CANCELADA').length,
    }),
    [reservations]
  );

  // Filtrar reservas
  const filteredReservations = useMemo(() => {
    if (statusFilter === 'all') return reservations;
    return reservations.filter(r => r.status === statusFilter);
  }, [reservations, statusFilter]);

  const statusFilters = [
    { value: 'all', label: 'Todas', icon: Filter, color: 'bg-slate-500' },
    { value: 'CONFIRMADA', label: 'Confirmadas', icon: CheckCircle2, color: 'bg-emerald-500' },
    { value: 'PENDENTE', label: 'Pendentes', icon: AlertCircle, color: 'bg-amber-500' },
    { value: 'CANCELADA', label: 'Canceladas', icon: XCircle, color: 'bg-red-500' },
    { value: 'CONCLUIDA', label: 'Concluídas', icon: CheckCircle2, color: 'bg-blue-500' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5ede0] to-[#faf7f2]">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <div className="h-12 w-72 bg-gradient-to-r from-[#e8d5c0] to-[#d4c4af] rounded-xl animate-pulse" />
            <div className="h-5 w-48 bg-[#e8d5c0]/50 rounded-lg mt-2 animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-[2rem] h-32 animate-pulse border border-[#e9dccb]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5ede0] to-[#faf7f2] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Premium */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#1a0f0a] via-[#2c1a12] to-[#1a0f0a] px-6 py-8 sm:px-8 lg:px-10 shadow-[0_30px_80px_rgba(35,21,15,0.25)]">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#f0d1a2]/5 to-transparent rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#8b5e34]/5 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none" />
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="max-w-3xl space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f0d1a2]/20 to-[#d4a24e]/20 flex items-center justify-center">
                    <History className="h-5 w-5 text-[#f0d1a2]" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#f0d1a2] font-medium">Minhas Reservas</p>
                </div>
                <h1 className="font-display text-4xl text-white sm:text-5xl leading-tight">
                  Acompanhe suas{' '}
                  <span className="bg-gradient-to-r from-[#f0d1a2] to-[#c8944a] bg-clip-text text-transparent">
                    experiências
                  </span>
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                  Veja o que já foi confirmado, acompanhe pedidos pendentes e reorganize seus planos sem perder de vista os detalhes de cada experiência.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                <SummaryCard 
                  icon={CalendarRange} 
                  label="Ativas" 
                  value={summary.active} 
                  dark 
                  accent="from-blue-500/20 to-blue-600/20"
                />
                <SummaryCard 
                  icon={CheckCircle2} 
                  label="Confirmadas" 
                  value={summary.confirmed} 
                  dark 
                  accent="from-emerald-500/20 to-emerald-600/20"
                />
                <SummaryCard 
                  icon={AlertCircle} 
                  label="Pendentes" 
                  value={summary.pending} 
                  dark 
                  accent="from-amber-500/20 to-amber-600/20"
                />
                <SummaryCard 
                  icon={XCircle} 
                  label="Canceladas" 
                  value={summary.cancelled} 
                  dark 
                  accent="from-red-500/20 to-red-600/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_360px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Error Message */}
            {error ? (
              <div className="glass-panel rounded-[2rem] p-6">
                <StatusMessage
                  description="Não foi possível carregar suas reservas agora. Tente novamente em instantes."
                  title={error}
                  tone="error"
                />
              </div>
            ) : null}

            {/* Filters */}
            {reservations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {statusFilters.map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    onClick={() => setStatusFilter(value as FilterStatus)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      statusFilter === value
                        ? 'bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] text-white shadow-lg shadow-[#8b5e34]/20'
                        : 'bg-white/80 backdrop-blur-sm border border-[#e9dccb] text-[#6b5647] hover:border-[#8b5e34]/50 hover:bg-[#f8f0e2]'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${statusFilter === value ? 'bg-white' : color}`} />
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!error && reservations.length === 0 ? (
              <div className="glass-panel rounded-[2.5rem] p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#f7ecd8] flex items-center justify-center mx-auto mb-6">
                  <UtensilsCrossed className="h-10 w-10 text-[#8b5e34]/40" />
                </div>
                <h3 className="text-2xl font-semibold text-[#26170f] mb-2">
                  Nenhuma reserva ainda
                </h3>
                <p className="text-[#6b5647] mb-8 max-w-md mx-auto">
                  Quando você fizer uma reserva, ela aparecerá aqui com status, restaurante, horário e próximos passos.
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
            ) : null}

            {/* Filtered Empty State */}
            {!error && reservations.length > 0 && filteredReservations.length === 0 ? (
              <div className="glass-panel rounded-[2.5rem] p-12 text-center">
                <Filter className="h-12 w-12 text-[#8b5e34]/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#26170f] mb-2">
                  Nenhuma reserva com este status
                </h3>
                <p className="text-[#6b5647]">
                  Tente selecionar outro filtro para visualizar suas reservas.
                </p>
              </div>
            ) : null}

            {/* Reservations List */}
            {filteredReservations.length > 0 ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-[#8b5e34] font-medium">
                      {statusFilter === 'all' ? 'Todas as reservas' : `Reservas ${statusFilter.toLowerCase()}s`}
                    </p>
                    <h2 className="mt-2 font-display text-3xl text-[#26170f]">
                      {filteredReservations.length} {filteredReservations.length === 1 ? 'reserva' : 'reservas'} encontrada{filteredReservations.length !== 1 ? 's' : ''}
                    </h2>
                  </div>
                </div>

                <div className="grid gap-4">
                  {filteredReservations.map((reservation) => (
                    <ReservationCard
                      isCancelling={cancelId === reservation.id}
                      key={reservation.id}
                      onCancel={handleCancel}
                      reservation={reservation}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar - Account Summary */}
          <div className="space-y-6">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8 shadow-[0_18px_60px_rgba(78,50,28,0.08)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-[#f7ecd8] flex items-center justify-center">
                  <Shield className="h-4 w-4 text-[#8b5e34]" />
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34] font-medium">Resumo da conta</p>
              </div>
              
              <h2 className="font-display text-3xl text-[#26170f] mb-6">Seu perfil</h2>
              
              <dl className="space-y-3">
                <InfoBlock 
                  icon={<User className="h-4 w-4" />}
                  label="Nome" 
                  value={user?.nome || 'Não informado'} 
                />
                <InfoBlock 
                  icon={<Mail className="h-4 w-4" />}
                  label="Email" 
                  value={user?.email || 'Não informado'} 
                />
                <InfoBlock 
                  icon={<Shield className="h-4 w-4" />}
                  label="Perfil" 
                  value={formatRole(user?.papel || 'CUSTOMER')} 
                />
                <InfoBlock 
                  icon={<History className="h-4 w-4" />}
                  label="Histórico total" 
                  value={historyCount !== null ? `${historyCount} reservas` : 'Carregando...'} 
                />
              </dl>

              <div className="mt-6 space-y-3">
                <button 
                  className="group flex items-center justify-center gap-2 w-full rounded-xl border-2 border-[#e9dccb] bg-white/80 px-6 py-3.5 text-sm font-medium text-[#4b382a] backdrop-blur-sm transition-all duration-300 hover:border-[#8b5e34]/60 hover:bg-[#f8f0e2] hover:shadow-md active:scale-[0.98]"
                  disabled={isRefreshing} 
                  onClick={handleRefresh} 
                  type="button"
                >
                  <RefreshCcw className={`h-4 w-4 transition-transform duration-300 group-hover:rotate-180 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Atualizando...' : 'Atualizar reservas'}
                </button>
                
                <Link 
                  className="group flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#8b5e34]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#8b5e34]/30 hover:scale-[1.02] active:scale-[0.98]"
                  to="/restaurants"
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  Explorar restaurantes
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="glass-panel rounded-[2rem] p-6 shadow-[0_18px_60px_rgba(78,50,28,0.08)]">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-[#8b5e34]" />
                <h3 className="text-sm font-semibold text-[#26170f]">Dicas úteis</h3>
              </div>
              <ul className="space-y-3 text-sm text-[#6b5647]">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8b5e34] mt-1.5 flex-shrink-0" />
                  <span>Cancele com até 2h de antecedência</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8b5e34] mt-1.5 flex-shrink-0" />
                  <span>Chegue com 10 minutos de antecedência</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8b5e34] mt-1.5 flex-shrink-0" />
                  <span>Adicione observações sobre restrições alimentares</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  dark = false,
  accent = ''
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  dark?: boolean;
  accent?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[1.4rem] border px-4 py-4 transition-all duration-300 hover:scale-[1.02] ${
      dark 
        ? 'border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/20' 
        : 'border-[#ead9c0] bg-[#fffaf4] text-[#26170f] hover:shadow-md'
    }`}>
      {dark && (
        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${accent} rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl`} />
      )}
      <div className="relative">
        <div className={`flex items-center gap-2 text-xs uppercase tracking-[0.22em] ${dark ? 'text-white/60' : 'text-[#8b5e34]'}`}>
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </div>
        <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function InfoBlock({ 
  label, 
  value, 
  icon 
}: { 
  label: string; 
  value: string; 
  icon?: React.ReactNode;
}) {
  return (
    <div className="group rounded-[1.4rem] border border-[#e9dccb] bg-white/60 backdrop-blur-sm p-4 hover:bg-[#f8f0e2] hover:border-[#8b5e34]/30 transition-all duration-200">
      <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#8b5e34] mb-1">
        {icon && <span className="text-[#8b5e34]">{icon}</span>}
        {label}
      </dt>
      <dd className="font-semibold text-[#26170f]">{value}</dd>
    </div>
  );
}