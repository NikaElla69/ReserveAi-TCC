/// <reference types="jest" />
import { describe, it, expect } from '@jest/globals';
import { loginSchema, refreshTokenSchema, registerSchema } from '../../validators/auth.validator';

describe('auth validators', () => {
  it('deve validar um payload de cadastro válido', () => {
    const parsed = registerSchema.parse({
      nome: 'João da Silva',
      email: 'joao@reserveai.com',
      cpf: '123.456.789-00',
      telefone: '11999999999',
      senha: 'SenhaForte123',
      papel: 'CUSTOMER',
    });

    expect(parsed.email).toBe('joao@reserveai.com');
    expect(parsed.nome).toBe('João da Silva');
  });

  it('deve rejeitar payload de login inválido', () => {
    expect(() => loginSchema.parse({ email: 'invalido', senha: '123' })).toThrow();
  });

  it('deve validar refresh token', () => {
    const parsed = refreshTokenSchema.parse({ refreshToken: 'token-refresh-valido' });
    expect(parsed.refreshToken).toBe('token-refresh-valido');
  });
});
