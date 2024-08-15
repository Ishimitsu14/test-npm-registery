import { Primitive, ValueObjectAtomicValue } from '@ddd/domain';

import { IEvmAuthHelper } from './IEvmAuthHelper';

export class AuthNonce extends Primitive {
  static raw(value: string) {
    return new AuthNonce(value);
  }

  static generate(helper: IEvmAuthHelper) {
    return helper.generateNonce();
  }

  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  get value() {
    return this._value;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this._value];
  }
}
