import { ReservationStatus } from '@prisma/client';
import { reservationRepository } from '../repositories/reservation.repository';
import { tableRepository } from '../repositories/table.repository';
import { restaurantRepository } from '../repositories/restaurant.repository';
import { AppError } from '../utils/app-error';

export interface CreateReservationServiceInput {
  usuarioId: string;
  restauranteId: string;
  mesaId: string;
  dataReserva: Date;
  horarioReserva: Date;
  quantidadePessoas: number;
  justificativa?: string;
  observacoes?: string;
}

export interface UpdateReservationServiceInput {
  mesaId?: string;
  dataReserva?: Date;
  horarioReserva?: Date;
  quantidadePessoas?: number;
  justificativa?: string;
  observacoes?: string;
  status?: ReservationStatus;
}

export class ReservationService {
  async create(input: CreateReservationServiceInput) {
    const restaurant = await restaurantRepository.findById(input.restauranteId);
    const table = await tableRepository.findById(input.mesaId);

    if (!restaurant) {
      throw new AppError('Restaurante não encontrado.', 404);
    }

    if (!table || table.restauranteId !== input.restauranteId) {
      throw new AppError('Mesa não encontrada para este restaurante.', 404);
    }

    if (table.capacidade < input.quantidadePessoas) {
      throw new AppError('A mesa selecionada não comporta a quantidade de pessoas informada.', 422);
    }

    const conflict = await reservationRepository.findConflict({
      restauranteId: input.restauranteId,
      mesaId: input.mesaId,
      dataReserva: input.dataReserva,
      horarioReserva: input.horarioReserva,
    });

    if (conflict) {
      throw new AppError('Já existe uma reserva ativa para esta mesa neste horário.', 409);
    }

    const reservation = await reservationRepository.create(input);

    await reservationRepository.createAuditLog({
      usuarioId: input.usuarioId,
      acao: 'CREATE',
      tipoEntidade: 'reservations',
      idEntidade: reservation.id,
    });

    return reservation;
  }

  async getById(id: string) {
    const reservation = await reservationRepository.findById(id);

    if (!reservation) {
      throw new AppError('Reserva não encontrada.', 404);
    }

    return reservation;
  }

  async listForUser(userId: string) {
    return reservationRepository.listForUser(userId);
  }

  async listForRestaurant(restauranteId: string) {
    return reservationRepository.listForRestaurant(restauranteId);
  }

  async listAll(filters?: { status?: ReservationStatus; restauranteId?: string }) {
    return reservationRepository.listAll(filters);
  }

  async update(id: string, input: UpdateReservationServiceInput) {
    const current = await this.getById(id);
    const mesaId = input.mesaId ?? current.mesaId;
    const dataReserva = input.dataReserva ?? current.dataReserva;
    const horarioReserva = input.horarioReserva ?? current.horarioReserva;

    const conflict = await reservationRepository.findConflict({
      restauranteId: current.restauranteId,
      mesaId,
      dataReserva,
      horarioReserva,
      ignoreId: id,
    });

    if (conflict) {
      throw new AppError('Já existe uma reserva ativa para esta mesa neste horário.', 409);
    }

    return reservationRepository.update(id, input);
  }

  async updateStatus(id: string, status: ReservationStatus, justificativa?: string) {
    await this.getById(id);
    return reservationRepository.updateStatus(id, status, justificativa);
  }

  async cancel(id: string, justificativa?: string) {
    return this.updateStatus(id, ReservationStatus.CANCELADA, justificativa);
  }

  async delete(id: string) {
    await this.getById(id);
    return reservationRepository.delete(id);
  }

  async restaurantMetrics(restauranteId: string) {
    return reservationRepository.getRestaurantMetrics(restauranteId);
  }
}

export const reservationService = new ReservationService();
