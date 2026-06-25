import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { isAppError } from '../utils/app-error';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): Response {
  if (env.nodeEnv !== 'test') {
    console.error(err);
  }

  if (isAppError(err)) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details ?? null,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
  });
}
