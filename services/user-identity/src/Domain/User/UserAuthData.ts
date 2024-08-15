import { Nullable } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import { EvmPublicAddress } from '@shared/common-internal';

export class UserAuthData extends ValueObject {
  static create(address: Nullable<EvmPublicAddress>) {
    return new UserAuthData(address);
  }

  static fromSnapshot(address: Nullable<EvmPublicAddress>) {
    return new UserAuthData(address);
  }

  private readonly _address: Nullable<EvmPublicAddress>;

  private constructor(address: Nullable<EvmPublicAddress>) {
    super();

    this._address = address;
  }

  get address() {
    return this._address;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this._address];
  }
}
