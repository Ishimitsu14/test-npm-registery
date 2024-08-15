import { Router } from '@packages/berish-rpc-router';
import { IRpcServerAdapter, RpcServer } from '@packages/berish-rpc-server';

export interface NestRpcControllerOptions {
  namespace?: string;
}

export interface NestRpcMethodOptions {
  propertyName: string | symbol;
  methodName: string;
  methodFunc: (...args: any[]) => any;
}

export interface NestSetupPayload {
  rpcServer: RpcServer;
  router: Router;
  adapters: IRpcServerAdapter[];
}
