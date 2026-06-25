/**
 * Design philosophy for domain types: keep restaurant discovery welcoming while the data contracts mirror the backend faithfully.
 */
export type UserRole = 'CUSTOMER' | 'OWNER' | 'ADMIN';
export type ReservationStatus = 'PENDENTE' | 'CONFIRMADA' | 'REJEITADA' | 'CANCELADA' | 'CONCLUIDA' | 'NO_SHOW';

export interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string | null;
  papel: UserRole;
  ativo?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface Restaurant {
  id: string;
  proprietarioId?: string;
  nome: string;
  slug?: string;
  descricao?: string | null;
  tipoCulinaria?: string | null;
  telefone?: string | null;
  email?: string | null;
  cidade?: string | null;
  endereco?: string | null;
  logoUrl?: string | null;
  bannerPrincipal?: string | null;
  politicaReservas?: string | null;
  capacidade?: number;
  horarioFuncionamento?: unknown;
  dominioPersonalizado?: string | null;
  ativo?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface RestaurantInput {
  nome: string;
  descricao?: string;
  tipoCulinaria?: string;
  telefone?: string;
  email?: string;
  cidade?: string;
  estado?: string;
  endereco?: string;
  logoUrl?: string;
  bannerPrincipal?: string;
  politicaReservas?: string;
  capacidade?: number;
  horarioFuncionamento?: unknown;
  slug?: string;
  dominioPersonalizado?: string;
}

export interface TableEntity {
  id: string;
  restauranteId: string;
  numero: string;
  capacidade: number;
  localizacao?: string | null;
  status?: string;
  ativo?: boolean;
  criadoEm?: string;
}

export interface TableInput {
  restauranteId: string;
  numero: string;
  capacidade: number;
  localizacao?: string;
  status?: string;
  ativo?: boolean;
}

export interface Reservation {
  id: string;
  usuarioId: string;
  restauranteId: string;
  mesaId: string;
  dataReserva: string;
  horarioReserva: string;
  quantidadePessoas: number;
  status: ReservationStatus;
  observacoes?: string | null;
  justificativa?: string | null;
  criadoEm?: string;
  atualizadoEm?: string;
  usuario?: Pick<User, 'id' | 'nome' | 'email' | 'papel'>;
  restaurante?: Pick<Restaurant, 'id' | 'nome' | 'slug'>;
  mesa?: Pick<TableEntity, 'id' | 'numero' | 'capacidade'>;
}

export interface ReservationInput {
  restauranteId: string;
  mesaId: string;
  dataReserva: string;
  horarioReserva: string;
  quantidadePessoas: number;
  observacoes?: string;
}

export interface UpdateReservationInput {
  mesaId?: string;
  dataReserva?: string;
  horarioReserva?: string;
  quantidadePessoas?: number;
  observacoes?: string;
}

export interface UpdateReservationStatusInput {
  status: ReservationStatus;
  justificativa?: string;
}

export interface LoginInput {
  email: string;
  senha: string;
}

export interface RegisterInput {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  papel?: UserRole;
}

/**
 * Backend retorna exatamente isso:
 * {
 *   accessToken,
 *   refreshToken,
 *   user
 * }
 */
export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RestaurantAvailabilityResponse {
  restaurante: Restaurant;
  mesasDisponiveis: TableEntity[];
  data: string;
  horario: string;
  quantidadePessoas: number;
}