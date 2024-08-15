import * as Utils from './utils-types';

export type APIAtomicType<Payload extends Record<string, any> = any, Result = any> = (payload: Payload) => Result;

export type RpcApiSchema = Utils.Schema<APIAtomicType<any, any>>;
export type RpcApiMethodName<TSchema extends RpcApiSchema> = Utils.Path<TSchema, APIAtomicType<any, any>>;
export type RpcApiMethod<TSchema extends RpcApiSchema, TPath extends RpcApiMethodName<TSchema>> = Utils.PathValue<TSchema, APIAtomicType, TPath>;

export type RpcApiPayload<TSchema extends RpcApiSchema, TPath extends RpcApiMethodName<TSchema>> = RpcApiMethod<TSchema, TPath> extends APIAtomicType<infer Payload, any> ? Payload : never;

export type RpcApiResult<TSchema extends RpcApiSchema, TPath extends RpcApiMethodName<TSchema>> = RpcApiMethod<TSchema, TPath> extends APIAtomicType<any, infer Result> ? Result : never;
