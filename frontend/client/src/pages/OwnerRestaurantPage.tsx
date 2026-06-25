/**
 * Design philosophy for owner restaurant management: make editing the restaurant feel calm, structured and readable instead of overly technical.
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { restaurantService } from '@/services/restaurant.service';
import type { Restaurant, RestaurantInput } from '@/types/api';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  UtensilsCrossed,
  FileText,
  Globe,
  Sparkles,
  Plus,
  Save,
  ArrowLeft,
  Store,
  Edit,
  AlertCircle
} from 'lucide-react';

const emptyForm: RestaurantInput = {
  nome: '',
  descricao: '',
  tipoCulinaria: '',
  telefone: '',
  email: '',
  cidade: '',
  estado: '',
  endereco: '',
  capacidade: 20,
  politicaReservas: '',
  slug: '',
};

export function OwnerRestaurantPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedId, setSelectedId] = useState<string>('new');
  const [form, setForm] = useState<RestaurantInput>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.papel !== 'OWNER') {
      navigate('/');
      return;
    }

    void loadRestaurants();
  }, [navigate, user?.papel]);

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === selectedId) ?? null,
    [restaurants, selectedId]
  );

  useEffect(() => {
    if (selectedRestaurant) {
      setForm({
        nome: selectedRestaurant.nome,
        descricao: selectedRestaurant.descricao ?? '',
        tipoCulinaria: selectedRestaurant.tipoCulinaria ?? '',
        telefone: selectedRestaurant.telefone ?? '',
        email: selectedRestaurant.email ?? '',
        cidade: selectedRestaurant.cidade ?? '',
        estado: selectedRestaurant.estado ?? '',
        endereco: selectedRestaurant.endereco ?? '',
        capacidade: selectedRestaurant.capacidade ?? 20,
        politicaReservas: selectedRestaurant.politicaReservas ?? '',
        slug: selectedRestaurant.slug ?? '',
      });
      return;
    }

    setForm(emptyForm);
  }, [selectedRestaurant]);

  async function loadRestaurants() {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantService.listMine();
      setRestaurants(data);
      setSelectedId((current) => (current === 'new' ? (data[0]?.id ?? 'new') : current));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar seus restaurantes.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);

      if (selectedRestaurant) {
        await restaurantService.update(selectedRestaurant.id, form);
        toast.success('🎉 Restaurante atualizado com sucesso!');
      } else {
        const created = await restaurantService.create(form);
        toast.success('✨ Restaurante criado com sucesso!');
        setSelectedId(created.id);
      }

      await loadRestaurants();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível salvar o restaurante.');
    } finally {
      setSaving(false);
    }
  }

  function handleChange<K extends keyof RestaurantInput>(field: K, value: RestaurantInput[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5ede0] to-[#faf7f2]">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <div className="h-10 w-72 bg-gradient-to-r from-[#e8d5c0] to-[#d4c4af] rounded-xl animate-pulse" />
            <div className="h-5 w-48 bg-[#e8d5c0]/50 rounded-lg mt-2 animate-pulse" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
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
                <Store className="w-6 h-6 text-[#1a0f0a]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#e9c791] font-medium">Gestão do proprietário</p>
                <h1 className="mt-1 font-display text-4xl text-white">Cadastre e atualize o perfil do seu restaurante</h1>
              </div>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-white/72">
              Organize os dados principais do seu negócio, mantenha a identidade do restaurante atualizada e prepare a vitrine que será exibida aos clientes.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-white/50">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {restaurants.length} {restaurants.length === 1 ? 'restaurante cadastrado' : 'restaurantes cadastrados'}
            </div>
          </div>
        </div>

        {error ? (
          <div className="glass-panel rounded-[2rem] p-6">
            <StatusMessage tone="error" title="Falha ao carregar restaurantes" description={error} />
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Sidebar - Lista de Restaurantes */}
          <Card className="border-[#e9dccb] bg-white/80 backdrop-blur-sm p-6 shadow-[0_14px_40px_rgba(78,50,28,0.08)] rounded-[2rem]">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#8b5e34]" />
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e34] font-medium">Seus espaços</p>
                </div>
                <h2 className="mt-2 text-xl font-semibold text-[#26170f]">Restaurantes</h2>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSelectedId('new')}
                className="rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] hover:border-[#8b5e34] transition-all duration-300 group"
              >
                <Plus className="w-4 h-4 mr-1 group-hover:rotate-90 transition-transform duration-300" />
                Novo
              </Button>
            </div>

            <div className="space-y-3">
              {restaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  type="button"
                  onClick={() => setSelectedId(restaurant.id)}
                  className={`group w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
                    selectedId === restaurant.id
                      ? 'border-[#8b5e34] bg-gradient-to-r from-[#fff7ed] to-[#fef9f0] shadow-md shadow-[#8b5e34]/10'
                      : 'border-[#ead9c0] bg-white hover:border-[#8b5e34]/50 hover:shadow-sm hover:bg-[#fef9f0]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#26170f] truncate group-hover:text-[#8b5e34] transition-colors">
                        {restaurant.nome}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5 text-sm text-[#7a604c]">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{restaurant.cidade || 'Cidade não informada'}</span>
                      </div>
                    </div>
                    {selectedId === restaurant.id && (
                      <Edit className="w-4 h-4 text-[#8b5e34] flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}

              {restaurants.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-[#e9dccb] bg-[#fef9f0] p-6 text-center">
                  <Store className="w-10 h-10 text-[#8b5e34]/30 mx-auto mb-3" />
                  <p className="text-sm leading-6 text-[#6b5342]">
                    Nenhum restaurante cadastrado ainda.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-3 rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] text-sm"
                    onClick={() => setSelectedId('new')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Criar primeiro restaurante
                  </Button>
                </div>
              ) : null}
            </div>
          </Card>

          {/* Formulário */}
          <Card className="border-[#e9dccb] bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-[0_14px_40px_rgba(78,50,28,0.08)] rounded-[2rem]">
            <div className="flex flex-col gap-3 border-b border-[#f0e3d0] pb-6">
              <div className="flex items-center gap-2">
                {selectedRestaurant ? (
                  <Edit className="w-4 h-4 text-[#8b5e34]" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#f0d1a2] animate-pulse" />
                )}
                <p className="text-xs uppercase tracking-[0.24em] text-[#8b5e34] font-medium">
                  {selectedRestaurant ? 'Edição' : 'Novo cadastro'}
                </p>
              </div>
              <h2 className="text-3xl font-semibold text-[#26170f]">
                {selectedRestaurant ? selectedRestaurant.nome : 'Novo restaurante'}
              </h2>
              <p className="text-sm leading-7 text-[#5d4738]">
                Preencha os dados principais usados na página pública e no painel de gestão.
              </p>
            </div>

            <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Store className="w-5 h-5 text-[#8b5e34]" />
                  <h3 className="text-lg font-semibold text-[#26170f]">Informações Básicas</h3>
                </div>
                
                <div className="grid gap-5 md:grid-cols-2">
                  <Field 
                    label="Nome do restaurante" 
                    icon={<UtensilsCrossed className="w-4 h-4" />}
                    required
                  >
                    <input 
                      className="owner-input-premium" 
                      value={form.nome} 
                      onChange={(e) => handleChange('nome', e.target.value)} 
                      placeholder="Ex: Cantina Italiana"
                      required 
                    />
                  </Field>
                  
                  <Field 
                    label="Slug da página" 
                    icon={<Globe className="w-4 h-4" />}
                  >
                    <input 
                      className="owner-input-premium" 
                      value={form.slug || ''} 
                      onChange={(e) => handleChange('slug', e.target.value)} 
                      placeholder="meu-restaurante" 
                    />
                  </Field>
                  
                  <Field 
                    label="Tipo de culinária" 
                    icon={<UtensilsCrossed className="w-4 h-4" />}
                  >
                    <input 
                      className="owner-input-premium" 
                      value={form.tipoCulinaria || ''} 
                      onChange={(e) => handleChange('tipoCulinaria', e.target.value)} 
                      placeholder="Ex: Italiana, Japonesa..."
                    />
                  </Field>
                  
                  <Field 
                    label="Capacidade total" 
                    icon={<Users className="w-4 h-4" />}
                  >
                    <input 
                      className="owner-input-premium" 
                      type="number" 
                      min={1} 
                      value={form.capacidade ?? 20} 
                      onChange={(e) => handleChange('capacidade', Number(e.target.value))} 
                    />
                  </Field>
                </div>
              </div>

              {/* Contato */}
              <div className="space-y-4 pt-6 border-t border-[#f0e3d0]">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="w-5 h-5 text-[#8b5e34]" />
                  <h3 className="text-lg font-semibold text-[#26170f]">Contato</h3>
                </div>
                
                <div className="grid gap-5 md:grid-cols-2">
                  <Field 
                    label="Telefone" 
                    icon={<Phone className="w-4 h-4" />}
                  >
                    <input 
                      className="owner-input-premium" 
                      value={form.telefone || ''} 
                      onChange={(e) => handleChange('telefone', e.target.value)} 
                      placeholder="(11) 99999-9999"
                    />
                  </Field>
                  
                  <Field 
                    label="Email" 
                    icon={<Mail className="w-4 h-4" />}
                  >
                    <input 
                      className="owner-input-premium" 
                      type="email" 
                      value={form.email || ''} 
                      onChange={(e) => handleChange('email', e.target.value)} 
                      placeholder="contato@restaurante.com"
                    />
                  </Field>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4 pt-6 border-t border-[#f0e3d0]">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#8b5e34]" />
                  <h3 className="text-lg font-semibold text-[#26170f]">Endereço</h3>
                </div>
                
                <div className="grid gap-5 md:grid-cols-2">
                  <Field 
                    label="Cidade" 
                    icon={<MapPin className="w-4 h-4" />}
                  >
                    <input 
                      className="owner-input-premium" 
                      value={form.cidade || ''} 
                      onChange={(e) => handleChange('cidade', e.target.value)} 
                      placeholder="São Paulo"
                    />
                  </Field>
                  
                  <Field 
                    label="Estado" 
                    icon={<MapPin className="w-4 h-4" />}
                  >
                    <input 
                      className="owner-input-premium" 
                      value={form.estado || ''} 
                      onChange={(e) => handleChange('estado', e.target.value)} 
                      placeholder="SP"
                    />
                  </Field>
                  
                  <Field 
                    label="Endereço completo" 
                    icon={<MapPin className="w-4 h-4" />}
                    className="md:col-span-2"
                  >
                    <input 
                      className="owner-input-premium" 
                      value={form.endereco || ''} 
                      onChange={(e) => handleChange('endereco', e.target.value)} 
                      placeholder="Rua Exemplo, 123 - Bairro"
                    />
                  </Field>
                </div>
              </div>

              {/* Descrições */}
              <div className="space-y-4 pt-6 border-t border-[#f0e3d0]">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#8b5e34]" />
                  <h3 className="text-lg font-semibold text-[#26170f]">Descrições</h3>
                </div>
                
                <Field 
                  label="Descrição do restaurante" 
                  icon={<FileText className="w-4 h-4" />}
                >
                  <textarea 
                    className="owner-input-premium min-h-[140px] resize-y" 
                    value={form.descricao || ''} 
                    onChange={(e) => handleChange('descricao', e.target.value)} 
                    placeholder="Descreva seu restaurante, ambiente, especialidades..."
                  />
                </Field>

                <Field 
                  label="Política de reservas" 
                  icon={<AlertCircle className="w-4 h-4" />}
                >
                  <textarea 
                    className="owner-input-premium min-h-[120px] resize-y" 
                    value={form.politicaReservas || ''} 
                    onChange={(e) => handleChange('politicaReservas', e.target.value)} 
                    placeholder="Ex: Cancelamento com até 2h de antecedência, tolerância de 15 minutos..."
                  />
                </Field>
              </div>

              {/* Ações */}
              <div className="flex flex-col gap-3 border-t border-[#f0e3d0] pt-6 sm:flex-row sm:justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedId('new')}
                  className="rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] hover:border-[#8b5e34] transition-all duration-300 group"
                >
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Cadastrar novo restaurante
                </Button>
                
                <div className="flex gap-3">
                  {selectedRestaurant && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/owner/dashboard')}
                      className="rounded-xl border-[#e9dccb] hover:bg-[#f8f0e2] transition-all duration-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={saving}
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
                        {selectedRestaurant ? 'Salvar alterações' : 'Criar restaurante'}
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
        
        .owner-input-premium[type="number"] {
          -moz-appearance: textfield;
        }
        
        .owner-input-premium[type="number"]::-webkit-outer-spin-button,
        .owner-input-premium[type="number"]::-webkit-inner-spin-button {
          opacity: 1;
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