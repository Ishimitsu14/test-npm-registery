import { boolParser, numberParser } from '@packages/berish-configurator-core';

import { configurator } from '../configurator';
import { SharedConfig } from '../shared';

export interface LotManagementConfig {
  namespace: string;

  logger: SharedConfig['logger'];
  connectors: SharedConfig['connectors'];

  dev: {
    useSeed: boolean;
    rpc: {
      useRPC: boolean;
      mountPath: string;
      port: number;
    };
  };

  database: {
    useMock: boolean;
    useSync: boolean;

    url: string;
    useSSL: boolean;
  };

  messageBus: {
    fileManagementNamespace: string;
    notificationNamespace: string;
    userIdentityNamespace: string;
  };
}

export const LotManagementConfig: LotManagementConfig = {
  namespace: configurator.get('SERVICE_LOT_MANAGEMENT_NAMESPACE'),

  logger: SharedConfig.logger,
  connectors: SharedConfig.connectors,

  database: {
    useMock: SharedConfig.database.useMock,
    useSync: SharedConfig.database.useSync,

    url: configurator.get('SERVICE_LOT_MANAGEMENT_DB_URL'),
    useSSL: configurator.defaults(configurator.get('SERVICE_LOT_MANAGEMENT_DB_USE_SSL', boolParser), () => !SharedConfig.dev.isDev),
  },

  dev: {
    useSeed: SharedConfig.dev.useSeed,
    rpc: {
      useRPC: SharedConfig.dev.useRPC,
      mountPath: configurator.get('SERVICE_LOT_MANAGEMENT_DEV_RPC_MOUNT_PATH'),
      port: configurator.get('SERVICE_LOT_MANAGEMENT_DEV_RPC_PORT', numberParser),
    },
  },
  messageBus: {
    fileManagementNamespace: configurator.get('SERVICE_FILE_MANAGEMENT_NAMESPACE'),
    notificationNamespace: configurator.get('SERVICE_NOTIFICATION_NAMESPACE'),
    userIdentityNamespace: configurator.get('SERVICE_USER_IDENTITY_NAMESPACE'),
  },
};
