// import { RpcHandler, NextFunction } from '../types';

import { RpcHandler, RpcNextFunction } from '../external.types';

export function combineHandlersMiddleware(handlers: RpcHandler[]): RpcHandler {
  return (next) => {
    if (!handlers || handlers.length <= 0) return next();

    return handlers.reduceRight<RpcNextFunction>((next, handler) => async () => await handler(next), next)();
  };
}
