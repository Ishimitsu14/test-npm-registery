import { ModuleMetadata } from '@nestjs/common';
import { RpcClient } from '@packages/berish-rpc-client';
import { RpcClientNatsAdapter } from '@packages/berish-rpc-nats';
import { NotificationSchema } from '@schema/notification';
import { DeskGatewayConfig } from '@shared/config';

import { FEEDBACK_RPC_COMPONENT_INJECT_TOKEN, NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN } from '../../../Application';

export const FEEDBACK_COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: FEEDBACK_RPC_COMPONENT_INJECT_TOKEN,
    useFactory: (connection: NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN) => {
      const rpcNatsAdapter = new RpcClientNatsAdapter({ connection, remoteNamespace: DeskGatewayConfig.messageBus.feedbackNamespace });
      const client = new RpcClient({ adapter: rpcNatsAdapter });
      const feedbackClient = new NotificationSchema.RPC.Client(client, {});

      return feedbackClient;
    },
    inject: [NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN],
  },
];
