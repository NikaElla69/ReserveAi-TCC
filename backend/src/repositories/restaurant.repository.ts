import { Prisma, Restaurant } from '@prisma/client';
import prisma from '../lib/prisma';

export interface CreateRestaurantRepositoryInput {
  tenantId: string;
  proprietarioId: string;
  nome: string;
  descricao?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco: string;
  cidade: string;
  estado: string;
  cep?: string | null;
  logo?: string | null;
  bannerPrincipal?: string | null;
  capacidade: number;
  horarioFuncionamento: Prisma.InputJsonValue;
  politicaReservas?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  slug: string;
  dominioPersonalizado?: string | null;
}

export interface UpdateRestaurantRepositoryInput {
  nome?: string;
  descricao?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string | null;
  logo?: string | null;
  bannerPrincipal?: string | null;
  capacidade?: number;
  horarioFuncionamento?: Prisma.InputJsonValue;
  politicaReservas?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  slug?: string;
  dominioPersonalizado?: string | null;
  ativo?: boolean;
}

export class RestaurantRepository {
  async create(data: CreateRestaurantRepositoryInput): Promise<Restaurant> {
    return prisma.restaurant.create({
      data: data as Prisma.RestaurantUncheckedCreateInput,
    });
  }

  async listPublic(filters?: { cidade?: string; termo?: string }) {
    return prisma.restaurant.findMany({
      where: {
        ativo: true,
        ...(filters?.cidade ? { cidade: { contains: filters.cidade } } : {}),
        ...(filters?.termo
          ? {
              OR: [
                { nome: { contains: filters.termo } },
                { descricao: { contains: filters.termo } },
                { cidade: { contains: filters.termo } },
              ],
            }
          : {}),
      },
      include: {
        configuracoes: true,
        imagens: {
          orderBy: { displayOrder: 'asc' },
          take: 5,
        },
        reviews: {
          select: { nota: true },
        },
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.restaurant.findUnique({
      where: { id },
      include: {
        mesas: true,
        configuracoes: true,
        imagens: { orderBy: { displayOrder: 'asc' } },
        reviews: {
          include: {
            usuario: {
              select: { id: true, nome: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.restaurant.findFirst({
      where: {
        OR: [{ slug }, { configuracoes: { customSlug: slug } }],
        ativo: true,
      },
      include: {
        configuracoes: true,
        imagens: { orderBy: { displayOrder: 'asc' } },
        mesas: true,
      },
    });
  }

  async update(id: string, data: UpdateRestaurantRepositoryInput) {
    return prisma.restaurant.update({
      where: { id },
      data: data as Prisma.RestaurantUncheckedUpdateInput,
    });
  }

  async delete(id: string) {
    return prisma.restaurant.delete({
      where: { id },
    });
  }

  async listByOwner(ownerId: string) {
    return prisma.restaurant.findMany({
      where: { proprietarioId: ownerId },
      include: {
        configuracoes: true,
        imagens: true,
        mesas: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAvailability(restaurantId: string, dataReserva: Date, horarioReserva: Date, quantidadePessoas: number) {
    return prisma.table.findMany({
      where: {
        restauranteId: restaurantId,
        ativo: true,
        capacidade: { gte: quantidadePessoas },
        status: 'DISPONIVEL',
        reservas: {
          none: {
            dataReserva,
            horarioReserva,
            status: { in: ['PENDENTE', 'CONFIRMADA'] },
          },
        },
      },
      orderBy: [{ capacidade: 'asc' }, { numero: 'asc' }],
    });
  }
}

export const restaurantRepository = new RestaurantRepository();
