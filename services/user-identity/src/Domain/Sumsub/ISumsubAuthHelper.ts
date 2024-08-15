import { RawAxiosRequestHeaders } from 'axios';

export interface IGetSignatureParams {
  url: string;
  method: string;
  timestamp: number;
  body: Record<string, string>;
}

export interface IBuildHeadersParams {
  signature: string;
  timestamp: number;
}

export interface ISumsubHeaders extends RawAxiosRequestHeaders {
  'X-App-Token': string;
  'X-App-Access-Sig': string;
  'X-App-Access-Ts': number;
  Accept: string;
  'Content-Type': string;
}

export interface ISumsubAuthHelper {
  generateSignature(params: IGetSignatureParams): string;
  generateTimestamp(): number;
  buildHeaders(params: IBuildHeadersParams): ISumsubHeaders;
}
