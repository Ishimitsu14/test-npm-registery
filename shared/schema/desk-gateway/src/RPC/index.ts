/* eslint-disable @typescript-eslint/no-unused-vars */

import { RpcApiMethod, RpcApiMethodName, RpcApiPayload, RpcApiResult } from '@packages/berish-rpc-client-schema';
import { RpcSchemaClientCommon } from '@schema/core';

import * as _DTO from './DTO';
import { Schema as _Schema } from './schema';

export * from './DTO'

export namespace RPC {
  export import DTO = _DTO;

  export type Schema = _Schema;

  export type MethodName = RpcApiMethodName<Schema>;
  export type Method<TPath extends MethodName> = RpcApiMethod<Schema, TPath>;
  export type Payload<TPath extends MethodName> = RpcApiPayload<Schema, TPath>;
  export type Result<TPath extends MethodName> = RpcApiResult<Schema, TPath>;

  export function MethodName<TPath extends MethodName>(path: TPath): TPath {
    return path;
  }

  export interface ClientMeta {
    token?: string;
  }

  export interface ServerMeta {
    authToken?: string;
  }

  export class Client extends RpcSchemaClientCommon<Schema, ClientMeta, ServerMeta> {}
}
