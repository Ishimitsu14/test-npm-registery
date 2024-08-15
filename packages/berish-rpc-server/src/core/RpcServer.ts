import { runAll } from '@packages/berish-context';
import { RpcError, RpcRequest, RpcResponse, Utils } from '@packages/berish-rpc-client';

import { RpcHandler } from '../external.types';
import { emptyNextFunction } from '../utils';
import { IRpcServerAdapter, RpcLogger } from './IRpcServerAdapter';
import { RpcRequestInfoContext, RpcResponseInfoContext } from './RpcContext';
import { RpcRequestInfo } from './RpcRequestInfo';
import { RpcResponseInfo } from './RpcResponseInfo';
import { RpcResponseResult } from './RpcResponseResult';

export interface RpcServerOptions {
  debug?: boolean;
}

export class RpcServer {
  private _options: RpcServerOptions = null;
  private _handler: RpcHandler = null;

  constructor(handler: RpcHandler, options: RpcServerOptions) {
    this._options = options;
    this._handler = handler;
  }

  registerAdapter(adapter: IRpcServerAdapter, logger?: RpcLogger) {
    adapter.registerServer(this);
    adapter.registerLogger(
      logger ?? {
        log: (message) => console.log(message),
      },
    );
  }

  async wrapRequest<T>(requestCallback: () => Promise<RpcRequest<any, T>>): Promise<RpcResponse<T>> {
    const responseResult = await this.runRequestWithResponseResult(requestCallback);
    return this.resolveRpcResponseResult(responseResult);
  }

  /**
   * Запускает новый запрос относительно RpcRequest и возвращает RpcResponse
   */
  async runRequest<T>(request: RpcRequest<any, T>): Promise<RpcResponse<T>> {
    return this.wrapRequest(async () => request);
  }

  /**
   * Запускает новый запрос относительно RpcRequest и возвращает RpcResponseResult
   * @param request
   * @returns
   */
  async runRequestWithResponseResult<T>(requestCallback: () => Promise<RpcRequest<any, T>>): Promise<RpcResponseResult<T>> {
    const responseInfo = new RpcResponseInfo({
      server: this,
    });

    try {
      // Получаем полный объект запроса
      const request = await requestCallback();
      const requestInfo = this.resolveRpcRequestInfo(request);
      if (RpcError.isExtends(requestInfo)) throw requestInfo;

      const responseResult = await this.runRequestByInfo(requestInfo, responseInfo);

      return responseResult;
    } catch (err) {
      return new RpcResponseResult(responseInfo, 'error', this.resolveError(err));
    }
  }

  /**
   * Запускает настоящий запрос
   * @param requestInfo
   * @param responseInfo
   * @returns
   */
  private async runRequestByInfo<T>(requestInfo: RpcRequestInfo, responseInfo: RpcResponseInfo): Promise<RpcResponseResult> {
    let responseResult: RpcResponseResult;
    try {
      const result: T = await runAll(async () => this._handler(emptyNextFunction), RpcRequestInfoContext.createContextData(requestInfo), RpcResponseInfoContext.createContextData(responseInfo));
      if (RpcError.isExtends(result) || result instanceof Error) throw result;

      responseResult = new RpcResponseResult(responseInfo, 'success', result);
    } catch (err) {
      responseResult = new RpcResponseResult(responseInfo, 'error', this.resolveError(err));
    }

    return responseResult;
  }

  /**
   * Возвращает RpcRequestInfo или RpcError после попытки парсинга запроса (RpcRequest)
   * @param request
   * @returns
   */
  private resolveRpcRequestInfo<Params>(request: RpcRequest<Params>): RpcRequestInfo<Params> | RpcError {
    try {
      request = Utils.requestResolve(request);
      if (!request) return RpcError.InvalidRequest();

      const requestInfo = new RpcRequestInfo({
        request,
        server: this,
      });

      return requestInfo;
    } catch (err) {
      if (RpcError.isExtends(err)) return err;
      return RpcError.InvalidRequest();
    }
  }

  /**
   * Возвращает RpcResponse из RpcResponseResult
   * @param responseResult
   * @returns
   */
  private resolveRpcResponseResult<T>(responseResult: RpcResponseResult<T>): RpcResponse<T> {
    const baseResponse: RpcResponse<T> = {
      status: responseResult.status,
    };

    if (responseResult.warnings.length > 0) baseResponse.warnings = responseResult.warnings;
    if (Object.keys(responseResult.meta).length > 0) baseResponse.meta = responseResult.meta;
    if (responseResult.status === 'error') {
      return {
        ...baseResponse,
        error: responseResult.error.toJSON(),
      };
    }
    return {
      ...baseResponse,
      result: responseResult.result,
    };
  }

  /**
   * Обработка ошибки. Возвращает строго RpcError
   * @param error
   * @returns
   */
  private resolveError(error: any) {
    if (RpcError.isExtends(error)) return error;
    return RpcError.InternalError();
  }
}
