import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types/auth';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await authService.register(req.body);
      return res.status(201).json({
        success: true,
        message: 'Usuário cadastrado com sucesso.',
        data: session,
      });
    } catch (error) {
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await authService.login({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.get('user-agent') ?? undefined,
      });

      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso.',
        data: session,
      });
    } catch (error) {
      return next(error);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.me(req.user!.id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body.refreshToken ?? req.cookies?.refreshToken;
      const session = await authService.refresh(refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Sessão renovada com sucesso.',
        data: session,
      });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body.refreshToken ?? req.cookies?.refreshToken;
      await authService.logout(refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso.',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export const authController = new AuthController();
