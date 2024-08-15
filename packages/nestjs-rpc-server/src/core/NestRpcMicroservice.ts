import { Logger } from '@nestjs/common';
import { BaseRpcContext, CustomTransportStrategy, MessageHandler, RpcException, Server } from '@nestjs/microservices';
import { Router } from '@packages/berish-rpc-router';
import { IRpcServerAdapter, RpcLogger, RpcServer, RpcServerOptions, useRpcRequestInfo } from '@packages/berish-rpc-server';
import { lastValueFrom } from 'rxjs';

import { NestSetupPayload } from '../internal.types';

export interface RpcMicroserviceOptions extends RpcServerOptions {
  adapters: IRpcServerAdapter[];
  beforeSetup?: (setupPayload: NestSetupPayload) => void;
  afterSetup?: (setupPayload: NestSetupPayload) => void;
}

export class RpcMicroservice extends Server implements CustomTransportStrategy {
  private readonly _rootRouter: Router;
  private readonly _methodsRouter: Router;
  private readonly _rpcServer: RpcServer;
  private readonly adapters: ReadonlyArray<IRpcServerAdapter>;

  constructor(private readonly options: RpcMicroserviceOptions) {
    super();

    this.adapters = options?.adapters ?? [];

    this._rootRouter = Router();
    this._methodsRouter = Router();
    this._rpcServer = new RpcServer(this._rootRouter, options);
  }

  override addHandler(pattern: string, callback: MessageHandler<any, any, any>): void {
    const normalizedPattern = this.normalizePattern(pattern);

    const rpcHandler = async () => {
      try {
        const requestInfo = useRpcRequestInfo();
        const nestRpcContext = new BaseRpcContext([requestInfo]);

        const result = await callback(void 0, nestRpcContext);
        const resultObservable = this.transformToObservable(result);
        const resultValue = await lastValueFrom(resultObservable);

        return resultValue;
      } catch (err) {
        if (err instanceof RpcException) throw err.getError();
        throw err;
      }
    };
    this._methodsRouter.add(normalizedPattern, rpcHandler);
  }

  async listen(callback: (...optionalParams: unknown[]) => any) {
    const adapters = this.adapters.slice();

    const setupPayload: NestSetupPayload = {
      rpcServer: this._rpcServer,
      router: this._rootRouter,
      adapters,
    };

    if (typeof this.options.beforeSetup === 'function') this.options.beforeSetup(setupPayload);

    this._rootRouter.use(this._methodsRouter);

    for (const adapter of adapters) {
      this._rpcServer.registerAdapter(adapter, this.getRpcLogger(adapter));
    }

    if (typeof this.options.afterSetup === 'function') this.options.afterSetup(setupPayload);

    await Promise.all(adapters.map((adapter) => adapter.start()));
  }

  async close() {
    const adapters = this.adapters.slice();
    await Promise.all(adapters.map((adapter) => adapter.stop()));
  }

  private getRpcLogger(adapter: IRpcServerAdapter): RpcLogger {
    return {
      log: (message) => Logger.log(message, `NestRpcMicroservice - ${adapter.getAdapterName()}`),
    };
  }
}
