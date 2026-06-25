/**
 * Design philosophy for restaurant details: merge storytelling and operational clarity so diners can move naturally from interest to booking.
 */
import { ArrowRight, CalendarClock, Phone, Sparkles, Star, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { AvailabilityPanel } from '@/components/restaurants/AvailabilityPanel';
import { imagery } from '@/lib/assets';
import { restaurantService } from '@/services/restaurant.service';
import { tableService } from '@/services/table.service';
import type { Restaurant, RestaurantAvailabilityResponse, TableEntity } from '@/types/api';

export function RestaurantDetailsPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [tables, setTables] = useState<TableEntity[]>([]);
  const [availability, setAvailability] = useState<RestaurantAvailabilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const restaurantId = String(params.id || '');
  const defaults = useMemo(
    () => ({
      date: searchParams.get('date') || new Date().toISOString().slice(0, 10),
      time: searchParams.get('time') || '19:00',
      guestCount: Number(searchParams.get('guestCount') || 2)
    }),
    [searchParams]
  );

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setIsLoading(true);
        const [restaurantData, tableData] = await Promise.all([
          restaurantService.getById(restaurantId),
          tableService.listByRestaurant(restaurantId)
        ]);
        setRestaurant(restaurantData);
        setTables(tableData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar o restaurante.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!Number.isNaN(restaurantId)) {
      void loadRestaurant();
    }
  }, [restaurantId]);

  const handleAvailability = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setIsCheckingAvailability(true);
      const result = await restaurantService.getAvailability(restaurantId, {
        data: String(formData.get('date')),
        horario: `${String(formData.get('time'))}:00`,
        quantidadePessoas: Number(formData.get('guestCount'))
      });
      setAvailability(result);
      toast.success('Disponibilidade consultada com sucesso.');
    } catch (err) {
      setAvailability(null);
      toast.error(err instanceof Error ? err.message : 'Não foi possível consultar a disponibilidade.');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  if (isLoading) {
    return <FullScreenLoader title="Preparando o restaurante" description="Buscando detalhes, mesas disponíveis e informações para a sua reserva." />;
  }

  if (error || !restaurant) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl">
          <StatusMessage
            description="Não foi possível carregar os detalhes deste restaurante no momento."
            title={error || 'Restaurante não encontrado'}
            tone="error"
          />
        </div>
      </section>
    );
  }

  const reserveLink = availability?.mesasDisponiveis?.[0]
    ? `/restaurants/${restaurant.id}/reserve?tableId=${availability.mesasDisponiveis[0].id}&date=${availability.data}&time=${availability.horario.slice(0, 5)}&guestCount=${availability.quantidadePessoas}`
    : `/restaurants/${restaurant.id}/reserve`;

  // Avaliação simulada (substitua pela real quando disponível)
  const avaliacao = 4.8;
  const totalAvaliacoes = 127;

  return (
    <div className="space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative overflow-hidden rounded-[2.3rem] border border-white/55 min-h-[32rem]">
          <img alt={restaurant.nome} className="h-full w-full object-cover" src={restaurant.logoUrl || imagery.tableDetail} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,8,0.08),rgba(15,10,8,0.78))]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-2">
              <p className="text-xs uppercase tracking-[0.32em] text-[#f0d1a2]">{restaurant.tipoCulinaria || 'Gastronomia'}</p>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/15 text-xs">
                <Star className="h-3 w-3 fill-[#f0d1a2] text-[#f0d1a2]" />
                <span className="text-[#f0d1a2] font-medium">{avaliacao}</span>
                <span className="text-white/60">({totalAvaliacoes})</span>
              </span>
            </div>
            <h1 className="mt-3 max-w-2xl font-display text-5xl leading-tight sm:text-6xl">{restaurant.nome}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/78">
              {restaurant.descricao || 'Confira o ambiente, a disponibilidade e os detalhes do restaurante antes de reservar a sua mesa.'}
            </p>
          </div>
        </div>

        <div className="glass-panel flex flex-col justify-between rounded-[2.3rem] p-6 shadow-[0_20px_65px_rgba(75,46,25,0.10)] sm:p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.32em] text-[#8b5e34]">Sobre o espaço</p>
              <h2 className="font-display text-3xl text-[#26170f]">Tudo o que você precisa para escolher com confiança</h2>
            </div>
            <div className="grid gap-4 text-sm text-[#4b382a]">
              <div className="rounded-[1.4rem] bg-[#f8f0e2] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8b5e34]">Endereço</p>
                <p className="mt-2 leading-7">{restaurant.endereco || 'Endereço não informado'} {restaurant.cidade ? `· ${restaurant.cidade}` : ''}</p>
              </div>
              <div className="rounded-[1.4rem] bg-[#f8f0e2] p-4">
                <div className="flex items-center gap-2 text-[#8b5e34]">
                  <Phone className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.22em]">Contato</span>
                </div>
                <p className="mt-2">{restaurant.telefone || 'Telefone não informado'}</p>
              </div>
              <div className="rounded-[1.4rem] bg-[#f8f0e2] p-4">
                <div className="flex items-center gap-2 text-[#8b5e34]">
                  <CalendarClock className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.22em]">Política de reservas</span>
                </div>
                <p className="mt-2">{restaurant.politicaReservas || 'Consulte o restaurante para mais detalhes.'}</p>
              </div>
            </div>
          </div>
          
          {/* Botões melhorados e mais chamativos */}
          <div className="mt-8 space-y-3">
            <Link 
              className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#8b5e34] via-[#6b3a2a] to-[#4a2512] px-8 py-5 text-white shadow-lg shadow-[#8b5e34]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#8b5e34]/40 hover:scale-[1.02] active:scale-[0.98]" 
              to={reserveLink}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Sparkles className="h-5 w-5 text-[#f0d1a2] animate-pulse" />
              <span className="text-base font-semibold tracking-wide">Criar Reserva Agora</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            
            <Link 
              className="group flex items-center justify-center gap-2 rounded-2xl border-2 border-[#8b5e34]/30 bg-white/80 px-8 py-4 text-[#4a2512] backdrop-blur-sm transition-all duration-300 hover:border-[#8b5e34]/60 hover:bg-[#f8f0e2] hover:shadow-md active:scale-[0.98]" 
              to="/reservations"
            >
              <CalendarClock className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-sm font-medium">Ver Minhas Reservas</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <AvailabilityPanel defaultValues={defaults} error={null} isLoading={isCheckingAvailability} onSubmit={handleAvailability} result={availability} />
      </section>

      <section className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.32em] text-[#8b5e34]">Mesas disponíveis</p>
          <h2 className="font-display text-4xl text-[#26170f]">Escolha o espaço ideal para a sua reserva</h2>
          <p className="max-w-2xl text-sm leading-7 text-[#6b5647]">
            Veja a capacidade de cada mesa, confira a localização e escolha a opção que melhor combina com a ocasião.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tables.map((table) => (
            <article className="group glass-panel rounded-[1.7rem] p-5 shadow-[0_20px_65px_rgba(75,46,25,0.10)] transition-all duration-300 hover:shadow-xl hover:shadow-[#8b5e34]/10 hover:-translate-y-1" key={table.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#8b5e34]">Mesa {table.numero}</p>
                  <h3 className="mt-2 font-display text-3xl text-[#26170f]">{table.capacidade} lugares</h3>
                </div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] ${
                  table.status === 'DISPONIVEL' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : table.ativo 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-slate-200 text-slate-700 border border-slate-300'
                }`}>
                  {table.status === 'DISPONIVEL' ? 'Disponível' : table.ativo ? 'Ocupada' : 'Inativa'}
                </span>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-[#6b5647]">
                <UsersRound className="h-4 w-4 text-[#8b5e34]" />
                {table.localizacao || 'Localização não informada'}
              </p>
              <Link 
                className="group/link mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] px-5 py-3 text-sm font-medium text-white shadow-md shadow-[#8b5e34]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#8b5e34]/30 hover:scale-[1.02] active:scale-[0.98]" 
                to={`/restaurants/${restaurant.id}/reserve?tableId=${table.id}`}
              >
                Reservar esta mesa
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}