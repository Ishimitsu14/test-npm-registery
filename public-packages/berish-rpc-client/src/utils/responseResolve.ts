import { RpcError } from '../core';
import { RpcResponse } from '../external.types';

export function responseResolve<Result>(data: RpcResponse<Result> | RpcError): Result | RpcError {
  if (RpcError.isExtends(data)) return data;

  try {
    if (data.error) return RpcError.fromJSON(data.error);
    return data.result;
  } catch (err) {
    if (err instanceof RpcError) return err;
    return RpcError.ParseError();
  }
}
