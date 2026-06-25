import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import prisma from '../lib/prisma';
import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils/app-error';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token';
import { env } from '../config/env';

export interface RegisterInput {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  senha: string;
  papel?: UserRole;
  tenantId?: string | null;
}

export interface LoginInput {
  email: string;
  senha: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await userRepository.existsByEmailOrCpf(input.email, input.cpf);

    if (existing) {
      throw new AppError('Já existe um usuário cadastrado com este e-mail ou CPF.', 409);
    }

    const senhaHash = await bcrypt.hash(input.senha, env.bcryptSaltRounds);

    if ((input.papel ?? UserRole.CUSTOMER) === UserRole.OWNER) {

      const tenant = await prisma.tenant.create({
          data: {
            nome: `${input.nome} Tenant`,
            subdominio: input.email.split('@')[0]
          }
        });

        input.tenantId = tenant.id;
    }
    const user = await userRepository.create({
      tenantId: input.tenantId,
      nome: input.nome,
      email: input.email,
      cpf: input.cpf,
      telefone: input.telefone,
      senhaHash,
      papel: input.papel ?? UserRole.CUSTOMER,
    });

    return this.buildSession(user.id, user.email, user.papel, user.tenantId);
  }

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user || !user.ativo) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    const senhaValida = await bcrypt.compare(input.senha, user.senhaHash);

    if (!senhaValida) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    await userRepository.update(user.id, { ultimoLogin: new Date() });
    const session = await this.buildSession(user.id, user.email, user.papel, user.tenantId, input.ipAddress, input.userAgent);

    await prisma.auditLog.create({
      data: {
        usuarioId: user.id,
        acao: 'LOGIN',
        tipoEntidade: 'users',
        idEntidade: user.id,
        enderecoIp: input.ipAddress,
        userAgent: input.userAgent,
      },
    });

    return session;
  }

  async me(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return user;
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { id: payload.tokenId },
      include: { usuario: true },
    });

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      throw new AppError('Refresh token inválido ou expirado.', 401);
    }

    return this.buildSession(tokenRecord.usuario.id, tokenRecord.usuario.email, tokenRecord.usuario.papel, tokenRecord.usuario.tenantId);
  }

  async logout(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    await prisma.refreshToken.update({
      where: { id: payload.tokenId },
      data: { revokedAt: new Date() },
    });

    return { success: true };
  }

  private async buildSession(
    userId: string,
    email: string,
    papel: UserRole,
    tenantId?: string | null,
    ipAddress?: string,
    userAgent?: string
  ) {
    const refreshTokenId = crypto.randomUUID();

    const accessToken = signAccessToken({
      sub: userId,
      email,
      papel,
      tenantId,
    });

    const refreshToken = signRefreshToken({
      sub: userId,
      tokenId: refreshTokenId,
    });

    await prisma.refreshToken.create({
      data: {
        id: refreshTokenId,
        usuarioId: userId,
        token: refreshToken,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + env.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000),
      },
    });

    const user = await userRepository.findById(userId);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}

export const authService = new AuthService();
