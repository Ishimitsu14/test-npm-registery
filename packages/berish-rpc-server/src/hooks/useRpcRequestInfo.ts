import { useContext } from '@packages/berish-context';

import { RpcRequestInfo, RpcRequestInfoContext } from '../core';

export function useRpcRequestInfo<Params extends Record<string, any> = any>(): RpcRequestInfo<Params> {
  return useContext(RpcRequestInfoContext) as RpcRequestInfo<Params>;
}
