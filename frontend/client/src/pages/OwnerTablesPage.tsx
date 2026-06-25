/**
 * Design philosophy for owner table management: keep seating control practical, legible and fast for busy restaurant operations.
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { restaurantService } from '@/services/restaurant.service';
import { tableService } from '@/services/table.service';
import type { Restaurant, TableEntity, TableInput } from '@/types/api';
import {
  Building2,
  Users,
  MapPin,
  Plus,
  Save,
  Trash2,
  Table2,
  Sparkles,
  Edit,
  ArrowLeft,
  LayoutGrid,
  CheckCircle2,
  Wrench,
  Clock,
  AlertCircle
} from 'lucide-react';

const emptyTableForm: Omit<TableInput, 'restauranteId'> = {
  numero: '',
  capacidade: 2,
  localizacao: '',
  status: 'DISPONIVEL',
  ativo: true
};

const statusConfig = {
  DISPONIVEL: {
    label: 'Disponível',
    icon: CheckCircle2,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500'
  },
  MANUTENCAO: {
    label: 'Manutenção',
    icon: Wrench,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  OCUPADA: {
    label: 'Ocupada',
    icon: Clock,
    color: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500'
  }
};

export function OwnerTablesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');
  const [tables, setTables] = useState<TableEntity[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string>('new');
  const [form, setForm] = useState<Omit<TableInput, 'restauranteId'>>(emptyTableForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.papel !== 'OWNER') {
      navigate('/');
      return;
    }

    void bootstrap();
  }, [navigate, user?.papel]);

  const selectedTable = useMemo(
    () => tables.find((table) => table.id === selectedTableId) ?? null,
    [selectedTableId, tables]
  );

  useEffect(() => {
    if (!selectedTable) {
      setForm(emptyTableForm);
      return;
    }

    setForm({
      numero: selectedTable.numero,
      capacidade: selectedTable.capacidade,
      localizacao: selectedTable.localizacao ?? '',
      status: selectedTable.status ?? 'DISPONIVEL',
      ativo: selectedTable.ativo ?? true
    });
  }, [selectedTable]);

  useEffect(() => {
    if (!selectedRestaurantId) {
      return;
    }

    void loadTables(selectedRestaurantId);
  }, [selectedRestaurantId]);

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

  async function loadTables(restaurantId: string) {
    try {
      const data = await tableService.listByRestaurant(restaurantId);
      setTables(data);
      setSelectedTableId('new');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível carregar as mesas.');
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedRestaurantId) {
      toast.error('Selecione um restaurante para gerenciar as mesas.');
      return;
    }

    try {
      setSaving(true);
      const payload: TableInput = {
        restauranteId: selectedRestaurantId,
        numero: form.numero,
        capacidade: Number(form.capacidade),
        localizacao: form.localizacao,
        status: form.status,
        ativo: form.ativo
      };

      if (selectedTable) {
        await tableService.update(selectedTable.id, payload);
        toast.success('✅ Mesa atualizada com sucesso!');
      } else {
        await tableService.create(payload);
        toast.success('🎉 Mesa cadastrada com sucesso!');
      }

      await loadTables(selectedRestaurantId);
      setForm(emptyTableForm);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível salvar a mesa.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(tableId: string) {
    if (!window.confirm('Tem certeza que deseja excluir esta mesa? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await tableService.remove(tableId);
      toast.success('🗑️ Mesa removida com sucesso!');
      await loadTables(selectedRestaurantId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível remover a mesa.');
    }
  }

  function handleChange<K extends keyof Omit<TableInput, 'restauranteId'>>(field: K, value: Omit<TableInput, 'restauranteId'>[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  // Estatísticas das mesas
  const stats = useMemo(() => {
    const disponiveis = tables.filter(t => t.status === 'DISPONIVEL').length;
    const ocupadas = tables.filter(t => t.status === 'OCUPADA').length;
    const manutencao = tables.filter(t => t.status === 'MANUTENCAO').length;
    const capacidadeTotal = tables.reduce((sum, t) => sum + t.capacidade, 0);
    
    return { disponiveis, ocupadas, manutencao, capacidadeTotal, total: tables.length };
  }, [tables]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5ede0] to-[#faf7f2]">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <div className="h-10 w-72 bg-gradient-to-r from-[#e8d5c0] to-[#d4c4af] rounded-xl animate-pulse" />
            <div className="h-5 w-48 bg-[#e8d5c0]/50 rounded-lg mt-2 animate-pulse" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] h-96 animate-pulse border border-[#e9dccb]" />
            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] h-96 animate-pulse border border-[#e9dccb]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5ede0] to-[#faf7f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Premium */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#1a0f0a] via-[#2c1a12] to-[#1a0f0a] px-6 py-8 sm:px-8 lg:px-10 shadow-[0_30px_80px_rgba(35,21,15,0.25)]">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#f0d1a2]/5 to-transparent rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#8b5e34]/5 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none" />
          
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f0d1a2] to-[#c8944a] flex items-center justify-center shadow-lg shadow-[#f0d1a2]/20">
                <LayoutGrid className="w-6 h-6 text-[#1a0f0a]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#e9c791] font-medium">Operação do salão</p>
                <h1 className="mt-1 font-display text-4xl text-white">Gerencie mesas, capacidade e disponibilidade</h1>
              </div>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-white/72">
              Organize o mapa operacional do restaurante e mantenha o time pronto para receber reservas com mais clareza.
            </p>
          </div>
        </div>

        {error ? (
          <div className="glass-panel rounded-[2rem] p-6">
            <StatusMessage tone="error" title="Falha ao carregar dados" description={error} />
          </div>
        ) : null}

        {/* Stats Cards */}
        {selectedRestaurantId && tables.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e9dccb] p-4">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Disponíveis</span>
              </div>
              <p className="text-2xl font-bold text-[#26170f]">{stats.disponiveis}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e9dccb] p-4">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Ocupadas</span>
              </div>
              <p className="text-2xl font-bold text-[#26170f]">{stats.ocupadas}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e9dccb] p-4">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Wrench className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Manutenção</span>
              </div>
              <p className="text-2xl font-bold text-[#26170f]">{stats.manutencao}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e9dccb] p-4">
              <div className="flex items-center gap-2 text-[#8b5e34] mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Capacidade</span>
              </div>
              <p className="text-2xl font-bold text-[#26170f]">{stats.capacidadeTotal}</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Sidebar - Lista de Mesas */}
          <Card className="border-[#e9dccb] bg-white/80 backdrop-blur-sm p-6 shadow-[0_14px_40px_rgba(78,50,28,0.08)] rounded-[2rem]">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#8b5e34]" />
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e34] font-medium">Restaurante ativo</p>
                </div>
                <select
                  value={selectedRestaurantId}
                  onChange={(event) => setSelectedRestaurantId(event.target.value)}
                  className="mt-3 w-full rounded-2xl border-2 border-[#e9dccb] bg-white px-5 py-3.5 text-sm text-[#26170f] font-medium focus:outline-none focus:ring-2 focus:ring-[#8b5e34]/20 focus:border-[#8b5e34] transition-all duration-300 cursor-pointer hover:border-[#8b5e34]/50"
                >
                  <option value="">Selecione um restaurante</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Table2 className="w-4 h-4 text-[#8b5e34]" />
                    <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e34] font-medium">Mesas cadastradas</p>
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-[#26170f]">
                    {tables.length} {tables.length === 1 ? 'mesa' : 'mesas'}
                  </h2>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedTableId('new')}
                  disabled={!selectedRestaurantId}
                  className="rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] hover:border-[#8b5e34] transition-all duration-300 group"
                >
                  <Plus className="w-4 h-4 mr-1 group-hover:rotate-90 transition-transform duration-300" />
                  Nova
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {tables.map((table) => {
                const status = statusConfig[table.status as keyof typeof statusConfig] || statusConfig.DISPONIVEL;
                const StatusIcon = status.icon;

                return (
                  <button
                    key={table.id}
                    type="button"
                    onClick={() => setSelectedTableId(table.id)}
                    className={`group w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
                      selectedTableId === table.id
                        ? 'border-[#8b5e34] bg-gradient-to-r from-[#fff7ed] to-[#fef9f0] shadow-md shadow-[#8b5e34]/10'
                        : 'border-[#ead9c0] bg-white hover:border-[#8b5e34]/50 hover:shadow-sm hover:bg-[#fef9f0]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Table2 className="w-4 h-4 text-[#8b5e34]" />
                        <p className="font-semibold text-[#26170f] group-hover:text-[#8b5e34] transition-colors">
                          Mesa {table.numero}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border ${status.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-[#7a604c]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {table.capacidade} {table.capacidade === 1 ? 'lugar' : 'lugares'}
                      </span>
                      {table.localizacao && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {table.localizacao}
                        </span>
                      )}
                    </div>

                    {!table.ativo && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        Mesa inativa
                      </div>
                    )}

                    {selectedTableId === table.id && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-[#8b5e34]">
                        <Edit className="w-3 h-3" />
                        Editando
                      </div>
                    )}
                  </button>
                );
              })}

              {tables.length === 0 && selectedRestaurantId && (
                <div className="rounded-2xl border-2 border-dashed border-[#e9dccb] bg-[#fef9f0] p-6 text-center">
                  <Table2 className="w-10 h-10 text-[#8b5e34]/30 mx-auto mb-3" />
                  <p className="text-sm leading-6 text-[#6b5342]">
                    Ainda não há mesas cadastradas para esse restaurante.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-3 rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] text-sm"
                    onClick={() => setSelectedTableId('new')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Cadastrar primeira mesa
                  </Button>
                </div>
              )}

              {!selectedRestaurantId && (
                <div className="rounded-2xl border-2 border-dashed border-[#e9dccb] bg-[#fef9f0] p-6 text-center">
                  <Building2 className="w-10 h-10 text-[#8b5e34]/30 mx-auto mb-3" />
                  <p className="text-sm leading-6 text-[#6b5342]">
                    Selecione um restaurante para gerenciar as mesas.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Formulário */}
          <Card className="border-[#e9dccb] bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-[0_14px_40px_rgba(78,50,28,0.08)] rounded-[2rem]">
            <div className="flex flex-col gap-3 border-b border-[#f0e3d0] pb-6">
              <div className="flex items-center gap-2">
                {selectedTable ? (
                  <Edit className="w-4 h-4 text-[#8b5e34]" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#f0d1a2] animate-pulse" />
                )}
                <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e34] font-medium">
                  {selectedTable ? 'Edição' : 'Cadastro operacional'}
                </p>
              </div>
              <h2 className="text-3xl font-semibold text-[#26170f]">
                {selectedTable ? `Editar mesa ${selectedTable.numero}` : 'Cadastrar nova mesa'}
              </h2>
              <p className="text-sm leading-7 text-[#5d4738]">
                Controle numeração, capacidade, localização e status de atendimento para o salão.
              </p>
            </div>

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <Field 
                  label="Número da mesa" 
                  icon={<Table2 className="w-4 h-4" />}
                  required
                >
                  <input 
                    className="owner-input-premium" 
                    value={form.numero} 
                    onChange={(e) => handleChange('numero', e.target.value)} 
                    placeholder="Ex: 1, 2, 3..."
                    required 
                  />
                </Field>
                
                <Field 
                  label="Capacidade" 
                  icon={<Users className="w-4 h-4" />}
                  required
                >
                  <input 
                    className="owner-input-premium" 
                    type="number" 
                    min={1} 
                    value={form.capacidade} 
                    onChange={(e) => handleChange('capacidade', Number(e.target.value))} 
                    placeholder="Número de lugares"
                    required 
                  />
                </Field>
                
                <Field 
                  label="Localização" 
                  icon={<MapPin className="w-4 h-4" />}
                  className="md:col-span-2"
                >
                  <input 
                    className="owner-input-premium" 
                    value={form.localizacao || ''} 
                    onChange={(e) => handleChange('localizacao', e.target.value)} 
                    placeholder="Ex: Área externa, Salão principal, Balcão..."
                  />
                </Field>
                
                <Field 
                  label="Status" 
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  className="md:col-span-2"
                >
                  <select 
                    className="owner-input-premium" 
                    value={form.status} 
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="DISPONIVEL">🟢 Disponível</option>
                    <option value="OCUPADA">🔴 Ocupada</option>
                    <option value="MANUTENCAO">🟡 Em Manutenção</option>
                  </select>
                </Field>
              </div>

              <div className="p-4 rounded-2xl border border-[#e9dccb] bg-[#fef9f0]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={Boolean(form.ativo)} 
                    onChange={(e) => handleChange('ativo', e.target.checked)}
                    className="w-5 h-5 rounded-lg border-2 border-[#d4b896] text-[#8b5e34] focus:ring-[#8b5e34] focus:ring-offset-0 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#3f2b1d]">Mesa ativa para reservas</p>
                    <p className="text-xs text-[#8b5e34] mt-0.5">
                      Quando ativa, a mesa aparece disponível para os clientes fazerem reservas.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#f0e3d0] pt-6 sm:flex-row sm:justify-between">
                {selectedTable ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => void handleDelete(selectedTable.id)}
                    className="rounded-xl border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300 group"
                  >
                    <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Excluir mesa
                  </Button>
                ) : (
                  <span />
                )}
                
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setSelectedTableId('new');
                      setForm(emptyTableForm);
                    }}
                    className="rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] hover:border-[#8b5e34] transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Limpar formulário
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={saving || !selectedRestaurantId}
                    className="rounded-xl bg-gradient-to-r from-[#8b5e34] to-[#6b3a2a] text-white shadow-lg shadow-[#8b5e34]/20 hover:shadow-xl hover:shadow-[#8b5e34]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        {selectedTable ? 'Salvar alterações' : 'Cadastrar mesa'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Estilos para os inputs premium */}
      <style>{`
        .owner-input-premium {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e9dccb;
          border-radius: 1rem;
          background: white;
          color: #26170f;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
          outline: none;
        }
        
        .owner-input-premium:hover {
          border-color: #d4b896;
        }
        
        .owner-input-premium:focus {
          border-color: #8b5e34;
          box-shadow: 0 0 0 3px rgba(139, 94, 52, 0.1);
        }
        
        .owner-input-premium::placeholder {
          color: #b8a088;
          font-size: 0.875rem;
        }
        
        select.owner-input-premium {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b5e34' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }
      `}</style>
    </section>
  );
}

function Field({ 
  children, 
  label, 
  icon, 
  required = false,
  className = ''
}: { 
  children: React.ReactNode; 
  label: string; 
  icon?: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="flex items-center gap-2 text-sm font-medium text-[#3f2b1d]">
        {icon && <span className="text-[#8b5e34]">{icon}</span>}
        {label}
        {required && <span className="text-red-400">*</span>}
      </span>
      {children}
    </label>
  );
}