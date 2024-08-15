import { ModuleMetadata } from '@nestjs/common';
import { RpcClient } from '@packages/berish-rpc-client';
import { RpcClientNatsAdapter } from '@packages/berish-rpc-nats';
import { NotificationSchema } from '@schema/notification';
import { LotManagementConfig } from '@shared/config';

import { NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN, NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN } from '../../../Application';

export const NOTIFICATION_COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: NOTIFICATION_RPC_COMPONENT_INJECT_TOKEN,
    useFactory: (connection: NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN) => {
      const rpcNatsAdapter = new RpcClientNatsAdapter({ connection, remoteNamespace: LotManagementConfig.messageBus.notificationNamespace });
      const client = new RpcClient({ adapter: rpcNatsAdapter });
      const notificationClient = new NotificationSchema.RPC.Client(client, {});

      return notificationClient;
    },
    inject: [NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN],
  },
];
