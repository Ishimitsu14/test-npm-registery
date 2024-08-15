import { ModuleMetadata } from '@nestjs/common';
import { RpcClient } from '@packages/berish-rpc-client';

export const RPC_CLIENT_INJECT: ModuleMetadata['providers'] = [
  {
    provide: RpcClient,
    useFactory: () => {
      const client = new RpcClient(null);

      return null;
    },
  },
];
