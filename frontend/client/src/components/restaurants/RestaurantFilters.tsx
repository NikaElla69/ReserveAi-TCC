/**
 * Restaurant filters component with search and filtering options.
 * Provides client-side filtering for restaurant discovery.
 */

import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import { restaurantSearchSchema, type RestaurantSearchFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Restaurant } from '@/types/api';

interface RestaurantFiltersProps {
  restaurants: Restaurant[];
  onFilterChange: (filtered: Restaurant[]) => void;
}

const CUISINE_TYPES = [
  'Italiana',
  'Japonesa',
  'Brasileira',
  'Francesa',
  'Mexicana',
  'Chinesa',
  'Tailandesa',
  'Portuguesa',
  'Espanhola',
  'Americana'
];

const CITIES = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Brasília',
  'Salvador',
  'Recife',
  'Fortaleza',
  'Manaus',
  'Curitiba',
  'Porto Alegre'
];

export function RestaurantFilters({ restaurants, onFilterChange }: RestaurantFiltersProps) {
  const form = useForm<RestaurantSearchFormData>({
    resolver: zodResolver(restaurantSearchSchema) as any,
    defaultValues: {
      termo: '',
      tipoCulinaria: '',
      cidade: '',
      ordenarPor: 'nome'
    }
  });

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];

    const termo = form.watch('termo');
    const tipoCulinaria = form.watch('tipoCulinaria');
    const cidade = form.watch('cidade');
    const ordenarPor = form.watch('ordenarPor');

    // Filter by search query
    if (termo) {
      const lowerQuery = termo.toLowerCase();
      result = result.filter(
        (r) =>
          r.nome.toLowerCase().includes(lowerQuery) ||
          r.descricao?.toLowerCase().includes(lowerQuery) ||
          r.endereco?.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by cuisine type
    if (tipoCulinaria && tipoCulinaria !== 'todos') {
      result = result.filter((r) => r.tipoCulinaria?.toLowerCase() === tipoCulinaria.toLowerCase());
    }

    // Filter by city
    if (cidade && cidade !== 'todas') {
      result = result.filter((r) => r.cidade?.toLowerCase() === cidade.toLowerCase());
    }

    // Sort
    if (ordenarPor === 'nome') {
      result.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordenarPor === 'recentes') {
      result.sort((a, b) => new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime());
    }

    return result;
  }, [restaurants, form]);

  const handleReset = useCallback(() => {
    form.reset({
      termo: '',
      tipoCulinaria: 'todos',
      cidade: 'todas',
      ordenarPor: 'nome'
    });
  }, [form]);

  // Notify parent of filtered results
  const hasActiveFilters = form.watch('termo') || (form.watch('tipoCulinaria') && form.watch('tipoCulinaria') !== 'todos') || (form.watch('cidade') && form.watch('cidade') !== 'todas');

  return (
    <div className="space-y-4">
      <Form {...form}>
        <div className="space-y-4">
          {/* Search Field */}
          <FormField
            control={form.control}
            name="termo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Buscar</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Nome, descrição ou endereço..."
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cuisine Type Filter */}
          <FormField
            control={form.control}
            name="tipoCulinaria"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Tipo de Culinária</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tipos</SelectItem>
                    {CUISINE_TYPES.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City Filter */}
          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Cidade</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as cidades" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="todas">Todas as cidades</SelectItem>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sort By */}
          <FormField
            control={form.control}
            name="ordenarPor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Ordenar por</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nome">Nome (A-Z)</SelectItem>
                    <SelectItem value="recentes">Mais recentes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleReset}
            >
              <X className="mr-2 h-4 w-4" />
              Limpar filtros
            </Button>
          )}

          {/* Results Count */}
          <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <p>
              <strong>{filteredRestaurants.length}</strong> restaurante{filteredRestaurants.length !== 1 ? 's' : ''} encontrado{filteredRestaurants.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </Form>
    </div>
  );
}
