import { RpcClientAdapterIsInvalid, RpcClientOptionsIsInvalid } from '../exceptions';
import { RpcRequest, RpcRequestInterceptor, RpcResponse, RpcResponseInterceptor } from '../external.types';
import { createInterceptor, push, request } from '../helpers';
import { isNil, requestResolve, responseResolve } from '../utils';
import { IRpcClientAdapter } from './IRpcClientAdapter';
import { RpcError } from './RpcError';

export interface RpcClientOptions {
  adapter: IRpcClientAdapter;
}

export class RpcClient {
  private readonly adapter: IRpcClientAdapter;
  private _requestInterceptor: RpcRequestInterceptor = null;
  private _responseInterceptor: RpcResponseInterceptor = null;

  constructor(options: RpcClientOptions) {
    if (isNil(options) || typeof options !== 'object') throw new TypeError(RpcClientOptionsIsInvalid());

    if (isNil(options.adapter) || typeof options.adapter !== 'object') throw new TypeError(RpcClientAdapterIsInvalid());
    this.adapter = options.adapter;
  }

  public get requestInterceptor() {
    if (!this._requestInterceptor) this._requestInterceptor = createInterceptor();
    return this._requestInterceptor;
  }

  public get responseInterceptor() {
    if (!this._responseInterceptor) this._responseInterceptor = createInterceptor();
    return this._responseInterceptor;
  }

  public request<Result>(method: string, params: Record<string, any>, meta?: Record<string, any>) {
    return this.send(request<Result>(method, params, meta));
  }

  public push(method: string, params: Record<string, any>, meta?: Record<string, any>) {
    return this.send(push(method, params, meta));
  }

  public async send<Result>(request: RpcRequest<any, Result>): Promise<Result> {
    const rawResponse = await this.rawSend(request);

    if (request.push) return void 0;
    if (!rawResponse) throw RpcError.ParseError();

    const response = responseResolve<Result>(rawResponse);
    const interceptedResponse = await this.interceptResponse(rawResponse, response);
    if (RpcError.isExtends(interceptedResponse)) throw interceptedResponse;

    return interceptedResponse;
  }

  public async rawSend<Result>(request: RpcRequest<any, Result>): Promise<RpcResponse<Result> | void> {
    let rpcResponse: RpcResponse<Result>;
    try {
      request = requestResolve(request);
      if (!request) throw RpcError.InvalidRequest(); // Переделать на передачу объекта

      const requestIntercepted = await this.interceptRequest(request);
      if (requestIntercepted.push) return this._requestPush(requestIntercepted);

      rpcResponse = await this._requestSend(requestIntercepted);
      if (requestIntercepted.push && !rpcResponse) return void 0;

      if (!rpcResponse) throw RpcError.ParseError();
      return rpcResponse;
    } catch (err) {
      if (RpcError.isExtends(err)) {
        return Object.assign<RpcResponse<Result>, Partial<RpcResponse<Result>>>(
          {
            status: 'error',
            error: err.toJSON(),
          },
          rpcResponse
            ? {
                warnings: rpcResponse.warnings,
                meta: rpcResponse.meta,
              }
            : {},
        );
      }

      throw err;
    }
  }

  public async interceptRequest<Params, Result>(request: RpcRequest<Params, Result>) {
    const nextCallback = () => Promise.resolve(request);
    if (this._requestInterceptor) {
      request = (await this._requestInterceptor.call(request, nextCallback)) as RpcRequest<Params, Result>;
    }
    return request;
  }

  public async interceptResponse<Result>(rpcResponse: RpcResponse<Result>, response: Result | RpcError): Promise<Result | RpcError> {
    const nextCallback = () => (RpcError.isExtends(response) ? Promise.reject(response) : Promise.resolve(response));

    let _response: any = response;
    if (this._responseInterceptor) {
      _response = await this._responseInterceptor.call(rpcResponse, nextCallback);
    }
    return _response;
  }

  // Raw adapter PUSH request
  private async _requestPush<Params, Result>(request: RpcRequest<Params, Result>): Promise<void> {
    try {
      if (!isNil(this.adapter.push)) {
        await this.adapter.push(request);
      } else {
        await this._requestSend(request);
      }

      return void 0;
    } catch (err) {
      if (RpcError.isExtends(err)) throw err;
      throw RpcError.ConnectionError();
    }
  }

  // Raw adapter SEND request
  private async _requestSend<Params, Result>(request: RpcRequest<Params, Result>): Promise<RpcResponse<any>> {
    try {
      const response = await this.adapter.send(request);
      return response;
    } catch (err) {
      if (RpcError.isExtends(err)) throw err;
      throw RpcError.ConnectionError();
    }
  }
}
