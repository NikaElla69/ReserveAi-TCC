import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import routes from './routes';

const app = express();

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'ReserveAí API',
      version: '2.0.0',
      description: 'API profissional da plataforma ReserveAí para reservas de restaurantes e recursos White Label.',
    },
    servers: [{ url: env.appUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [],
});

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());
app.use(
  cors({
    origin: [env.frontendUrl],
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve(env.uploadsDir)));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ReserveAí API está operacional',
    timestamp: new Date().toISOString(),
  });
});

if (env.swaggerEnabled) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use('/api', routes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;
