import { NextFunction, Response } from 'express';
import { AuthenticatedRequest, UserRole } from '../types/auth';
import { AppError } from '../utils/app-error';
import { verifyAccessToken } from '../utils/token';

export function authMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new AppError('Token de autorização não informado.', 401);
  }

  const token = authorizationHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  req.user = {
    id: decoded.sub,
    email: decoded.email,
    role: decoded.papel,
    tenantId: decoded.tenantId ?? null,
  };

  next();
}

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Usuário não autenticado.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Você não possui permissão para acessar este recurso.', 403);
    }

    next();
  };
}
