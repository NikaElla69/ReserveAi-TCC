import { Prisma, ReservationStatus } from '@prisma/client';
import prisma from '../lib/prisma';

export interface CreateReservationRepositoryInput {
  usuarioId: string;
  restauranteId: string;
  mesaId: string;
  dataReserva: Date;
  horarioReserva: Date;
  quantidadePessoas: number;
  justificativa?: string | null;
  observacoes?: string | null;
}

export interface UpdateReservationRepositoryInput {
  mesaId?: string;
  dataReserva?: Date;
  horarioReserva?: Date;
  quantidadePessoas?: number;
  justificativa?: string | null;
  observacoes?: string | null;
  status?: ReservationStatus;
}

export class ReservationRepository {
  async create(data: CreateReservationRepositoryInput) {
    return prisma.reservation.create({
      data,
      include: {
        usuario: true,
        restaurante: true,
        mesa: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        usuario: true,
        restaurante: {
          include: { configuracoes: true },
        },
        mesa: true,
        review: true,
      },
    });
  }

  async listForUser(usuarioId: string) {
    return prisma.reservation.findMany({
      where: { usuarioId },
      include: {
        restaurante: {
          include: { configuracoes: true },
        },
        mesa: true,
      },
      orderBy: [{ dataReserva: 'desc' }, { horarioReserva: 'desc' }],
    });
  }

  async listForRestaurant(restauranteId: string) {
    return prisma.reservation.findMany({
      where: { restauranteId },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true, telefone: true },
        },
        mesa: true,
      },
      orderBy: [{ dataReserva: 'desc' }, { horarioReserva: 'asc' }],
    });
  }

  async listAll(filters?: { status?: ReservationStatus; restauranteId?: string }) {
    return prisma.reservation.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.restauranteId ? { restauranteId: filters.restauranteId } : {}),
      },
      include: {
        usuario: true,
        restaurante: true,
        mesa: true,
      },
      orderBy: [{ dataReserva: 'desc' }, { horarioReserva: 'desc' }],
    });
  }

  async update(id: string, data: UpdateReservationRepositoryInput) {
    return prisma.reservation.update({
      where: { id },
      data,
      include: {
        usuario: true,
        restaurante: true,
        mesa: true,
      },
    });
  }

  async updateStatus(id: string, status: ReservationStatus, justificativa?: string | null) {
    return prisma.reservation.update({
      where: { id },
      data: {
        status,
        ...(justificativa !== undefined ? { justificativa } : {}),
      },
      include: {
        usuario: true,
        restaurante: true,
        mesa: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.reservation.delete({
      where: { id },
    });
  }

  async findConflict(params: {
    restauranteId: string;
    mesaId: string;
    dataReserva: Date;
    horarioReserva: Date;
    ignoreId?: string;
  }) {
    return prisma.reservation.findFirst({
      where: {
        restauranteId: params.restauranteId,
        mesaId: params.mesaId,
        dataReserva: params.dataReserva,
        horarioReserva: params.horarioReserva,
        status: { in: ['PENDENTE', 'CONFIRMADA'] },
        ...(params.ignoreId ? { id: { not: params.ignoreId } } : {}),
      },
    });
  }

  async getRestaurantMetrics(restauranteId: string) {
    const [total, confirmadas, canceladas, noShow] = await Promise.all([
      prisma.reservation.count({ where: { restauranteId } }),
      prisma.reservation.count({ where: { restauranteId, status: 'CONFIRMADA' } }),
      prisma.reservation.count({ where: { restauranteId, status: 'CANCELADA' } }),
      prisma.reservation.count({ where: { restauranteId, status: 'NO_SHOW' } }),
    ]);

    return { total, confirmadas, canceladas, noShow };
  }

  async createAuditLog(data: Prisma.AuditLogUncheckedCreateInput) {
    return prisma.auditLog.create({ data });
  }
}

export const reservationRepository = new ReservationRepository();
