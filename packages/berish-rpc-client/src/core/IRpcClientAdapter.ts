import { RpcRequest, RpcResponse } from '../external.types';

export interface IRpcClientAdapter {
  start?(): Promise<void>;
  send(request: RpcRequest): Promise<RpcResponse<any>>;
  push?(request: RpcRequest): Promise<void>;
}
