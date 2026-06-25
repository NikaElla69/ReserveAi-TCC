import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { restaurantService } from '../services/restaurant.service';

export class RestaurantController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {

      console.log('BODY RECEBIDO');
      console.log(req.body);
      console.log(req.user);

      console.log("USUARIO LOGADO");
      console.log(req.user);


      if (!req.user?.tenantId && !req.body.tenantId) {
        return res.status(400).json({
          success: false,
          message: "TenantId não encontrado.",
        });
      }

      const restaurant = await restaurantService.create({
        ...req.body,

        proprietarioId: req.user!.id,

        tenantId:
          req.user?.tenantId ??
          req.body.tenantId,

        horarioFuncionamento:
          req.body.horarioFuncionamento ?? {
            segunda: "08:00-22:00",
            terca: "08:00-22:00",
            quarta: "08:00-22:00",
            quinta: "08:00-22:00",
            sexta: "08:00-23:00",
            sabado: "08:00-23:00",
            domingo: "08:00-22:00",
          },
      });

      

      return res.status(201).json({
        success: true,
        message: 'Restaurante criado com sucesso.',
        data: restaurant,
      });

    } catch (error) {
      return next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurants = await restaurantService.listPublic({
        cidade: typeof req.query.cidade === 'string' ? req.query.cidade : undefined,
        termo: typeof req.query.termo === 'string' ? req.query.termo : undefined,
      });
      return res.status(200).json({ success: true, data: restaurants });
    } catch (error) {
      return next(error);
    }
  }

  async listByOwner(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const restaurants = await restaurantService.listByOwner(req.user!.id);
      return res.status(200).json({ success: true, data: restaurants });
    } catch (error) {
      return next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurant = await restaurantService.getById(String(req.params.id));
      return res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
      return next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurant = await restaurantService.getBySlug(String(req.params.slug));
      return res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurant = await restaurantService.update(String(req.params.id), req.body);
      return res.status(200).json({ success: true, message: 'Restaurante atualizado com sucesso.', data: restaurant });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await restaurantService.delete(String(req.params.id));
      return res.status(200).json({ success: true, message: 'Restaurante removido com sucesso.' });
    } catch (error) {
      return next(error);
    }
  }

  async availability(req: Request, res: Response, next: NextFunction) {
    try {
      const availableTables = await restaurantService.availability(
        String(req.params.id),
        new Date(String(req.query.date)),
        new Date(`1970-01-01T${String(req.query.time)}:00Z`),
        Number(req.query.guestCount ?? 1)
      );

      return res.status(200).json({
        success: true,
        data: availableTables,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export const restaurantController = new RestaurantController();
