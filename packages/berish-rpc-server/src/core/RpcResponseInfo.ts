import { RpcResponseStatus } from '@packages/berish-rpc-client';

import { RpcServer } from './RpcServer';

export interface RpcResponseInfoOptions {
  server: RpcServer;
}

export class RpcResponseInfo {
  private readonly _server: RpcServer;

  private _warnings: string[] = [];
  private _metaSuccess: Record<string, any> = {};
  private _metaError: Record<string, any> = {};

  constructor(options: RpcResponseInfoOptions) {
    this._server = options.server;
  }

  get server() {
    return this._server;
  }

  get warnings() {
    return this._warnings;
  }

  addWarning(message: string) {
    this._warnings.push(message);
  }

  getWarnings() {
    return this._warnings.slice();
  }

  getMeta(type: RpcResponseStatus) {
    if (type === 'error') return this._metaError;
    else if (type === 'success') return this._metaSuccess;

    throw new TypeError(`${RpcResponseInfo.name}: getResponseMeta argument 'type' has incorrect value: ${type}`);
  }

  getMetaByKey(key: string, type: RpcResponseStatus) {
    if (type === 'success') {
      return this._metaSuccess[key];
    } else if (type === 'error') {
      return this._metaError[key];
    }
    throw new TypeError(`${RpcResponseInfo.name}: getResponseMetaValue argument 'type' has incorrect value: ${type}`);
  }

  setMetaByKey<Meta extends Record<string, any>>(key: keyof Meta & string, value: Meta[typeof key], type: 'all' | RpcResponseStatus = 'all') {
    if (type === 'success') {
      this._metaSuccess[key] = value;
    } else if (type === 'error') {
      this._metaError[key] = value;
    } else if (type === 'all') {
      this._metaSuccess[key] = value;
      this._metaError[key] = value;
    }
  }
}
