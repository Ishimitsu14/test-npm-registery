import { Equatable } from '../../core';

export interface ResultErrorJSON {
  code: string;
  message: string;
}

export class ResultError extends Error implements Equatable<ResultError> {
  static create(code: string, message: string) {
    return new ResultError(code, message);
  }

  static fromJSON(json: ResultErrorJSON): ResultError {
    return new ResultError(json?.code, json?.message);
  }

  static isEquals(a?: ResultError, b?: ResultError): boolean {
    if (a === null && b === null) {
      return true;
    }

    if (a === null || b === null) {
      return false;
    }

    if (a.code !== b.code) {
      return false;
    }

    if (a.message !== b.message) {
      return false;
    }

    return true;
  }

  private constructor(
    public readonly code: string,
    public readonly message: string,
  ) {
    super(`[${code}]: ${message}`);
    Error.captureStackTrace(this, ResultError);
  }
  isEquals(other: ResultError): boolean {
    return ResultError.isEquals(this, other);
  }

  toJSON(): ResultErrorJSON {
    return {
      code: this.code,
      message: this.message,
    };
  }

  toString() {
    return this.code;
  }
}
