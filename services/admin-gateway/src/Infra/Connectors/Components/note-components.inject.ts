import { ModuleMetadata } from '@nestjs/common';
import { RpcClient } from '@packages/berish-rpc-client';
import { RpcClientNatsAdapter } from '@packages/berish-rpc-nats';
import { NoteSchema } from '@schema/note';
import { AdminGatewayConfig } from '@shared/config';

import { NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN, NOTE_RPC_COMPONENT_INJECT_TOKEN } from '../../../Application';

export const NOTE_COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: NOTE_RPC_COMPONENT_INJECT_TOKEN,
    useFactory: (connection: NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN) => {
      const rpcNatsAdapter = new RpcClientNatsAdapter({ connection, remoteNamespace: AdminGatewayConfig.messageBus.noteNamespace });
      const client = new RpcClient({ adapter: rpcNatsAdapter });
      const noteClient = new NoteSchema.RPC.Client(client, {});

      return noteClient;
    },
    inject: [NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN],
  },
];
