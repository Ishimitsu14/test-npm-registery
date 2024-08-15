import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { useAuthApi } from '../../Application';

export class OnlyAuthorizedGuard implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { ensureIsAuthorized } = useAuthApi();

    ensureIsAuthorized();

    return next.handle();
  }
}
