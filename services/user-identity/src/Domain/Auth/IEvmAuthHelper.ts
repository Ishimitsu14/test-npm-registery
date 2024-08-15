import { AuthNonce } from './AuthNonce';

export interface AuthSiweMessage {
  domain: string;
  uri: string;
  nonce: string;
  address: string;
  issuedAt: Date;
}

export type AuthSiweParseError = 'INVALID_MESSAGE' | 'EXPIRED';

export interface IEvmAuthHelper {
  generateNonce(): AuthNonce;
  getSignatureHash(parts: string[]): string;

  createSiweMessage(message: AuthSiweMessage): string;
  parseSiweMessage(message: string): AuthSiweMessage | AuthSiweParseError;
  verifySiweMessage(message: AuthSiweMessage, signature: string): Promise<boolean>;

  // getSignatureServerSide(nonce: string): string;
  // generateSiweMessage(signatureMessage: ISignatureMessage): string;
  // parseSignatureMessage(message: string): ISignatureMessage | NullableObject;
  // verifySignature(signatureMessage: ISignatureMessage, signature: string): Promise<boolean>;
  // isMessageExpires(signatureMessage: ISignatureMessage): boolean;
}
