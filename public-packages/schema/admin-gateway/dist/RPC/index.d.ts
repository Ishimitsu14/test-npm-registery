import { RpcApiMethod, RpcApiMethodName, RpcApiPayload, RpcApiResult } from '@packages/berish-rpc-client-schema';
import { RpcSchemaClientCommon } from '@schema/core';
import * as _DTO from './DTO';
import { Schema as _Schema } from './schema';
export * from './DTO';
export declare namespace RPC {
    export import DTO = _DTO;
    type Schema = _Schema;
    type MethodName = RpcApiMethodName<Schema>;
    type Method<TPath extends MethodName> = RpcApiMethod<Schema, TPath>;
    type Payload<TPath extends MethodName> = RpcApiPayload<Schema, TPath>;
    type Result<TPath extends MethodName> = RpcApiResult<Schema, TPath>;
    function MethodName<TPath extends MethodName>(path: TPath): TPath;
    interface ClientMeta {
        token?: string;
    }
    interface ServerMeta {
        authToken?: string;
    }
    class Client extends RpcSchemaClientCommon<Schema, ClientMeta, ServerMeta> {
    }
}
