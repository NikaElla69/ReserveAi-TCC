/**
 * Design philosophy for reservation creation: guide the user through one decisive form with the minimum friction and clear backend semantics.
 */
import { ArrowLeft, CalendarCheck, Clock, Sparkles, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { ReservationForm } from '@/components/forms/ReservationForm';
import { restaurantService } from '@/services/restaurant.service';
import { reservationService } from '@/services/reservation.service';
import { tableService } from '@/services/table.service';
import type { Restaurant, TableEntity } from '@/types/api';
import type { ReservationFormData } from '@/lib/validation';

export function ReservationCreatePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [tables, setTables] = useState<TableEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const restaurantId = String(id || '');
  const defaults = useMemo(
    () => ({
      date: searchParams.get('date') || new Date().toISOString().slice(0, 10),
      time: searchParams.get('time') || '19:00',
      guestCount: Number(searchParams.get('guestCount') || 2)
    }),
    [searchParams]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [restaurantData, tableData] = await Promise.all([
          restaurantService.getById(restaurantId),
          tableService.listByRestaurant(restaurantId)
        ]);
        setRestaurant(restaurantData);
        setTables(tableData.filter((table) => table.ativo));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os dados para a reserva.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!Number.isNaN(restaurantId)) {
      void loadData();
    }
  }, [restaurantId]);

  const handleSubmit = async (data: ReservationFormData) => {
    try {
      setIsSubmitting(true);
      await reservationService.create({
        restauranteId: data.restauranteId,
        mesaId: data.mesaId,
        dataReserva: data.dataReserva,
        horarioReserva: data.horarioReserva,
        quantidadePessoas: data.quantidadePessoas,
        observacoes: data.observacoes
      });
      toast.success('🎉 Reserva criada com sucesso!');
      navigate('/reservations');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível criar a reserva.';
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Preparando sua reserva"
        description="Carregando restaurante e mesas disponíveis para preencher o formulário."
      />
    );
  }

  if (error || !restaurant) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl">
          <StatusMessage
            description="Volte à página anterior e tente novamente em instantes."
            title={error || 'Restaurante não encontrado'}
            tone="error"
          />
        </div>
      </section>
    );
  }

  // Formatação da data para exibição
  const formatarData = (dataString: string) => {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Sidebar melhorada */}
        <aside className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#20140e] via-[#2c1a12] to-[#1a0f0a] p-6 shadow-[0_24px_80px_rgba(30,18,10,0.35)] sm:p-8">
          {/* Elemento decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#8b5e34]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <div className="relative space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#f0d1a2] animate-pulse" />
                <p className="text-xs uppercase tracking-[0.3em] text-[#f0d1a2] font-medium">Nova Reserva</p>
              </div>
              <h1 className="font-display text-4xl text-white leading-tight">
                Garanta seu lugar em{' '}
                <span className="bg-gradient-to-r from-[#f0d1a2] to-[#e8b96a] bg-clip-text text-transparent">
                  {restaurant.nome}
                </span>
              </h1>
              <p className="text-sm leading-7 text-white/74">
                Escolha a melhor mesa, defina data e horário e conclua sua reserva em poucos cliques.
              </p>
            </div>

            {/* Cards informativos melhorados */}
            <div className="space-y-3">
              <div className="group rounded-[1.4rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-[#f0d1a2]/30">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#8b5e34]/20 flex items-center justify-center">
                    <CalendarCheck className="h-5 w-5 text-[#f0d1a2]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Data selecionada</p>
                    <p className="mt-1 text-white font-semibold">{formatarData(defaults.date)}</p>
                  </div>
                </div>
              </div>

              <div className="group rounded-[1.4rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-[#f0d1a2]/30">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#8b5e34]/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-[#f0d1a2]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Horário</p>
                    <p className="mt-1 text-white font-semibold">{defaults.time}</p>
                  </div>
                </div>
              </div>

              <div className="group rounded-[1.4rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-[#f0d1a2]/30">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#8b5e34]/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-[#f0d1a2]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Mesas disponíveis</p>
                    <p className="mt-1 text-white font-semibold">{tables.length} {tables.length === 1 ? 'opção' : 'opções'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de voltar melhorado */}
            <Link
              className="group flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-6 py-4 text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/25 hover:shadow-lg active:scale-[0.98]"
              to={`/restaurants/${restaurant.id}`}
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Voltar aos detalhes do restaurante
            </Link>
          </div>
        </aside>

        {/* Formulário melhorado */}
        <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 shadow-[0_20px_65px_rgba(75,46,25,0.10)] sm:p-8">
          {/* Decoração sutil */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#8b5e34]/5 to-transparent rounded-full -translate-y-1/4 translate-x-1/4 blur-2xl" />
          
          <div className="relative">
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-[#8b5e34]" />
                <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34] font-medium">Preencha os dados</p>
              </div>
              <h2 className="font-display text-4xl text-[#26170f] leading-tight">
                Complete sua reserva
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[#6b5647]">
                Informe a data, horário, quantidade de pessoas e escolha a mesa ideal para sua ocasião.
              </p>
            </div>

            {/* Destaque para informações importantes */}
            <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#f8f0e2] to-[#fef9f0] border border-[#e9dccb]">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#8b5e34] animate-pulse" />
                </div>
                <div className="text-sm text-[#4b382a]">
                  <p className="font-semibold mb-1">Informações importantes:</p>
                  <ul className="space-y-1 text-[#6b5647]">
                    <li>• Sua reserva será confirmada instantaneamente</li>
                    <li>• Você pode cancelar ou modificar depois em "Minhas Reservas"</li>
                    <li>• Chegue com 10 minutos de antecedência</li>
                  </ul>
                </div>
              </div>
            </div>

            <ReservationForm
              restaurantId={restaurantId}
              tables={tables}
              defaultDate={defaults.date}
              defaultTime={defaults.time}
              defaultGuestCount={defaults.guestCount}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />

            {/* Rodapé do formulário */}
            <div className="mt-6 pt-6 border-t border-[#e9dccb]">
              <p className="text-xs text-center text-[#8b5e34]/70">
                Ao criar uma reserva, você concorda com os termos de uso e política de cancelamento do {restaurant.nome}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}