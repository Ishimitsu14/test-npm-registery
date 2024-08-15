import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

export class UserNickname extends ValueObject {
  static raw(nickname: string) {
    return new UserNickname(nickname);
  }

  private constructor(readonly value: string) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.value];
  }
}
