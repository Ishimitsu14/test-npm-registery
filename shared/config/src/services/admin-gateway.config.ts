import { numberParser } from '@packages/berish-configurator-core';

import { configurator } from '../configurator';
import { SharedConfig } from '../shared';

export interface AdminGatewayConfig {
  version: SharedConfig['version'];
  namespace: string;

  logger: SharedConfig['logger'];
  connectors: SharedConfig['connectors'];

  rpc: {
    mountPath: string;
    httpPort: number;
  };

  jwt: {
    privateKey: string;
    expiresIn: number;
  };

  messageBus: {
    userIdentityNamespace: string;
    lotManagementNamespace: string;
    fileManagementNamespace: string;
    noteNamespace: string;
    notificationNamespace: string;
    feedbackNamespace: string;
  };
}

export const AdminGatewayConfig: AdminGatewayConfig = {
  version: SharedConfig.version,
  namespace: configurator.get('SERVICE_ADMIN_GATEWAY_NAMESPACE'),

  logger: SharedConfig.logger,
  connectors: SharedConfig.connectors,

  rpc: {
    mountPath: configurator.get('SERVICE_ADMIN_GATEWAY_RPC_MOUNT_PATH'),
    httpPort: configurator.get('SERVICE_ADMIN_GATEWAY_RPC_HTTP_PORT', numberParser),
  },
  jwt: {
    privateKey: configurator.get('SERVICE_ADMIN_GATEWAY_JWT_PRIVATE_KEY'),
    expiresIn: configurator.get('SERVICE_ADMIN_GATEWAY_JWT_EXPIRES_IN', numberParser),
  },
  messageBus: {
    userIdentityNamespace: configurator.get('SERVICE_USER_IDENTITY_NAMESPACE'),
    lotManagementNamespace: configurator.get('SERVICE_LOT_MANAGEMENT_NAMESPACE'),
    fileManagementNamespace: configurator.get('SERVICE_FILE_MANAGEMENT_NAMESPACE'),
    noteNamespace: configurator.get('SERVICE_NOTE_NAMESPACE'),
    notificationNamespace: configurator.get('SERVICE_NOTIFICATION_NAMESPACE'),
    feedbackNamespace: configurator.get('SERVICE_FEEDBACK_NAMESPACE'),
  },
};
