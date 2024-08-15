import { AdminGatewayConfig } from '@shared/config';
import { sign, verify } from 'jsonwebtoken';

import { IJwtHelper } from '../../Application';

interface InnerJwtPayload {
  userId: string;
}

export class JwtHelper implements IJwtHelper {
  sign(userId: string): string {
    const payload: InnerJwtPayload = {
      userId,
    };

    return sign(payload, AdminGatewayConfig.jwt.privateKey, { expiresIn: AdminGatewayConfig.jwt.expiresIn });
  }

  verify(token: string): string | false {
    try {
      const payload = verify(token, AdminGatewayConfig.jwt.privateKey) as InnerJwtPayload;
      if (!payload || typeof payload !== 'object') return false;
      if (typeof payload.userId !== 'string') return false;

      return payload.userId;
    } catch (err) {
      return false;
    }
  }
}
