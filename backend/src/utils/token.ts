import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  papel: 'CUSTOMER' | 'OWNER' | 'ADMIN';
  tenantId?: string | null;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
}

export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });

export const signRefreshToken = (payload: RefreshTokenPayload): string =>
  jwt.sign(payload, env.refreshTokenSecret, {
    expiresIn: `${env.refreshTokenExpiresInDays}d` as jwt.SignOptions['expiresIn'],
  });

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.jwtSecret) as AccessTokenPayload;

export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, env.refreshTokenSecret) as RefreshTokenPayload;
