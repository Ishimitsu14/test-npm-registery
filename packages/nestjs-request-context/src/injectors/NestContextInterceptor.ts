import { CallHandler, ExecutionContext, Inject, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { NestContextManager } from '../core';

export class NestContextInterceptor implements NestInterceptor {
  @Inject(NestContextManager)
  private nestContextManager: NestContextManager;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return new Observable((subscriber) => {
      const contextObservable = this.nestContextManager.runInContext(() => next.handle());
      return contextObservable.subscribe(subscriber);
    });
  }
}
