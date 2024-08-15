import { RpcRequest } from '../external.types';

export function request<Result>(method: string, params?: Record<string, any>, meta?: Record<string, any>): RpcRequest<any, Result> {
  return {
    method,
    params,
    meta,
    push: false,
  };
}
