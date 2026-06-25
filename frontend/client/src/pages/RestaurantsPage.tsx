/**
 * Restaurants discovery page with search, filters, and listing.
 * Provides a professional restaurant browsing experience.
 */

import { useEffect, useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  UtensilsCrossed,
  MapPin,
  X,
  Filter
} from 'lucide-react';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { RestaurantFilters } from '@/components/restaurants/RestaurantFilters';
import { RestaurantGrid } from '@/components/restaurants/RestaurantGrid';
import { restaurantService } from '@/services/restaurant.service';
import type { Restaurant } from '@/types/api';

export function RestaurantsPage() {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const data = await restaurantService.list();
        setAllRestaurants(data);
        setFilteredRestaurants(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Não foi possível carregar os restaurantes.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRestaurants();
  }, []);

  // Filtro rápido por busca
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredRestaurants(allRestaurants);
      return;
    }
    
    const searchLower = term.toLowerCase();
    const filtered = allRestaurants.filter(
      r => 
        r.nome.toLowerCase().includes(searchLower) ||
        r.tipoCulinaria?.toLowerCase().includes(searchLower) ||
        r.cidade?.toLowerCase().includes(searchLower) ||
        r.descricao?.toLowerCase().includes(searchLower)
    );
    setFilteredRestaurants(filtered);
  };

  // Cidades únicas para exibição
  const cidades = [...new Set(allRestaurants.map(r => r.cidade).filter((cidade): cidade is string => Boolean(cidade)))];
  const tiposCulinaria = [...new Set(allRestaurants.map(r => r.tipoCulinaria).filter((tipo): tipo is string => Boolean(tipo)))];

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Descobrindo restaurantes"
        description="Carregando a curadoria gastronômica para você..."
      />
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5ede0] to-[#faf7f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Premium */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#1a0f0a] via-[#2c1a12] to-[#1a0f0a] px-6 py-8 sm:px-8 lg:px-10 mb-8 shadow-[0_30px_80px_rgba(35,21,15,0.25)]">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#f0d1a2]/5 to-transparent rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#8b5e34]/5 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none" />
          
          <div className="relative space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f0d1a2] to-[#c8944a] flex items-center justify-center shadow-lg shadow-[#f0d1a2]/20">
                    <UtensilsCrossed className="w-6 h-6 text-[#1a0f0a]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#f0d1a2] font-medium">
                      {allRestaurants.length} {allRestaurants.length === 1 ? 'restaurante' : 'restaurantes'} disponíveis
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl text-white leading-tight">
                      Descubra onde{' '}
                      <span className="bg-gradient-to-r from-[#f0d1a2] to-[#c8944a] bg-clip-text text-transparent">
                        reservar
                      </span>
                    </h1>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              {allRestaurants.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {cidades.length > 0 && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm px-4 py-2">
                      <MapPin className="h-3.5 w-3.5 text-[#f0d1a2]" />
                      <span className="text-sm text-white/80">{cidades.length} {cidades.length === 1 ? 'cidade' : 'cidades'}</span>
                    </div>
                  )}
                  {tiposCulinaria.length > 0 && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm px-4 py-2">
                      <UtensilsCrossed className="h-3.5 w-3.5 text-[#f0d1a2]" />
                      <span className="text-sm text-white/80">{tiposCulinaria.length} {tiposCulinaria.length === 1 ? 'tipo' : 'tipos'} de culinária</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#f0d1a2]/60" />
              <input
                type="text"
                placeholder="Buscar por nome, tipo de culinária, cidade..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f0d1a2]/30 focus:border-[#f0d1a2]/50 transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-panel rounded-[2rem] p-6 mb-8">
            <StatusMessage
              tone="error"
              title="Erro ao carregar restaurantes"
              description={error}
            />
          </div>
        )}

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-[#e9dccb] bg-white/80 backdrop-blur-sm px-6 py-4 text-[#26170f] font-medium hover:border-[#8b5e34]/50 hover:bg-[#f8f0e2] transition-all duration-300"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {showMobileFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            <span className="text-xs text-[#8b5e34] ml-2">
              ({filteredRestaurants.length} resultado{filteredRestaurants.length !== 1 ? 's' : ''})
            </span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar with Filters */}
          <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-4 space-y-4">
              <div className="glass-panel rounded-[2rem] p-6 shadow-[0_14px_40px_rgba(78,50,28,0.08)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#f7ecd8] flex items-center justify-center">
                      <Filter className="h-4 w-4 text-[#8b5e34]" />
                    </div>
                    <h2 className="text-lg font-semibold text-[#26170f]">Filtros</h2>
                  </div>
                  {filteredRestaurants.length !== allRestaurants.length && (
                    <button
                      onClick={() => {
                        setFilteredRestaurants(allRestaurants);
                        setSearchTerm('');
                      }}
                      className="text-xs text-[#8b5e34] hover:text-[#6b3a2a] font-medium transition-colors"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                
                {/* Result count */}
                <div className="mb-6 p-3 rounded-xl bg-[#f8f0e2] text-center">
                  <p className="text-2xl font-bold text-[#26170f]">{filteredRestaurants.length}</p>
                  <p className="text-xs text-[#8b5e34] mt-1">
                    {filteredRestaurants.length === 1 ? 'restaurante encontrado' : 'restaurantes encontrados'}
                  </p>
                </div>

                <RestaurantFilters
                  restaurants={allRestaurants}
                  onFilterChange={setFilteredRestaurants}
                />
              </div>

              {/* Quick Tags */}
              {tiposCulinaria.length > 0 && (
                <div className="glass-panel rounded-[2rem] p-6 shadow-[0_14px_40px_rgba(78,50,28,0.08)]">
                  <h3 className="text-sm font-semibold text-[#26170f] mb-4 flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-[#8b5e34]" />
                    Tipos de culinária
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tiposCulinaria.slice(0, 8).map((tipo) => (
                      <button
                        key={tipo}
                        onClick={() => handleSearch(tipo)}
                        className="px-3 py-1.5 rounded-xl bg-[#f8f0e2] text-xs text-[#8b5e34] hover:bg-[#f0e6d8] hover:text-[#6b3a2a] font-medium transition-all duration-200"
                      >
                        {tipo}
                      </button>
                    ))}
                    {tiposCulinaria.length > 8 && (
                      <span className="px-3 py-1.5 rounded-xl bg-[#f8f0e2] text-xs text-[#8b5e34]">
                        +{tiposCulinaria.length - 8}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Restaurant Grid */}
          <div className="lg:col-span-3">
            {filteredRestaurants.length === 0 && !error ? (
              <div className="glass-panel rounded-[2.5rem] p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#f7ecd8] flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-[#8b5e34]/40" />
                </div>
                <h3 className="text-2xl font-semibold text-[#26170f] mb-2">
                  Nenhum restaurante encontrado
                </h3>
                <p className="text-[#6b5647] mb-8 max-w-md mx-auto">
                  Tente ajustar os filtros ou buscar por outro termo para encontrar o restaurante perfeito.
                </p>
                <button
                  onClick={() => {
                    setFilteredRestaurants(allRestaurants);
                    setSearchTerm('');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] px-6 py-3 text-white font-medium shadow-lg shadow-[#8b5e34]/20 hover:shadow-xl hover:shadow-[#8b5e34]/30 transition-all duration-300"
                >
                  <Sparkles className="h-4 w-4" />
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                {/* Results info */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-[#6b5647]">
                    Exibindo <span className="font-semibold text-[#26170f]">{filteredRestaurants.length}</span> de{' '}
                    <span className="font-semibold text-[#26170f]">{allRestaurants.length}</span> restaurantes
                  </p>
                </div>

                <RestaurantGrid
                  restaurants={filteredRestaurants}
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}