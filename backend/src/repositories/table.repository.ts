import { TableStatus } from '@prisma/client';
import prisma from '../lib/prisma';

export interface CreateTableRepositoryInput {
  restauranteId: string;
  numero: string;
  capacidade: number;
  status?: TableStatus;
  localizacao?: string | null;
}

export interface UpdateTableRepositoryInput {
  numero?: string;
  capacidade?: number;
  status?: TableStatus;
  localizacao?: string | null;
  ativo?: boolean;
}

export class TableRepository {
  async create(data: CreateTableRepositoryInput) {
    return prisma.table.create({
      data: {
        ...data,
        status: data.status ?? TableStatus.DISPONIVEL,
      },
    });
  }

  async findById(id: string) {
    return prisma.table.findUnique({
      where: { id },
      include: {
        restaurante: true,
      },
    });
  }

  async listByRestaurant(restauranteId: string) {
    return prisma.table.findMany({
      where: { restauranteId },
      orderBy: [{ numero: 'asc' }],
    });
  }

  async update(id: string, data: UpdateTableRepositoryInput) {
    return prisma.table.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.table.delete({
      where: { id },
    });
  }

  async findByNumber(restauranteId: string, numero: string, ignoreId?: string) {
    return prisma.table.findFirst({
      where: {
        restauranteId,
        numero,
        ...(ignoreId ? { id: { not: ignoreId } } : {}),
      },
    });
  }
}

export const tableRepository = new TableRepository();
