import { RpcRequest } from '../external.types';

export function push(method: string, params?: Record<string, any>, meta?: Record<string, any>): RpcRequest<any, void> {
  return {
    method,
    params,
    meta,
    push: true,
  };
}
