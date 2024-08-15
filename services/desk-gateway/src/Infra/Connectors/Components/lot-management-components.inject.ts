import { ModuleMetadata } from '@nestjs/common';
import { RpcClient } from '@packages/berish-rpc-client';
import { RpcClientNatsAdapter } from '@packages/berish-rpc-nats';
import { LotManagementSchema } from '@schema/lot-management';
import { DeskGatewayConfig } from '@shared/config';

import { LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN, NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN } from '../../../Application';

export const LOT_MANAGEMENT_COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: LOT_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN,
    useFactory: (connection: NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN) => {
      const rpcNatsAdapter = new RpcClientNatsAdapter({ connection, remoteNamespace: DeskGatewayConfig.messageBus.lotManagementNamespace });
      const client = new RpcClient({ adapter: rpcNatsAdapter });
      const userIdentityClient = new LotManagementSchema.RPC.Client(client, {});

      return userIdentityClient;
    },
    inject: [NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN],
  },
];
