import { RpcRequestParser } from '../external.types';

export function concatBody(requestParser: RpcRequestParser, body: any[]) {
  return body
    .filter(Boolean)
    .map((item) => (requestParser ? requestParser(item) : item))
    .filter((m) => typeof m === 'object')
    .reduce((a, b) => Object.assign(a, b), {});
}
