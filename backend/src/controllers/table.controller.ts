import { NextFunction, Request, Response } from 'express';
import { tableService } from '../services/table.service';

export class TableController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const table = await tableService.create(req.body);
      return res.status(201).json({ success: true, message: 'Mesa criada com sucesso.', data: table });
    } catch (error) {
      return next(error);
    }
  }

  async listByRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const tables = await tableService.listByRestaurant(String(req.params.restaurantId));
      return res.status(200).json({ success: true, data: tables });
    } catch (error) {
      return next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const table = await tableService.getById(String(req.params.id));
      return res.status(200).json({ success: true, data: table });
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const table = await tableService.update(String(req.params.id), req.body);
      return res.status(200).json({ success: true, message: 'Mesa atualizada com sucesso.', data: table });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await tableService.delete(String(req.params.id));
      return res.status(200).json({ success: true, message: 'Mesa removida com sucesso.' });
    } catch (error) {
      return next(error);
    }
  }
}

export const tableController = new TableController();
