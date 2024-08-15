import { UserIdentityConfig } from '@shared/config';
import { enc, HmacSHA256 } from 'crypto-js';
import * as siwe from 'siwe';

import { AuthNonce, AuthSiweMessage, AuthSiweParseError, IEvmAuthHelper } from '../../Domain';

export class EvmAuthHelper implements IEvmAuthHelper {
  generateNonce(): AuthNonce {
    return AuthNonce.raw(siwe.generateNonce());
  }

  getSignatureHash(parts: string[]): string {
    return HmacSHA256(parts.join('-_-'), UserIdentityConfig.auth.serverPrivateKey).toString(enc.Hex);
  }

  createSiweMessage(message: AuthSiweMessage): string {
    const siweMessage = this._createSiweMessage(message);

    return siweMessage.prepareMessage();
  }

  parseSiweMessage(message: string): AuthSiweMessage | AuthSiweParseError {
    try {
      const siweMessage = new siwe.SiweMessage(message);

      if (siweMessage.statement !== UserIdentityConfig.auth.siweStatement) return 'INVALID_MESSAGE';

      const issuedAt = new Date(siweMessage.issuedAt);
      if (+issuedAt > Date.now()) return 'INVALID_MESSAGE';
      if (+issuedAt + UserIdentityConfig.auth.siweLifetimeMS < Date.now()) return 'EXPIRED';

      return {
        domain: siweMessage.domain,
        uri: siweMessage.uri,
        address: siweMessage.address,
        issuedAt,
        nonce: siweMessage.nonce,
      };
    } catch (err) {
      return 'INVALID_MESSAGE';
    }
  }

  async verifySiweMessage(message: AuthSiweMessage, signature: string): Promise<boolean> {
    try {
      const siweMessage = this._createSiweMessage(message);
      const data = await siweMessage.verify({ signature }, { suppressExceptions: true });

      return data.success;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  private _createSiweMessage(message: AuthSiweMessage) {
    return new siwe.SiweMessage({
      version: '1',
      chainId: 1,
      domain: message.domain,
      uri: message.uri,
      address: message.address,
      issuedAt: message.issuedAt.toISOString(),
      nonce: message.nonce,
      statement: UserIdentityConfig.auth.siweStatement,
    });
  }
  // generateExpiresAt(): Date {
  //   return new Date(+new Date() + UserIdentityConfig.auth.messageLifetimeMS);
  // }
  // generateSiweMessage(signatureMessage: ISignatureMessage): string {
  //   return this.getSiweMessage(signatureMessage).prepareMessage();
  // }
  // parseSignatureMessage(message: string): ISignatureMessage | NullableObject {
  //   try {
  //     const siweMessage = new SiweMessage(message);
  //     return {
  //       publicAddress: siweMessage.address,
  //       nonce: siweMessage.nonce,
  //       expiresAt: new Date(siweMessage.expirationTime),
  //     };
  //   } catch (err) {
  //     return NullableObject;
  //   }
  // }
  // async verifySignature(signatureMessage: ISignatureMessage, signature: string): Promise<boolean> {
  //   try {
  //     const siweMessage = this.getSiweMessage(signatureMessage);
  //     console.log({ siweMessage });
  //     const verifyResult = await siweMessage.verify({ signature });
  //     console.log({ verifyResult });
  //     return verifyResult.success;
  //   } catch (err) {
  //     console.log({ err });
  //     return false;
  //   }
  // }
  // isMessageExpires(signatureMessage: ISignatureMessage): boolean {
  //   return +signatureMessage.expiresAt < +new Date();
  // }
  // generateNonce(): string {
  //   return generateNonce();
  // }
  // getSignatureServerSide(message: string): string {
  //   return HmacSHA256(message, UserIdentityConfig.auth.serverPrivateKey).toString();
  // }
  // private getSiweMessage(signatureMessage: ISignatureMessage): SiweMessage {
  //   return new SiweMessage({
  //     domain: UserIdentityConfig.auth.siwe.domain,
  //     uri: UserIdentityConfig.auth.siwe.uri,
  //     address: signatureMessage.publicAddress,
  //     expirationTime: signatureMessage.expiresAt.toISOString(),
  //     version: '1',
  //     nonce: signatureMessage.nonce,
  //     chainId: 1,
  //     statement: UserIdentityConfig.auth.siwe.statement,
  //   });
  // }
}
