/**
 * Design philosophy for availability search: make operational data approachable, so the diner sees options rather than database mechanics.
 */
import { CalendarRange, Clock3, UsersRound } from 'lucide-react';
import type { RestaurantAvailabilityResponse } from '@/types/api';

interface AvailabilityPanelProps {
  isLoading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  result: RestaurantAvailabilityResponse | null;
  error: string | null;
  defaultValues: {
    date: string;
    time: string;
    guestCount: number;
  };
}

export function AvailabilityPanel({ isLoading, onSubmit, result, error, defaultValues }: AvailabilityPanelProps) {
  return (
    <section className="glass-panel space-y-6 rounded-[1.9rem] p-6 shadow-[0_20px_65px_rgba(75,46,25,0.10)] sm:p-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">Disponibilidade</p>
        <h3 className="font-display text-3xl text-[#26170f]">Descubra as melhores mesas para o horário desejado</h3>
        <p className="max-w-2xl text-sm leading-7 text-[#6b5647]">
          Informe data, horário e quantidade de pessoas para descobrir quais mesas combinam melhor com a sua reserva.
        </p>
      </div>

      <form className="grid gap-4 md:grid-cols-[1fr_1fr_0.8fr_auto] md:items-end" onSubmit={onSubmit}>
        <label className="space-y-2 text-sm text-[#4b382a]">
          Data
          <div className="input-shell">
            <CalendarRange className="h-4 w-4 text-[#8b5e34]" />
            <input className="field-input" defaultValue={defaultValues.date} name="date" required type="date" />
          </div>
        </label>
        <label className="space-y-2 text-sm text-[#4b382a]">
          Horário
          <div className="input-shell">
            <Clock3 className="h-4 w-4 text-[#8b5e34]" />
            <input className="field-input" defaultValue={defaultValues.time} name="time" required type="time" />
          </div>
        </label>
        <label className="space-y-2 text-sm text-[#4b382a]">
          Pessoas
          <div className="input-shell">
            <UsersRound className="h-4 w-4 text-[#8b5e34]" />
            <input className="field-input" defaultValue={defaultValues.guestCount} max={20} min={1} name="guestCount" required type="number" />
          </div>
        </label>
        <button className="btn-primary h-12 justify-center" disabled={isLoading} type="submit">
          {isLoading ? 'Consultando...' : 'Consultar'}
        </button>
      </form>

      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p> : null}

      {result ? (
        <div className="space-y-4 rounded-[1.5rem] border border-[#e8dac7] bg-[#f8f1e6] p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8b5e34]">Resultado</p>
              <p className="font-display text-2xl text-[#26170f]">{result.mesasDisponiveis.length} mesas compatíveis encontradas</p>
            </div>
            <p className="text-sm text-[#6b5647]">
              {result.data} às {result.horario.slice(0, 5)} para {result.quantidadePessoas} pessoa(s)
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {result.mesasDisponiveis.map((table) => (
              <div className="rounded-[1.4rem] border border-white/70 bg-white/80 p-4" key={table.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-[#8b5e34]">Mesa {table.numero}</p>
                    <p className="mt-2 font-display text-2xl text-[#26170f]">Capacidade {table.capacidade}</p>
                  </div>
                  <span className="rounded-full bg-[#f8f0e2] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#5a371c]">
                    {table.localizacao || 'Salão principal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
