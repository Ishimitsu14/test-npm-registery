import { EntityKey, ValueObjectAtomicValue } from '@ddd/domain';

export class AuthTelegramCodePK extends EntityKey {
  static create(code: string) {
    return new AuthTelegramCodePK(code);
  }

  static fromSnapshot(code: string) {
    return new AuthTelegramCodePK(code);
  }

  private readonly _code: string;

  private constructor(code: string) {
    super();
    this._code = code;
  }

  get code() {
    return this._code;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this._code];
  }
}
