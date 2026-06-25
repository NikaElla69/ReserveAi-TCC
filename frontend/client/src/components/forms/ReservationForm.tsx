/**
 * Reservation form focused on helping users confirm a table quickly and clearly.
 */

import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { reservationSchema, type ReservationFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Calendar, Clock, Users, FileText } from 'lucide-react';
import type { TableEntity } from '@/types/api';

interface ReservationFormProps {
  restaurantId: string;
  tables: TableEntity[];
  defaultDate?: string;
  defaultTime?: string;
  defaultGuestCount?: number;
  onSubmit: (data: ReservationFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ReservationForm({
  restaurantId,
  tables,
  defaultDate,
  defaultTime,
  defaultGuestCount = 1,
  onSubmit,
  isLoading = false
}: ReservationFormProps) {
  const [selectedTableCapacity, setSelectedTableCapacity] = useState<number | null>(null);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema) as any,
    defaultValues: {
      restauranteId: restaurantId,
      mesaId: '',
      dataReserva: defaultDate || new Date().toISOString().slice(0, 10),
      horarioReserva: defaultTime || '19:00',
      quantidadePessoas: defaultGuestCount,
      observacoes: ''
    }
  });

  const selectedTableId = form.watch('mesaId');
  const quantidadePessoas = form.watch('quantidadePessoas');

  useEffect(() => {
    if (selectedTableId) {
      const table = tables.find((t) => t.id === selectedTableId);
      setSelectedTableCapacity(table?.capacidade || null);
    } else {
      setSelectedTableCapacity(null);
    }
  }, [selectedTableId, tables]);

  const availableTables = tables.filter((t) => t.ativo && t.capacidade >= quantidadePessoas);

  const handleSubmit: SubmitHandler<ReservationFormData> = async (data: ReservationFormData) => {
    try {
      await onSubmit(data);
      form.reset({
        restauranteId: restaurantId,
        mesaId: '',
        dataReserva: defaultDate || new Date().toISOString().slice(0, 10),
        horarioReserva: defaultTime || '19:00',
        quantidadePessoas: defaultGuestCount,
        observacoes: ''
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar reserva';
      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="dataReserva"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data da reserva
              </FormLabel>
              <FormControl>
                <Input type="date" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="horarioReserva"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horário
              </FormLabel>
              <FormControl>
                <Input type="time" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantidadePessoas"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Número de pessoas
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  disabled={isLoading}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
              {availableTables.length === 0 && quantidadePessoas > 0 && (
                <p className="text-sm text-red-600">
                  Nenhuma mesa disponível para {quantidadePessoas} pessoa{quantidadePessoas !== 1 ? 's' : ''}.
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mesaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mesa</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={isLoading || availableTables.length === 0}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma mesa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableTables.map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      Mesa {table.numero} (Capacidade: {table.capacidade})
                      {table.localizacao && ` - ${table.localizacao}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              {selectedTableCapacity && (
                <p className="text-sm text-gray-600">Capacidade da mesa: {selectedTableCapacity} pessoas</p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Observações (opcional)
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Preferências especiais, alergias ou outros detalhes importantes." disabled={isLoading} rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading || availableTables.length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando reserva...
            </>
          ) : (
            'Confirmar reserva'
          )}
        </Button>
      </form>
    </Form>
  );
}
