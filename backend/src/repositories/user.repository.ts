import { Prisma, User, UserRole } from '@prisma/client';
import prisma from '../lib/prisma';

export interface CreateUserRepositoryInput {
  tenantId?: string | null;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string | null;
  senhaHash: string;
  papel?: UserRole;
}

export interface UpdateUserRepositoryInput {
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string | null;
  senhaHash?: string;
  papel?: UserRole;
  ativo?: boolean;
  emailVerificado?: boolean;
  ultimoLogin?: Date | null;
}

export class UserRepository {
  async create(data: CreateUserRepositoryInput): Promise<User> {
    return prisma.user.create({
      data: {
        tenantId: data.tenantId,
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        telefone: data.telefone,
        senhaHash: data.senhaHash,
        papel: data.papel ?? UserRole.CUSTOMER,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { cpf },
    });
  }

  async list(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateUserRepositoryInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async getReservationHistory(userId: string) {
    return prisma.reservation.findMany({
      where: { usuarioId: userId },
      include: {
        restaurante: true,
        mesa: true,
      },
      orderBy: [{ dataReserva: 'desc' }, { horarioReserva: 'desc' }],
    });
  }

  async findOwnerRestaurants(userId: string) {
    return prisma.restaurant.findMany({
      where: { proprietarioId: userId },
      include: {
        configuracoes: true,
      },
    });
  }

  async existsByEmailOrCpf(email: string, cpf: string, ignoreId?: string): Promise<boolean> {
    const conditions: Prisma.UserWhereInput[] = [{ email }, { cpf }];

    const user = await prisma.user.findFirst({
      where: {
        OR: conditions,
        ...(ignoreId ? { id: { not: ignoreId } } : {}),
      },
      select: { id: true },
    });

    return Boolean(user);
  }
}

export const userRepository = new UserRepository();
