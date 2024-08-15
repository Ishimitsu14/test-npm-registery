import { RpcServer } from './RpcServer';

export interface RpcLogger {
  log(message: any): any;
}

export interface IRpcServerAdapter {
  registerServer(server: RpcServer): void;
  registerLogger(logger: RpcLogger): void;
  getAdapterName(): string;

  start(): Promise<void>;
  stop(): Promise<void>;
}
