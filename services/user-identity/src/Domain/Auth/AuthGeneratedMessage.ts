import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';
import { AuthEvmMessageIsExpiredError, AuthEvmMessageIsInvalidError, AuthEvmMessageSignatureInvalidError } from '@schema/common';
import { EvmPublicAddress } from '@shared/common-internal';

import { AuthNonce } from './AuthNonce';
import { AuthSiweMessage, IEvmAuthHelper } from './IEvmAuthHelper';
import { URI } from './URI';
import { URIDomain } from './URIDomain';

export class AuthGeneratedMessage extends ValueObject {
  static generate(helper: IEvmAuthHelper, domain: URIDomain, uri: URI, address: EvmPublicAddress) {
    const nonce = AuthNonce.generate(helper);
    const issuedAt = new Date();
    const signatureHash = this.getSignatureHash(helper, domain, uri, address, nonce, issuedAt);

    return new AuthGeneratedMessage(domain, uri, address, nonce, issuedAt, signatureHash);
  }

  static async parse(helper: IEvmAuthHelper, siweMessageStringify: string, signatureHash: string) {
    const siweMessage = helper.parseSiweMessage(siweMessageStringify);
    if (siweMessage === 'INVALID_MESSAGE') throw new AuthEvmMessageIsInvalidError();
    if (siweMessage === 'EXPIRED') throw new AuthEvmMessageIsExpiredError();

    const domain = URIDomain.raw(siweMessage.domain);
    const uri = URI.raw(siweMessage.uri);
    const address = EvmPublicAddress.raw(siweMessage.address);
    const nonce = AuthNonce.raw(siweMessage.nonce);
    const issuedAt = siweMessage.issuedAt;

    const signatureHashLocal = this.getSignatureHash(helper, domain, uri, address, nonce, siweMessage.issuedAt);
    if (signatureHashLocal !== signatureHash) throw new AuthEvmMessageSignatureInvalidError();

    return new AuthGeneratedMessage(domain, uri, address, nonce, issuedAt, signatureHashLocal);
  }

  private static getSignatureHash(helper: IEvmAuthHelper, domain: URIDomain, uri: URI, address: EvmPublicAddress, nonce: AuthNonce, issuedAt: Date) {
    return helper.getSignatureHash([domain.value, uri.value, address.value, nonce.value, String(+issuedAt)]);
  }

  private readonly _domain: URIDomain;
  private readonly _uri: URI;
  private readonly _address: EvmPublicAddress;
  private readonly _nonce: AuthNonce;
  private readonly _issuedAt: Date;
  private readonly _signatureHash: string;

  private constructor(domain: URIDomain, uri: URI, address: EvmPublicAddress, nonce: AuthNonce, issuedAt: Date, signatureHash: string) {
    super();

    this._domain = domain;
    this._uri = uri;
    this._address = address;
    this._nonce = nonce;
    this._issuedAt = issuedAt;
    this._signatureHash = signatureHash;
  }

  get domain() {
    return this._domain;
  }

  get uri() {
    return this._uri;
  }

  get address() {
    return this._address;
  }

  get nonce() {
    return this._nonce;
  }

  get issuedAt() {
    return this._issuedAt;
  }

  get signatureHash() {
    return this._signatureHash;
  }

  toSiweMessage(): AuthSiweMessage {
    return {
      domain: this._domain.value,
      uri: this._uri.value,
      address: this._address.value,
      nonce: this._nonce.value,
      issuedAt: this._issuedAt,
    };
  }

  toSiweMessageStringify(helper: IEvmAuthHelper): string {
    return helper.createSiweMessage(this.toSiweMessage());
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this._domain, this._uri, this._address, this._nonce, this._issuedAt, this._signatureHash];
  }
}
