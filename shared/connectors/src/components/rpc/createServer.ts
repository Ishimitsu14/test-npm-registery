import { RuntimeError } from '@ddd/errors';
import { MicroserviceOptions } from '@nestjs/microservices';
import { LoggerLevel, loggerMiddleware } from '@packages/berish-rpc-logger';
import { IRpcServerAdapter } from '@packages/berish-rpc-server';
import { RpcError, RpcMicroservice } from '@packages/nestjs-rpc-server';

export interface CreateServerOptions {
  adapters: IRpcServerAdapter[];
  level?: LoggerLevel;
}

export function createServer({ adapters, level = 'debug' }: CreateServerOptions): MicroserviceOptions {
  return {
    strategy: new RpcMicroservice({
      adapters,
      beforeSetup: ({ router }) => {
        router.use(loggerMiddleware({ level }));

        router.use(async (next) => {
          try {
            const result = await next();
            if (RuntimeError.isExtends(result)) throw result;
            return result;
          } catch (err) {
            if (RuntimeError.isExtends(err)) throw RpcError.Custom(err.name, err.message, err.params);
            throw err;
          }
        });
      },
    }),
  };
}
