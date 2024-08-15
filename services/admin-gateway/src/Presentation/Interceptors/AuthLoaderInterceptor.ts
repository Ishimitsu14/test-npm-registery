import { CallHandler, ExecutionContext, forwardRef, Inject, NestInterceptor } from '@nestjs/common';
import { useRpcRequestInfo } from '@packages/berish-rpc-server';
import { AdminGatewaySchema } from '@schema/admin-gateway';
import { AuthNotAuthorizedError } from '@schema/common';
import { Observable } from 'rxjs';

import { AuthApi, AuthApiContext, AuthService } from '../../Application';

export class AuthLoaderInterceptor implements NestInterceptor {
  @Inject(forwardRef(() => AuthService))
  private authService: AuthService;

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const requestInfo = useRpcRequestInfo();
    const meta: AdminGatewaySchema.RPC.ClientMeta = requestInfo.meta;

    const token = meta.token || undefined;
    const userId = (token && this.authService.verify(token)) || undefined;
    const isAuthorized = !!token && !!userId;

    const ensureIsAuthorized = () => {
      if (!isAuthorized) throw new AuthNotAuthorizedError();
    };

    const api: AuthApi = {
      token,
      userId,
      isAuthorized,
      ensureIsAuthorized,
    };

    return new Observable((subscriber) => {
      const observable = AuthApiContext.run(api, () => next.handle());
      return observable.subscribe(subscriber);
    });
  }
}
