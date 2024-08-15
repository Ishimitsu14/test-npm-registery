export interface IHashStringHelper {
  getHex(value: CryptoJS.lib.WordArray): string;
  getSignatureHash(value: string, key: string | CryptoJS.lib.WordArray): CryptoJS.lib.WordArray;
  verifyTwoHash(hashString: string, verifiedString: string): boolean;
}
