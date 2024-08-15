import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

export class UserVerification extends ValueObject {
  static raw(isVerified: boolean) {
    return new UserVerification(isVerified);
  }

  static fromSnapshot(isVerified: boolean) {
    return new UserVerification(isVerified);
  }

  private readonly _isVerified: boolean;

  private constructor(isVerified: boolean) {
    super();

    this._isVerified = isVerified;
  }

  get isVerified() {
    return this._isVerified;
  }

  setIsVerified(isVerified: boolean) {
    return UserVerification.raw(isVerified);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this._isVerified];
  }
}
