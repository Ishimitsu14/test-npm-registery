import { RpcRequest } from '@packages/berish-rpc-client';

import { RpcServer } from './RpcServer';

export interface RpcRequestInfoOptions<Params extends Record<string, any>> {
  request: RpcRequest<Params>;
  server: RpcServer;
}

export class RpcRequestInfo<Params extends Record<string, any> = Record<string, any>> {
  private readonly _request: Readonly<RpcRequest<Params>>;
  private readonly _server: RpcServer;

  constructor(options: RpcRequestInfoOptions<Params>) {
    this._request = Object.freeze(Object.assign({}, options.request));
    this._server = options.server;
  }

  get server() {
    return this._server;
  }

  get method() {
    return this._request.method;
  }

  get params() {
    return this._request.params || <Params>{};
  }

  get meta() {
    return this._request.meta || {};
  }

  get isPush() {
    return !!this._request.push;
  }
}
