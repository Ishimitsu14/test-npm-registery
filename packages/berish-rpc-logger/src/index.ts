import { RpcError, RpcHandler, useRpcRequestInfo } from '@packages/berish-rpc-server';

export type LoggerLevel = 'debug' | 'info' | 'critical' | 'none';

export interface LoggerMiddlewareOptions {
  level?: LoggerLevel;
}

export function loggerMiddleware({ level }: LoggerMiddlewareOptions = { level: 'critical' }): RpcHandler {
  return async (next) => {
    const request = useRpcRequestInfo();

    const startTime = Date.now();
    try {
      const result = await next();
      const spending = Date.now() - startTime;
      if (level === 'debug') console.log(`[Success] "${request.method}" ${spending}ms`, result);
      if (level === 'info') console.log(`[Success] "${request.method}" ${spending}ms`);
      return result;
    } catch (err) {
      const spending = Date.now() - startTime;
      if (level === 'debug') console.log(`[Error] "${request.method}" ${spending}ms`, err);
      if (level === 'info') {
        const message = err instanceof Error ? `[${err.name}] ${err.message}` : String(err);
        console.log(`[Error] "${request.method}" ${spending}ms`, message);
      }
      if (level === 'critical') {
        const rpcError = RpcError.isExtends(err) ? err : RpcError.InternalError();
        if (RpcError.SystemList.indexOf(<any>rpcError.name) !== -1) console.log(`[Error] "${request.method}" ${spending}ms`, err);
      }

      throw err;
    }
  };
}
