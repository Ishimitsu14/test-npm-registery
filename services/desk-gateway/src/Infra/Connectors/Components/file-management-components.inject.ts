import { ModuleMetadata } from '@nestjs/common';
import { RpcClient } from '@packages/berish-rpc-client';
import { RpcClientNatsAdapter } from '@packages/berish-rpc-nats';
import { FileManagementSchema } from '@schema/file-management';
import { DeskGatewayConfig } from '@shared/config';

import { FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN, NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN } from '../../../Application';

export const FILE_MANAGEMENT_COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN,
    useFactory: (connection: NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN) => {
      const rpcNatsAdapter = new RpcClientNatsAdapter({ connection, remoteNamespace: DeskGatewayConfig.messageBus.fileManagementNamespace });
      const client = new RpcClient({ adapter: rpcNatsAdapter });
      return new FileManagementSchema.RPC.Client(client, {});
    },
    inject: [NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN],
  },
];
