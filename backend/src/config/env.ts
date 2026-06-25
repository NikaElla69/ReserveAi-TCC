import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(process.cwd(), 'src/storage/uploads');

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3333),
  appUrl: process.env.APP_URL ?? 'http://localhost:3333',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL ?? 'mysql://root:root@localhost:3306/reserveai_db',
  jwtSecret: process.env.JWT_SECRET ?? 'reserveai-super-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? 'reserveai-refresh-secret',
  refreshTokenExpiresInDays: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS ?? 7),
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 100),
  uploadsDir,
  storageDriver: process.env.STORAGE_DRIVER ?? 'local',
  awsRegion: process.env.AWS_REGION ?? '',
  awsBucket: process.env.AWS_BUCKET ?? '',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  swaggerEnabled: (process.env.SWAGGER_ENABLED ?? 'true') === 'true',
};

export type AppEnv = typeof env;
