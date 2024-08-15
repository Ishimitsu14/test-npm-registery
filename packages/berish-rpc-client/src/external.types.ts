// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { Interceptor, InterceptorCallback } from './helpers';

export type RpcResponseStatus = 'success' | 'error';

export interface RpcRequest<Params extends Record<string, any> = Record<string, any>, Result = any> {
  method?: string;
  meta?: Record<string, any>;
  params?: Params;
  push?: boolean;
}

export interface RpcResponse<Result> {
  status: RpcResponseStatus;

  result?: Result;
  error?: RpcResponseError;

  warnings?: string[];
  meta?: Record<string, any>;
}

export interface RpcResponseError {
  name: string;
  message: string;
  data?: Record<string, any>;
}

export type RpcRequestInterceptor = Interceptor<RpcRequest, RpcRequest>;
export type RpcRequestInterceptorCallback = InterceptorCallback<RpcRequest, RpcRequest>;

export type RpcResponseInterceptor = Interceptor<RpcResponse<any>, any>;
export type RpcResponseInterceptorCallback = InterceptorCallback<RpcResponse<any>, any>;
