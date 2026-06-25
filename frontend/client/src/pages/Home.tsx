/**
 * Design philosophy for the home page: present restaurant discovery as an editorial spread with strong hierarchy, warm contrast and clear action.
 */
import { ArrowRight, CalendarCheck2, MapPin, Sparkles, Star, UtensilsCrossed, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { imagery } from '@/lib/assets';
import { restaurantService } from '@/services/restaurant.service';
import type { Restaurant } from '@/types/api';

const highlights = [
  {
    title: 'Encontre restaurantes',
    description: 'Pesquise opções por cidade, estilo e atmosfera para decidir onde será sua próxima refeição.',
    icon: UtensilsCrossed,
    gradient: 'from-[#8b5e34] to-[#6b3a2a]',
    iconBg: 'bg-[#f7ecd8]'
  },
  {
    title: 'Reserve em segundos',
    description: 'Escolha data, horário e número de pessoas com um fluxo simples e direto.',
    icon: CalendarCheck2,
    gradient: 'from-[#c8944a] to-[#a67c3d]',
    iconBg: 'bg-[#fef3e0]'
  },
  {
    title: 'Gerencie com praticidade',
    description: 'Acompanhe suas reservas, consulte detalhes e organize seus próximos encontros à mesa.',
    icon: MapPin,
    gradient: 'from-[#4a6741] to-[#3a5234]',
    iconBg: 'bg-[#e8f0e4]'
  }
];

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const data = await restaurantService.list();
        setRestaurants(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os restaurantes.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRestaurants();
  }, []);

  const totalRestaurantsLabel = useMemo(() => `${restaurants.length.toString().padStart(2, '0')} experiências`, [restaurants.length]);

  if (isLoading) {
    return <FullScreenLoader title="Montando a curadoria gastronômica" description="Buscando restaurantes para a sua próxima reserva." />;
  }

  return (
    <div className="space-y-16 pb-12 pt-8 sm:space-y-24 sm:pb-16">
      {/* Hero Section Premium */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="hero-shell mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2.4rem] border border-[#e9dccb] bg-gradient-to-br from-[#1a0f0a] via-[#261912] to-[#1a0f0a] px-6 py-8 shadow-[0_28px_100px_rgba(60,35,18,0.25)] sm:px-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-12">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#f0d1a2]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#8b5e34]/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col justify-between gap-10 py-3">
            <div className="space-y-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#f0d1a2]/30 bg-white/10 backdrop-blur-sm px-5 py-2.5 text-xs uppercase tracking-[0.28em] text-[#f0d1a2] shadow-lg shadow-[#f0d1a2]/5">
                <Sparkles className="h-4 w-4 animate-pulse" />
                ReserveAí
                <Star className="h-3 w-3 fill-[#f0d1a2] text-[#f0d1a2]" />
              </div>
              
              <div className="space-y-5">
                <h1 className="max-w-2xl font-display text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                  Descubra restaurantes e{' '}
                  <span className="bg-gradient-to-r from-[#f0d1a2] via-[#e8c178] to-[#d4a24e] bg-clip-text text-transparent">
                    reserve mesas
                  </span>
                  {' '}com facilidade
                </h1>
                <p className="max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                  Explore restaurantes, consulte disponibilidade, escolha o melhor horário e organize suas reservas com uma experiência simples e intuitiva.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link 
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#f0d1a2] to-[#d4a24e] px-8 py-4 text-[#1a0f0a] font-semibold shadow-xl shadow-[#f0d1a2]/20 transition-all duration-300 hover:shadow-2xl hover:shadow-[#f0d1a2]/30 hover:scale-[1.02] active:scale-[0.98]"
                to="/register"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles className="h-5 w-5" />
                Criar conta e reservar
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <Link 
                className="group flex items-center justify-center gap-2 rounded-2xl border-2 border-white/20 bg-white/5 px-8 py-4 text-white font-medium backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-lg active:scale-[0.98]"
                to="/reservations"
              >
                <CalendarCheck2 className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                Ver minhas reservas
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="group rounded-[1.5rem] border border-white/10 bg-white/5 backdrop-blur-sm p-5 transition-all duration-300 hover:bg-white/10 hover:border-[#f0d1a2]/30 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <UtensilsCrossed className="h-4 w-4 text-[#f0d1a2]" />
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">Curadoria</p>
                </div>
                <p className="font-display text-3xl text-white group-hover:text-[#f0d1a2] transition-colors duration-300">{totalRestaurantsLabel}</p>
              </div>
              
              <div className="group rounded-[1.5rem] border border-white/10 bg-white/5 backdrop-blur-sm p-5 transition-all duration-300 hover:bg-white/10 hover:border-[#f0d1a2]/30 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarCheck2 className="h-4 w-4 text-[#f0d1a2]" />
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">Reservas</p>
                </div>
                <p className="font-display text-3xl text-white group-hover:text-[#f0d1a2] transition-colors duration-300">Em segundos</p>
              </div>
              
              <div className="group rounded-[1.5rem] border border-white/10 bg-white/5 backdrop-blur-sm p-5 transition-all duration-300 hover:bg-white/10 hover:border-[#f0d1a2]/30 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-[#f0d1a2]" />
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">Experiência</p>
                </div>
                <p className="font-display text-3xl text-white group-hover:text-[#f0d1a2] transition-colors duration-300">Intuitiva</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-white/15 group">
            <img alt="Ambiente premium de restaurante" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={imagery.hero} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,11,8,0.04),rgba(18,11,8,0.65))]" />
            
            {/* Floating badge */}
            <div className="absolute top-6 right-6 bg-white/15 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3.5 w-3.5 fill-[#f0d1a2] text-[#f0d1a2]" />
                  ))}
                </div>
                <span className="text-white text-sm font-semibold">4.9</span>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <div className="glass-dark inline-flex max-w-md flex-col gap-3 rounded-[1.6rem] p-6 border border-white/10">
                <p className="text-xs uppercase tracking-[0.28em] text-[#f0d1a2] font-medium">Sua próxima mesa</p>
                <p className="font-display text-2xl leading-tight">Escolha o restaurante, consulte a disponibilidade e confirme em poucos passos.</p>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Reservas instantâneas
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b5e34] font-medium mb-3">Como funciona</p>
            <h2 className="font-display text-4xl text-[#26170f] sm:text-5xl mb-4">
              Três passos para sua{' '}
              <span className="bg-gradient-to-r from-[#8b5e34] to-[#c8944a] bg-clip-text text-transparent">
                experiência perfeita
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-[#6b5647] text-sm leading-7">
              Do discovery à reserva, cada etapa foi pensada para ser rápida, intuitiva e prazerosa.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map(({ title, description, icon: Icon, gradient, iconBg }, index) => (
              <article 
                className="group glass-panel rounded-[2rem] p-8 shadow-[0_20px_65px_rgba(75,46,25,0.08)] transition-all duration-300 hover:shadow-xl hover:shadow-[#8b5e34]/10 hover:-translate-y-1" 
                key={title}
              >
                <div className="relative mb-6">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconBg} text-[#8b5e34] shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-[#f0d1a2] to-[#d4a24e] flex items-center justify-center text-[#1a0f0a] font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
                
                <h2 className="font-display text-2xl text-[#26170f] mb-3 group-hover:text-[#8b5e34] transition-colors duration-300">
                  {title}
                </h2>
                <p className="text-sm leading-7 text-[#6b5647]">
                  {description}
                </p>
                
                <div className={`mt-6 h-1 rounded-full bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-all duration-500 w-0 group-hover:w-full`} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f7ecd8] flex items-center justify-center">
                  <UtensilsCrossed className="h-4 w-4 text-[#8b5e34]" />
                </div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#8b5e34] font-medium">Restaurantes</p>
              </div>
              <h2 className="font-display text-4xl text-[#26170f] sm:text-5xl">
                Restaurantes para cada{' '}
                <span className="bg-gradient-to-r from-[#8b5e34] to-[#c8944a] bg-clip-text text-transparent">
                  ocasião
                </span>
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[#6b5647]">
                Navegue por opções, compare ambientes e abra cada restaurante para conferir detalhes, horários disponíveis e informações importantes antes de reservar.
              </p>
            </div>
            
            <Link 
              className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] px-6 py-3.5 text-white font-medium shadow-lg shadow-[#8b5e34]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#8b5e34]/30 hover:scale-[1.02] active:scale-[0.98]"
              to="/register"
            >
              <Sparkles className="h-4 w-4" />
              Criar conta para reservar
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {error ? (
            <StatusMessage
              description="Não foi possível carregar os restaurantes agora. Tente novamente em instantes."
              title={error}
              tone="error"
            />
          ) : null}

          {!error && restaurants.length > 0 && (
            <div className="grid gap-6 xl:grid-cols-2">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}

          {!error && restaurants.length === 0 ? (
            <div className="glass-panel rounded-[2rem] p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#f7ecd8] flex items-center justify-center mx-auto mb-6">
                <UtensilsCrossed className="h-10 w-10 text-[#8b5e34]" />
              </div>
              <StatusMessage
                description="Ainda não há restaurantes disponíveis para exibição. Volte em breve para conferir novas opções."
                title="Nenhum restaurante disponível no momento"
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}