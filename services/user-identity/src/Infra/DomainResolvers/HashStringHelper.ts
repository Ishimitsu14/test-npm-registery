import { enc, HmacSHA256 } from 'crypto-js';

import { IHashStringHelper } from '../../Domain';

export class HashStringHelper implements IHashStringHelper {
  getHex(value: CryptoJS.lib.WordArray): string {
    return value.toString(enc.Hex);
  }

  getSignatureHash(value: string, key: string | CryptoJS.lib.WordArray): CryptoJS.lib.WordArray {
    return HmacSHA256(value, key);
  }

  verifyTwoHash(hashString: string, verifiedString: string): boolean {
    return hashString === verifiedString;
  }
}
