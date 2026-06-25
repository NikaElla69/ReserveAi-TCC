/**
 * Design philosophy for incoming reservations: surface operational decisions quickly with clear status cues and readable booking details.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ownerService } from '@/services/owner.service';
import { restaurantService } from '@/services/restaurant.service';
import type { Restaurant } from '@/types/api';

const filters = ['all', 'PENDENTE', 'CONFIRMADA', 'CONCLUIDA', 'CANCELADA'] as const;

export function OwnerReservationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('PENDENTE');
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.papel !== 'OWNER') {
      navigate('/');
      return;
    }

    void bootstrap();
  }, [navigate, user?.papel]);

  useEffect(() => {
    if (!selectedRestaurantId) {
      return;
    }

    void loadReservations(selectedRestaurantId, filter);
  }, [filter, selectedRestaurantId]);

  async function bootstrap() {
    try {
      setLoading(true);
      setError(null);
      const ownedRestaurants = await restaurantService.listMine();
      setRestaurants(ownedRestaurants);
      setSelectedRestaurantId(ownedRestaurants[0]?.id ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os restaurantes do proprietário.');
    } finally {
      setLoading(false);
    }
  }

  async function loadReservations(restaurantId: string, currentFilter: string) {
    try {
      const data = await ownerService.listReservations(restaurantId, {
        status: currentFilter === 'all' ? undefined : currentFilter,
        limit: 50
      });
      setReservations(data.reservations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar as reservas recebidas.');
    }
  }

  async function handleConfirm(reservationId: string) {
    try {
      await ownerService.confirmReservation(reservationId);
      toast.success('Reserva confirmada com sucesso.');
      await loadReservations(selectedRestaurantId, filter);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível confirmar a reserva.');
    }
  }

  async function handleReject(reservationId: string) {
    try {
      await ownerService.rejectReservation(reservationId, 'Reserva recusada pelo estabelecimento.');
      toast.success('Reserva recusada com sucesso.');
      await loadReservations(selectedRestaurantId, filter);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível recusar a reserva.');
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#f7f1e8]" />;
  }

  return (
    <section className="min-h-screen bg-[#f7f1e8] px-4 py-8 text-[#22150d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] bg-[#20130d] px-6 py-8 text-white shadow-[0_30px_80px_rgba(35,21,15,0.22)] sm:px-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#e9c791]">Atendimento do restaurante</p>
          <h1 className="mt-4 font-display text-4xl text-white">Gerencie as reservas recebidas com mais clareza</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80">
            Consulte solicitações pendentes, confirme reservas em poucos cliques e acompanhe o calendário do seu restaurante com melhor legibilidade.
          </p>
        </div>

        {error ? <StatusMessage tone="error" title="Falha ao carregar reservas" description={error} /> : null}

        <Card className="border-[#ead9c0] bg-white p-6 shadow-[0_14px_40px_rgba(78,50,28,0.08)] sm:p-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:items-end">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[#3f2b1d]">Restaurante</span>
              <select
                value={selectedRestaurantId}
                onChange={(event) => setSelectedRestaurantId(event.target.value)}
                className="owner-input"
              >
                <option value="">Selecione um restaurante</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.nome}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-wrap gap-2">
              {filters.map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={filter === status ? 'default' : 'outline'}
                  onClick={() => setFilter(status)}
                >
                  {status === 'all' ? 'Todas' : status.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {reservations.length === 0 ? (
            <StatusMessage
              title="Nenhuma reserva encontrada"
              description="Assim que novas solicitações chegarem, elas aparecerão aqui para gestão do restaurante."
            />
          ) : null}

          {reservations.map((reservation) => (
            <Card key={reservation.id} className="border-[#ead9c0] bg-white p-6 shadow-[0_14px_40px_rgba(78,50,28,0.08)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#8b5e34]">Cliente</p>
                    <h2 className="mt-1 text-2xl font-semibold text-[#26170f]">{reservation.usuario?.nome || reservation.nomeUsuario}</h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Info label="Data" value={new Date(reservation.dataReserva).toLocaleDateString()} />
                    <Info label="Horário" value={reservation.horarioReserva} />
                    <Info label="Pessoas" value={String(reservation.quantidadePessoas)} />
                    <Info label="Mesa" value={reservation.mesa?.numero || reservation.numeroMesa || 'A definir'} />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <span className="rounded-full bg-[#f6ead9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#5d4738]">
                    {reservation.status}
                  </span>
                  {reservation.status === 'PENDENTE' ? (
                    <div className="flex flex-wrap gap-3">
                      <Button type="button" variant="outline" onClick={() => void handleReject(reservation.id)}>
                        Recusar
                      </Button>
                      <Button type="button" onClick={() => void handleConfirm(reservation.id)}>
                        Confirmar
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#ead9c0] bg-[#fffaf4] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-[#8b5e34]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[#26170f]">{value}</p>
    </div>
  );
}
