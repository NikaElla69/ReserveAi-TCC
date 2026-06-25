import { Request } from 'express';

export type UserRole = 'CUSTOMER' | 'OWNER' | 'ADMIN';

export interface AuthenticatedUserPayload {
  id: string;
  email: string;
  role: UserRole;
  tenantId?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserPayload;
}
