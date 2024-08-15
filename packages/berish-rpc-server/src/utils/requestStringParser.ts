import { RpcError } from '@packages/berish-rpc-client';

export function requestStringParser(body: any) {
  try {
    if (typeof body === 'string') return JSON.parse(body);
    return body;
  } catch (err) {
    throw RpcError.ParseError();
  }
}
