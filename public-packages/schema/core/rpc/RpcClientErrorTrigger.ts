import { RuntimeError } from '@ishimitsu-org/ddd/errors';
import { RpcError } from '@ishimitsu-org/rpc-client';

export type RpcClientErrorTrigger = {
  errors: (typeof RpcError | typeof RuntimeError)[];
  trigger: (error: RpcError | RuntimeError) => any;
};
