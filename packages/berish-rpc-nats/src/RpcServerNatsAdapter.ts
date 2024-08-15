import { IRpcServerAdapter, RpcError, RpcLogger, RpcRequest, RpcResponse, RpcServer } from '@packages/berish-rpc-server';
import * as nats from 'nats';

import { NatsConnectionFactory } from './types';

export interface RpcServerNatsAdapterOptions {
  name?: string; // nats

  namespace: string;
  connection: NatsConnectionFactory;
}

export class RpcServerNatsAdapter implements IRpcServerAdapter {
  private readonly name: string;
  private readonly connectionFactory: NatsConnectionFactory;
  private readonly namespace: string;
  private readonly codec: nats.Codec<any>;

  private rpcServer: RpcServer;
  private rpcLogger: RpcLogger;
  private connection: nats.NatsConnection;
  private subscription: nats.Subscription;

  constructor(options: RpcServerNatsAdapterOptions) {
    this.name = options?.name ?? 'nats';
    this.connectionFactory = options?.connection;
    this.namespace = options?.namespace;
    this.codec = nats.JSONCodec();
  }

  getAdapterName(): string {
    return this.name;
  }

  registerLogger(logger: RpcLogger): void {
    this.rpcLogger = logger;
  }

  registerServer(server: RpcServer): void {
    this.rpcServer = server;
  }

  async start(): Promise<void> {
    const connection = typeof this.connectionFactory === 'function' ? await this.connectionFactory() : await this.connectionFactory;
    this.connection = connection;
    this.subscription = this.subscribe();

    this.rpcLogger.log(`Connected with server '${this.connection.getServer()}'.`);
  }

  async stop(): Promise<void> {
    if (this.subscription) {
      const self_subscription = this.subscription;
      this.subscription = null;
    }

    if (this.connection) {
      const self_connection = this.connection;
      this.connection = null;

      await self_connection.close();
    }

    this.rpcLogger.log('Closed.');
  }

  private subscribe() {
    const subject = this.getSubject();

    return this.connection.subscribe(subject, {
      queue: this.namespace,
      callback: this.onRequest.bind(this),
    });
  }

  async onRequest(error: object | undefined, requestMessage: nats.Msg) {
    const rpcResponse = await this.rpcServer.wrapRequest(async () => {
      if (error) throw RpcError.ConnectionError();

      return this.deserialize(requestMessage.data);
    });

    const responseMessage = this.serialize(rpcResponse);
    requestMessage.respond(responseMessage);
  }

  private serialize(request: RpcResponse<any>) {
    return this.codec.encode(request);
  }

  private deserialize(message: Uint8Array): RpcRequest<any> {
    return this.codec.decode(message);
  }

  private getSubject() {
    return `${this.namespace}.>`;
  }
}
