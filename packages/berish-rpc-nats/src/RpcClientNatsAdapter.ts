import { IRpcClientAdapter, RpcRequest, RpcResponse } from '@packages/berish-rpc-client';
import * as nats from 'nats';

import { NatsConnectionFactory } from './types';

export interface RpcClientNatsAdapterOptions {
  connection: NatsConnectionFactory;
  remoteNamespace: string;
}

export class RpcClientNatsAdapter implements IRpcClientAdapter {
  private readonly connectionFactory: NatsConnectionFactory;
  private readonly namespace: string;
  private readonly codec: nats.Codec<any>;

  private _connectionPromise: Promise<nats.NatsConnection>;

  constructor(options: RpcClientNatsAdapterOptions) {
    this.connectionFactory = options.connection;
    this.namespace = options.remoteNamespace;
    this.codec = nats.JSONCodec();
  }

  async send(request: RpcRequest<Record<string, any>, any>): Promise<RpcResponse<any>> {
    const subject = this.getSubject(request);
    const payload = this.serialize(request);

    const connection = await this.connection;
    // TODO пофиксить timeout
    const responseMessage = await connection.request(subject, payload, { timeout: 100000 });
    const responsePayload = this.deserialize(responseMessage.data);

    return responsePayload;
  }

  async push(request: RpcRequest<Record<string, any>, any>): Promise<void> {
    const subject = this.getSubject(request);
    const payload = this.serialize(request);

    const connection = await this.connection;
    connection.publish(subject, payload);
  }

  private get connection() {
    if (!this._connectionPromise) {
      this._connectionPromise = Promise.resolve().then(() => (typeof this.connectionFactory === 'function' ? this.connectionFactory() : this.connectionFactory));
    }
    return this._connectionPromise;
  }

  private serialize(request: RpcRequest) {
    return this.codec.encode(request);
  }

  private deserialize(message: Uint8Array): RpcResponse<any> {
    return this.codec.decode(message);
  }

  private getSubject(request: RpcRequest) {
    return `${this.namespace}.${request.method}`;
  }
}
