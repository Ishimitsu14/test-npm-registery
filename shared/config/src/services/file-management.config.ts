import { boolParser, numberParser } from '@packages/berish-configurator-core';

import { configurator } from '../configurator';
import { SharedConfig } from '../shared';

export interface FileManagementConfig {
  namespace: string;

  logger: SharedConfig['logger'];
  connectors: SharedConfig['connectors'];

  dev: {
    useSeed: boolean;
    rpc: { useRPC: boolean; mountPath: string; port: number };
  };

  database: {
    useMock: boolean;
    useSync: boolean;

    url: string;
    useSSL: boolean;
  };

  rest: {
    publicHost: string;
    port: number;
  };

  s3: {
    useMock: boolean;

    endpoint: string;
    bucket: string;
    credentials: {
      key: string;
      secret: string;
    };
  };
}

export const FileManagementConfig: FileManagementConfig = {
  namespace: configurator.get('SERVICE_FILE_MANAGEMENT_NAMESPACE'),

  logger: SharedConfig.logger,
  connectors: SharedConfig.connectors,

  database: {
    useMock: SharedConfig.database.useMock,
    useSync: SharedConfig.database.useSync,

    url: configurator.get('SERVICE_FILE_MANAGEMENT_DB_URL'),
    useSSL: configurator.defaults(configurator.get('SERVICE_FILE_MANAGEMENT_DB_USE_SSL', boolParser), () => !SharedConfig.dev.isDev),
  },

  dev: {
    useSeed: SharedConfig.dev.useSeed,
    rpc: {
      useRPC: SharedConfig.dev.useRPC,
      mountPath: configurator.get('SERVICE_FILE_MANAGEMENT_DEV_RPC_MOUNT_PATH'),
      port: configurator.get('SERVICE_FILE_MANAGEMENT_DEV_RPC_PORT', numberParser),
    },
  },

  rest: {
    publicHost: configurator.get('SERVICE_FILE_MANAGEMENT_REST_PUBLIC_HOST'),
    port: configurator.get('SERVICE_FILE_MANAGEMENT_REST_PORT', numberParser),
  },

  s3: {
    useMock: SharedConfig.database.useMock,

    endpoint: configurator.get('SERVICE_FILE_MANAGEMENT_S3_ENDPOINT'),
    bucket: configurator.get('SERVICE_FILE_MANAGEMENT_S3_BUCKET'),
    credentials: {
      key: configurator.get('SERVICE_FILE_MANAGEMENT_S3_CREDENTIALS_KEY'),
      secret: configurator.get('SERVICE_FILE_MANAGEMENT_S3_CREDENTIALS_SECRET'),
    },
  },
};
