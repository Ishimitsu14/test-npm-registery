import { RpcError, RpcResponseStatus } from '@packages/berish-rpc-client';

import { RpcResponseInfo } from './RpcResponseInfo';

export class RpcResponseResult<T = unknown> {
  private readonly _status: RpcResponseStatus;
  private readonly _warnings: string[];
  private readonly _meta: Record<string, any>;
  private readonly _result: any;
  private readonly _error: RpcError;

  constructor(responseInfo: RpcResponseInfo, status: RpcResponseStatus, data: T | RpcError) {
    this._status = status;
    this._warnings = responseInfo.warnings;
    this._meta = responseInfo.getMeta(status);
    this._result = status === 'success' ? data : void 0;
    this._error = status === 'error' ? (RpcError.isExtends(data) ? data : RpcError.InternalError()) : void 0;
  }

  get status() {
    return this._status;
  }

  get warnings() {
    return this._warnings;
  }

  get meta() {
    return this._meta;
  }

  get result() {
    return this._result;
  }

  get error() {
    return this._error;
  }
}
