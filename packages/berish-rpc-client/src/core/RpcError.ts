import { RpcResponseError } from '../external.types';

export class RpcError extends Error {
  public readonly name: string = null;
  public readonly data: { [key: string]: any } = null;

  static readonly SystemList = ['ConnectionError', 'InternalError', 'ParseError', 'InvalidRequest', 'MethodNotFound'] as const;

  static isExtends(error: any): error is RpcError {
    return error instanceof RpcError;
  }

  static isErrorName(error: any, name: string) {
    if (!RpcError.isExtends(error)) return false;
    if (error.name === name) return true;
    return false;
  }

  static Custom(name: string, message: string, data?: { [key: string]: any }) {
    return new RpcError(name, message, data);
  }

  static ConnectionError() {
    return RpcError.Custom('ConnectionError', 'Connection problem.');
  }

  static InternalError() {
    return RpcError.Custom('InternalError', 'Internal RPC error.');
  }

  static ParseError() {
    return RpcError.Custom('ParseError', 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text');
  }

  static InvalidRequest() {
    return RpcError.Custom('InvalidRequest', 'The JSON sent is not a valid Request object');
  }

  static MethodNotFound(method?: string) {
    if ((method ?? null) !== null) {
      return RpcError.Custom('MethodNotFound', `The method '${String(method)}' does not exist / is not available`);
    }
    return RpcError.Custom('MethodNotFound', 'The method does not exist / is not available');
  }

  static fromJSON(json: RpcResponseError) {
    if (!json) return null;
    const err = new RpcError(json.name, json.message, json.data);
    delete err.stack;
    return err;
  }

  constructor(name: string, message: string, data?: { [key: string]: any }) {
    super();

    this.name = name;
    this.message = message;
    this.data = data;
  }

  public get<T>(key: string): T {
    return this.data[key];
  }

  public toJSON(): RpcResponseError {
    return { name: this.name, message: this.message, data: this.data };
  }
}
