import { RuntimeError } from '@ddd/errors';
import { RpcClient, RpcError, RpcRequestInterceptorCallback, RpcResponseInterceptorCallback } from '@packages/berish-rpc-client';
import { RpcApiSchema, RpcSchemaClient } from '@packages/berish-rpc-client-schema';

import { RpcClientErrorTrigger } from './RpcClientErrorTrigger';

export interface RpcSchemaClientCommonOptions<ClientMeta extends Record<string, any>, ServerMeta extends Record<string, any>> {
  /** Default true */
  includeRuntimeErrorInterceptor?: boolean;
  globalErrorTriggers?: RpcClientErrorTrigger[];

  getMeta?: () => ClientMeta | Promise<ClientMeta>;
  setMeta?: (meta: ServerMeta) => any;
}

export class RpcSchemaClientCommon<Schema extends RpcApiSchema, ClientMeta extends Record<string, any>, ServerMeta extends Record<string, any>> extends RpcSchemaClient<Schema, ClientMeta> {
  readonly options: RpcSchemaClientCommonOptions<ClientMeta, ServerMeta>;

  constructor(client: RpcClient, options: RpcSchemaClientCommonOptions<ClientMeta, ServerMeta>) {
    super(client);

    this.options = options;
    this.options.includeRuntimeErrorInterceptor = this.options.includeRuntimeErrorInterceptor ?? true;
    this.options.globalErrorTriggers = this.options.globalErrorTriggers || [];

    this.client.requestInterceptor.use(this.createClientMetaRequestInterceptor());
    this.client.responseInterceptor.use(this.createServerMetaResponseInterceptor());
    this.client.responseInterceptor.use(this.createRuntimeErrorResponseInterceptor());
  }

  private createClientMetaRequestInterceptor(): RpcRequestInterceptorCallback {
    return async (request, next) => {
      if (!this.options.getMeta) return next();

      const meta = await this.options.getMeta();
      if (!meta) return request;

      return {
        ...request,
        meta: {
          ...meta,
          ...request.meta,
        },
      };
    };
  }

  private createServerMetaResponseInterceptor(): RpcResponseInterceptorCallback {
    return async (response, next) => {
      if (!this.options.setMeta) return next();

      if (response.meta) await this.options.setMeta(<ServerMeta>response.meta);
      return next();
    };
  }

  private createRuntimeErrorResponseInterceptor(): RpcResponseInterceptorCallback {
    return async (response, next) => {
      if (!this.options.includeRuntimeErrorInterceptor) return next();

      try {
        return await next();
      } catch (err) {
        if (RpcError.isExtends(err)) {
          const runtimeError = RuntimeError.resolveError(err.name, err.data);

          const error = runtimeError || err;
          await this.executeErrorTrigger(error);

          throw error;
        }
      }
    };
  }

  private executeErrorTrigger(error: RpcError | RuntimeError) {
    const triggers = this.options.globalErrorTriggers || [];

    const trigger = triggers.find((m) => (m.errors || []).find((k) => error instanceof k));
    const triggerFunction = trigger?.trigger;
    if (!triggerFunction) return void 0;

    return triggerFunction(error);
  }
}
