import { RpcRequest } from '../external.types';
import { isNil } from './isNil';

export function requestResolve<Params, Result>(value: RpcRequest<Params, Result>): RpcRequest<Params, Result> {
  if (isNil(value) || typeof value !== 'object') return null;

  if (!isNil(value.method) && typeof value.method !== 'string') return null;
  if (!isNil(value.meta) && (typeof value.meta !== 'object' || Array.isArray(value.meta))) return null;
  if (!isNil(value.params) && (typeof value.params !== 'object' || Array.isArray(value.params))) return null;
  if (!isNil(value.push) && typeof value.push !== 'boolean') return null;

  return {
    method: value.method,
    meta: value.meta || {},
    params: value.params || ({} as any),
    push: !!value.push,
  };
}
