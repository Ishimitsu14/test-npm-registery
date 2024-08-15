import { ModuleMetadata } from '@nestjs/common';
import { RpcClient } from '@packages/berish-rpc-client';
import { RpcClientNatsAdapter } from '@packages/berish-rpc-nats';
import { NotificationSchema } from '@schema/notification';
import { DeskGatewayConfig } from '@shared/config';

import { NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN, NOTIFICATION_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN } from '../../../Application';

export const NOTIFICATION_MANAGEMENT_COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: NOTIFICATION_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN,
    useFactory: (connection: NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN) => {
      const rpcNatsAdapter = new RpcClientNatsAdapter({ connection, remoteNamespace: DeskGatewayConfig.messageBus.notificationManagementNamespace });
      const client = new RpcClient({ adapter: rpcNatsAdapter });
      const notificationManagementClient = new NotificationSchema.RPC.Client(client, {});

      return notificationManagementClient;
    },
    inject: [NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN],
  },
];
