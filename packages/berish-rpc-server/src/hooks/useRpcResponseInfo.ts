import { useContext } from '@packages/berish-context';

import { RpcResponseInfo, RpcResponseInfoContext } from '../core';

export function useRpcResponseInfo(): RpcResponseInfo {
  return useContext(RpcResponseInfoContext);
}
