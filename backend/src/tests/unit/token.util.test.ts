import { describe, it, expect } from '@jest/globals';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../../utils/token';

describe('token utils', () => {
  it('deve assinar e validar um access token', () => {
    const token = signAccessToken({
      sub: 'user-1',
      email: 'teste@reserveai.com',
      papel: 'ADMIN',
      tenantId: 'tenant-1',
    });

    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe('user-1');
    expect(payload.email).toBe('teste@reserveai.com');
    expect(payload.papel).toBe('ADMIN');
    expect(payload.tenantId).toBe('tenant-1');
  });

  it('deve assinar e validar um refresh token', () => {
    const token = signRefreshToken({
      sub: 'user-2',
      tokenId: 'refresh-123',
    });

    const payload = verifyRefreshToken(token);

    expect(payload.sub).toBe('user-2');
    expect(payload.tokenId).toBe('refresh-123');
  });
});
