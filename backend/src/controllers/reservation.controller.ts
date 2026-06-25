import { NextFunction, Response } from 'express';
import { ReservationStatus } from '@prisma/client';
import { reservationService } from '../services/reservation.service';
import { AuthenticatedRequest } from '../types/auth';

export class ReservationController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationService.create({
        usuarioId: req.user!.id,
        restauranteId: req.body.restauranteId ?? req.body.restaurantId,
        mesaId: req.body.mesaId ?? req.body.tableId,
        dataReserva: new Date(req.body.dataReserva ?? req.body.reservationDate),
        horarioReserva: new Date(`1970-01-01T${req.body.horarioReserva ?? req.body.reservationTime}:00Z`),
        quantidadePessoas: Number(req.body.quantidadePessoas ?? req.body.guestCount),
        justificativa: req.body.justificativa,
        observacoes: req.body.observacoes ?? req.body.customerNotes,
      });

      return res.status(201).json({ success: true, message: 'Reserva criada com sucesso.', data: reservation });
    } catch (error) {
      return next(error);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reservations = req.user!.role === 'ADMIN'
        ? await reservationService.listAll({
            status: req.query.status as ReservationStatus | undefined,
            restauranteId: typeof req.query.restauranteId === 'string' ? req.query.restauranteId : undefined,
          })
        : req.user!.role === 'OWNER'
          ? await reservationService.listForRestaurant(typeof req.query.restauranteId === 'string' ? req.query.restauranteId : '')
          : await reservationService.listForUser(req.user!.id);

      return res.status(200).json({ success: true, data: reservations });
    } catch (error) {
      return next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationService.getById(String(req.params.id));
      return res.status(200).json({ success: true, data: reservation });
    } catch (error) {
      return next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationService.update(String(req.params.id), {
        mesaId: req.body.mesaId ?? req.body.tableId,
        dataReserva: req.body.dataReserva ? new Date(req.body.dataReserva) : undefined,
        horarioReserva: req.body.horarioReserva
          ? new Date(`1970-01-01T${req.body.horarioReserva}:00Z`)
          : req.body.reservationTime
            ? new Date(`1970-01-01T${req.body.reservationTime}:00Z`)
            : undefined,
        quantidadePessoas: req.body.quantidadePessoas ?? req.body.guestCount,
        justificativa: req.body.justificativa,
        observacoes: req.body.observacoes ?? req.body.customerNotes,
      });

      return res.status(200).json({ success: true, message: 'Reserva atualizada com sucesso.', data: reservation });
    } catch (error) {
      return next(error);
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationService.updateStatus(
        String(req.params.id),
        req.body.status as ReservationStatus,
        req.body.justificativa ?? req.body.rejectionReason
      );

      return res.status(200).json({ success: true, message: 'Status da reserva atualizado com sucesso.', data: reservation });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await reservationService.delete(String(req.params.id));
      return res.status(200).json({ success: true, message: 'Reserva removida com sucesso.' });
    } catch (error) {
      return next(error);
    }
  }
}

export const reservationController = new ReservationController();
