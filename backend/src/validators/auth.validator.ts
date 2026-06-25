import { z } from 'zod';

export const registerSchema = z.object({
  nome: z.string().min(3).max(100),
  email: z.string().email().max(150),
  cpf: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$/),
  telefone: z.string().min(10).max(20).optional(),
  senha: z.string().min(8).max(64),
  papel: z.enum(['CUSTOMER', 'OWNER', 'ADMIN']).optional(),
  tenantId: z.string().uuid().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(8).max(64),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10),
});

export const resetPasswordSchema = z.object({
  senhaAtual: z.string().min(8).max(64),
  novaSenha: z.string().min(8).max(64),
});
