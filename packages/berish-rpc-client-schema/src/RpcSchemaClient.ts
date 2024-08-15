import { push, request, RpcClient, RpcRequest } from '@packages/berish-rpc-client';

import { RpcApiMethodName, RpcApiPayload, RpcApiResult, RpcApiSchema } from './schema.types';

export interface RpcSchemaSendOptions<Push extends boolean, Meta extends Record<string, any>> {
  meta?: Meta;
  push?: Push;
}

export class RpcSchemaClient<ApiSchema extends RpcApiSchema, Meta extends Record<string, any>> {
  protected readonly client: RpcClient;

  constructor(rpcClient: RpcClient) {
    this.client = rpcClient;
  }

  send<Method extends RpcApiMethodName<ApiSchema>>(method: Method, params: RpcApiPayload<ApiSchema, Method>, options?: RpcSchemaSendOptions<false, Meta>): Promise<RpcApiResult<ApiSchema, Method>>;
  send<Method extends RpcApiMethodName<ApiSchema>, Push extends boolean>(method: Method, params: RpcApiPayload<ApiSchema, Method>, options?: RpcSchemaSendOptions<true, Meta>): Promise<void>;
  send(method: string, params?: Record<string, any>, options?: RpcSchemaSendOptions<boolean, Meta>): Promise<any> {
    return this.custom(method, params, options);
  }

  custom<Result>(method: string, params: Record<string, any>, options?: RpcSchemaSendOptions<false, Meta>): Promise<Result>;
  custom(method: string, params: Record<string, any>, options?: RpcSchemaSendOptions<true, Meta>): Promise<void>;
  custom<Result>(method: string, params: Record<string, any>, options?: RpcSchemaSendOptions<boolean, Meta>): Promise<Result>;
  custom<Push extends boolean, Result>(method: string, params: Record<string, any>, options?: RpcSchemaSendOptions<Push, Meta>): Promise<Result> {
    const rpcRequest: RpcRequest = options?.push ? push(method, params, options?.meta) : request(method, params, options?.meta);
    return this.client.send(rpcRequest);
  }
}
