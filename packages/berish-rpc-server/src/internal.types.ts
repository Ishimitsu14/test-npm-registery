import type { RpcRequestInfo } from './core';

export type RpcResponseResultFunction = () => Promise<any>;

export interface RpcResult {
  manager: RpcRequestInfo;

  isFailed: boolean;
  data: any;
}
