import { ModuleMetadata } from '@nestjs/common';
import { RpcClient } from '@packages/berish-rpc-client';
import { RpcClientNatsAdapter } from '@packages/berish-rpc-nats';
import { UserIdentitySchema } from '@schema/user-identity';
import { AdminGatewayConfig } from '@shared/config';

import { NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN, USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN } from '../../../Application';

export const USER_IDENTITY_COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: USER_IDENTITY_RPC_COMPONENT_INJECT_TOKEN,
    useFactory: (connection: NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN) => {
      const rpcNatsAdapter = new RpcClientNatsAdapter({ connection, remoteNamespace: AdminGatewayConfig.messageBus.userIdentityNamespace });
      const client = new RpcClient({ adapter: rpcNatsAdapter });
      const userIdentityClient = new UserIdentitySchema.RPC.Client(client, {});

      return userIdentityClient;
    },
    inject: [NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN],
  },
];
