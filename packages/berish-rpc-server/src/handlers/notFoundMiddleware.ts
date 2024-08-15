import { RpcError } from '@packages/berish-rpc-client';

import { RpcHandler } from '../external.types';
import { useRpcRequestInfo } from '../hooks';

export function notFoundMiddleware(error?: RpcError): RpcHandler {
  return () => {
    const request = useRpcRequestInfo();

    error = error || RpcError.MethodNotFound(request.method);
    throw error;
  };
}
