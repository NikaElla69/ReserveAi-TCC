/**
 * Validation schemas using Zod for forms across the application.
 * The field names mirror the backend contract to avoid translation layers in the UI.
 */

import { z } from 'zod';

// ============================================================================
// Authentication Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória')
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(120, 'Nome não pode ter mais de 120 caracteres'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  cpf: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido'),
  senha: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
  confirmarSenha: z.string().min(1, 'Confirmação de senha é obrigatória'),
  papel: z.enum(['CUSTOMER', 'OWNER', 'ADMIN'] as const).default('CUSTOMER')
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha']
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================================================
// User Profile Schemas
// ============================================================================

export const profileEditSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(120, 'Nome não pode ter mais de 120 caracteres'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  cpf: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido').optional(),
  telefone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Telefone inválido').optional().or(z.literal(''))
});

export type ProfileEditFormData = z.infer<typeof profileEditSchema>;

export const passwordChangeSchema = z.object({
  senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
  novaSenha: z.string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
  confirmarSenha: z.string().min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha']
}).refine((data) => data.senhaAtual !== data.novaSenha, {
  message: 'Nova senha deve ser diferente da senha atual',
  path: ['novaSenha']
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// ============================================================================
// Restaurant Schemas
// ============================================================================

export const restaurantSchema = z.object({
  nome: z.string().min(2, 'Nome do restaurante é obrigatório').max(150, 'Nome não pode ter mais de 150 caracteres'),
  descricao: z.string().max(1000, 'Descrição não pode ter mais de 1000 caracteres').optional().or(z.literal('')),
  tipoCulinaria: z.string().max(80, 'Tipo de culinária não pode ter mais de 80 caracteres').optional().or(z.literal('')),
  telefone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Telefone inválido').optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  cidade: z.string().max(100, 'Cidade não pode ter mais de 100 caracteres').optional().or(z.literal('')),
  endereco: z.string().max(255, 'Endereço não pode ter mais de 255 caracteres').optional().or(z.literal('')),
  logoUrl: z.string().url('URL do logo inválida').optional().or(z.literal('')),
  bannerPrincipal: z.string().url('URL do banner inválida').optional().or(z.literal('')),
  politicaReservas: z.string().max(1000, 'Política de reservas não pode ter mais de 1000 caracteres').optional().or(z.literal('')),
  capacidade: z.number().min(1, 'Capacidade deve ser pelo menos 1').optional(),
  slug: z.string().max(120, 'Slug não pode ter mais de 120 caracteres').optional().or(z.literal('')),
  dominioPersonalizado: z.string().max(255, 'Domínio não pode ter mais de 255 caracteres').optional().or(z.literal(''))
});

export type RestaurantFormData = z.infer<typeof restaurantSchema>;

// ============================================================================
// Table Schemas
// ============================================================================

export const tableSchema = z.object({
  restauranteId: z.string().min(1, 'Restaurante é obrigatório'),
  numero: z.string().min(1, 'Número da mesa é obrigatório').max(20, 'Número da mesa não pode ter mais de 20 caracteres'),
  capacidade: z.number().min(1, 'Capacidade deve ser pelo menos 1').max(20, 'Capacidade não pode ser maior que 20'),
  localizacao: z.string().max(80, 'Localização não pode ter mais de 80 caracteres').optional().or(z.literal('')),
  ativo: z.boolean().default(true)
});

export type TableFormData = z.infer<typeof tableSchema>;

// ============================================================================
// Reservation Schemas
// ============================================================================

export const reservationSchema = z.object({
  restauranteId: z.string().min(1, 'Restaurante é obrigatório'),
  mesaId: z.string().min(1, 'Mesa é obrigatória'),
  dataReserva: z.string().min(1, 'Data é obrigatória').refine((date) => {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, 'Data não pode ser no passado'),
  horarioReserva: z.string().regex(/^\d{2}:\d{2}$/, 'Formato deve ser HH:MM'),
  quantidadePessoas: z.number().min(1, 'Número de convidados deve ser pelo menos 1').max(20, 'Número de convidados não pode ser maior que 20'),
  observacoes: z.string().max(500, 'Observações não podem ter mais de 500 caracteres').optional().or(z.literal(''))
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

export const updateReservationSchema = z.object({
  mesaId: z.string().min(1, 'Mesa é obrigatória').optional(),
  dataReserva: z.string().min(1, 'Data é obrigatória').refine((date) => {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, 'Data não pode ser no passado').optional(),
  horarioReserva: z.string().regex(/^\d{2}:\d{2}$/, 'Formato deve ser HH:MM').optional(),
  quantidadePessoas: z.number().min(1, 'Número de convidados deve ser pelo menos 1').max(20, 'Número de convidados não pode ser maior que 20').optional(),
  observacoes: z.string().max(500, 'Observações não podem ter mais de 500 caracteres').optional().or(z.literal(''))
});

export type UpdateReservationFormData = z.infer<typeof updateReservationSchema>;

export const updateReservationStatusSchema = z.object({
  status: z.enum(['CONFIRMADA', 'REJEITADA', 'CANCELADA', 'CONCLUIDA'] as const),
  justificativa: z.string().min(1, 'Motivo é obrigatório').max(500, 'Motivo não pode ter mais de 500 caracteres').optional()
}).refine((data) => {
  if (data.status === 'REJEITADA') {
    return data.justificativa && data.justificativa.length > 0;
  }
  return true;
}, {
  message: 'Motivo é obrigatório quando a reserva é rejeitada',
  path: ['justificativa']
});

export type UpdateReservationStatusFormData = z.infer<typeof updateReservationStatusSchema>;

// ============================================================================
// Search & Filter Schemas
// ============================================================================

export const restaurantSearchSchema = z.object({
  termo: z.string().max(100, 'Busca não pode ter mais de 100 caracteres').optional().or(z.literal('')),
  tipoCulinaria: z.string().optional().or(z.literal('')),
  cidade: z.string().optional().or(z.literal('')),
  ordenarPor: z.enum(['nome', 'recentes'] as const).default('nome')
});

export type RestaurantSearchFormData = z.infer<typeof restaurantSearchSchema>;

export const availabilitySearchSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória').refine((date) => {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, 'Data não pode ser no passado'),
  horario: z.string().regex(/^\d{2}:\d{2}$/, 'Formato deve ser HH:MM'),
  quantidadePessoas: z.number().min(1, 'Número de convidados deve ser pelo menos 1').max(20, 'Número de convidados não pode ser maior que 20').default(1)
});

export type AvailabilitySearchFormData = z.infer<typeof availabilitySearchSchema>;

// ============================================================================
// Admin Schemas
// ============================================================================

export const userRoleUpdateSchema = z.object({
  papel: z.enum(['CUSTOMER', 'OWNER', 'ADMIN'] as const)
});

export type UserRoleUpdateFormData = z.infer<typeof userRoleUpdateSchema>;
