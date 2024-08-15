import { RuntimeError } from '@ddd/errors';
import { RpcError } from '@packages/berish-rpc-client';

export type RpcClientErrorTrigger = {
  errors: (typeof RpcError | typeof RuntimeError)[];
  trigger: (error: RpcError | RuntimeError) => any;
};
