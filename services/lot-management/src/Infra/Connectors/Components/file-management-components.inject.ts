import { ModuleMetadata } from '@nestjs/common';
import { RpcClient } from '@packages/berish-rpc-client';
import { RpcClientNatsAdapter } from '@packages/berish-rpc-nats';
import { FileManagementSchema } from '@schema/file-management';
import { LotManagementConfig } from '@shared/config';

import { FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN, NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN } from '../../../Application';

export const FILE_MANAGEMENT_COMPONENTS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: FILE_MANAGEMENT_RPC_COMPONENT_INJECT_TOKEN,
    useFactory: (connection: NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN) => {
      const rpcNatsAdapter = new RpcClientNatsAdapter({ connection, remoteNamespace: LotManagementConfig.messageBus.fileManagementNamespace });
      const client = new RpcClient({ adapter: rpcNatsAdapter });
      const userIdentityClient = new FileManagementSchema.RPC.Client(client, {});

      return userIdentityClient;
    },
    inject: [NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN],
  },
];
