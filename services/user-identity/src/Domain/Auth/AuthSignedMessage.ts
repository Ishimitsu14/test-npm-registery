import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import { AuthEvmMessageSignatureInvalidError } from '@schema/common';

import { AuthGeneratedMessage } from './AuthGeneratedMessage';
import { IEvmAuthHelper } from './IEvmAuthHelper';

export class AuthSignedMessage extends ValueObject {
  static async fromGeneratedMessage(helper: IEvmAuthHelper, message: AuthGeneratedMessage, signature: string) {
    const isVerified = await helper.verifySiweMessage(message.toSiweMessage(), signature);
    if (!isVerified) throw new AuthEvmMessageSignatureInvalidError();

    return new AuthSignedMessage(message, signature);
  }

  private readonly _message: AuthGeneratedMessage;
  private readonly _signature: string;

  private constructor(message: AuthGeneratedMessage, signature: string) {
    super();
    this._message = message;
    this._signature = signature;
  }

  get message() {
    return this._message;
  }

  get signature() {
    return this._signature;
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this._message, this._signature];
  }
}
