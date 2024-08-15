import { ResultError, ResultErrorJSON } from './resultError';

export interface ResultJSON<Value> {
  isSuccess: boolean;
  error?: ResultErrorJSON;
  value?: Value;
}

export class Result<TValue = any> {
  static Success<TValue = void>(): Result<TValue>;
  static Success<TValue>(value: TValue): Result<TValue>;
  static Success<TValue>(value?: TValue): Result<TValue> {
    return new Result<TValue>(true, undefined, value);
  }

  static Failture<TValue = void>(...args: Parameters<(typeof ResultError)['create']>): Result<TValue>;
  static Failture<TValue = void>(error: ResultError): Result<TValue>;
  static Failture<TValue = void>(...args: Parameters<(typeof ResultError)['create']> | [ResultError]): Result<TValue> {
    const [arg0, message] = args;
    if (arg0 instanceof ResultError) {
      return new Result<TValue>(false, arg0);
    }
    const resultError = ResultError.create(arg0, message);
    return new Result<TValue>(false, resultError);
  }

  static fromJSON<TValue>(json: ResultJSON<TValue>): Result<TValue> {
    if (!json) return Result.Success<TValue>();

    if ((json.isSuccess ?? null) === null || ((json.error ?? null) === null && (json.value ?? null) === null)) {
      return Result.Success<TValue>(<any>json);
    }

    const resultError = !json.isSuccess ? ResultError.fromJSON(json.error) : undefined;
    return new Result(json.isSuccess, resultError, json.value);
  }

  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _error?: ResultError,
    private readonly _value?: TValue,
  ) {
    if (_isSuccess && !!_error) {
      throw new TypeError('InvalidOperationException');
    }

    if (!_isSuccess && !_error) {
      throw new TypeError('InvalidOperationException');
    }
  }

  get isSuccess() {
    return !!this._isSuccess;
  }

  get isFailture() {
    return !this._isSuccess;
  }

  public getError(): ResultError {
    if (this.isSuccess) {
      throw new TypeError('InvalidOperationException: The error of a success result can not be accessed.');
    }
    return this._error;
  }

  public getErrorAsResult(): Result<any> {
    return Result.Failture<any>(this.getError());
  }

  public getValue() {
    if (!this.isSuccess) {
      throw new TypeError('InvalidOperationException: The value of a failture result can not be accessed.');
    }
    return this._value;
  }

  toJSON(): ResultJSON<TValue> {
    return {
      isSuccess: this.isSuccess,
      error: this.isFailture ? this.getError()?.toJSON() : undefined,
      value: this.isSuccess ? this.getValue() : undefined,
    };
  }

  toString() {
    return this.isSuccess ? this.getValue() : this.getError()?.toString();
  }
}
