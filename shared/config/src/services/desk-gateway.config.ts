import { numberParser } from '@packages/berish-configurator-core';

import { configurator } from '../configurator';
import { SharedConfig } from '../shared';

export interface DeskGatewayConfig {
  version: SharedConfig['version'];
  namespace: string;

  logger: SharedConfig['logger'];
  connectors: SharedConfig['connectors'];

  rpc: {
    mountPath: string;
    httpPort: number;
  };

  rest: {
    publicHost: string;
    port: number;
  };

  jwt: {
    privateKey: string;
    expiresIn: number;
  };

  messageBus: {
    userIdentityNamespace: string;
    lotManagementNamespace: string;
    fileManagementNamespace: string;
    notificationManagementNamespace: string;
    feedbackNamespace: string;
  };
}

export const DeskGatewayConfig: DeskGatewayConfig = {
  version: SharedConfig.version,
  namespace: configurator.get('SERVICE_DESK_GATEWAY_NAMESPACE'),

  logger: SharedConfig.logger,
  connectors: SharedConfig.connectors,

  rpc: {
    mountPath: configurator.get('SERVICE_DESK_GATEWAY_RPC_MOUNT_PATH'),
    httpPort: configurator.get('SERVICE_DESK_GATEWAY_RPC_HTTP_PORT', numberParser),
  },
  rest: {
    publicHost: configurator.get('SERVICE_DESK_GATEWAY_REST_PUBLIC_HOST'),
    port: configurator.get('SERVICE_DESK_GATEWAY_REST_PORT', numberParser),
  },
  jwt: {
    privateKey: configurator.get('SERVICE_DESK_GATEWAY_JWT_PRIVATE_KEY'),
    expiresIn: configurator.get('SERVICE_DESK_GATEWAY_JWT_EXPIRES_IN', numberParser),
  },
  messageBus: {
    userIdentityNamespace: configurator.get('SERVICE_USER_IDENTITY_NAMESPACE'),
    lotManagementNamespace: configurator.get('SERVICE_LOT_MANAGEMENT_NAMESPACE'),
    fileManagementNamespace: configurator.get('SERVICE_FILE_MANAGEMENT_NAMESPACE'),
    notificationManagementNamespace: configurator.get('SERVICE_NOTIFICATION_NAMESPACE'),
    feedbackNamespace: configurator.get('SERVICE_FEEDBACK_NAMESPACE'),
  },
};
