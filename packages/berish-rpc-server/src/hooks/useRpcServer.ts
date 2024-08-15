import { RpcServer } from '../core';
import { useRpcRequestInfo } from './useRpcRequestInfo';

export function useRpcServer(): RpcServer {
  return useRpcRequestInfo().server;
}
