import { NextFunction, Request, Response } from 'express';
import { userService } from '../services/user.service';

export class UserController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.list();
      return res.status(200).json({ success: true, data: users });
    } catch (error) {
      return next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getById(String(req.params.id));
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.create(req.body);
      return res.status(201).json({ success: true, message: 'Usuário criado com sucesso.', data: user });
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.update(String(req.params.id), req.body);
      return res.status(200).json({ success: true, message: 'Usuário atualizado com sucesso.', data: user });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.delete(String(req.params.id));
      return res.status(200).json({ success: true, message: 'Usuário removido com sucesso.' });
    } catch (error) {
      return next(error);
    }
  }

  async reservationHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await userService.reservationHistory(String(req.params.id));
      return res.status(200).json({ success: true, data: history });
    } catch (error) {
      return next(error);
    }
  }
}

export const userController = new UserController();
