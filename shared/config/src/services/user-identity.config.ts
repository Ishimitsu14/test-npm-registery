import { boolParser, numberParser } from '@packages/berish-configurator-core';

import { configurator } from '../configurator';
import { SharedConfig } from '../shared';

export interface UserIdentityConfig {
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

  auth: {
    serverPrivateKey: string;
    siweStatement: string;
    siweLifetimeMS: number;
    telegramCodeLifetimeMS: number;
  };

  sumsub: {
    apiUrl: string;
    apiToken: string;
    apiSecret: string;
    verificationLevel: string;
  };
}

export const UserIdentityConfig: UserIdentityConfig = {
  namespace: configurator.get('SERVICE_USER_IDENTITY_NAMESPACE'),

  logger: SharedConfig.logger,
  connectors: SharedConfig.connectors,

  database: {
    useMock: SharedConfig.database.useMock,
    useSync: SharedConfig.database.useSync,

    url: configurator.get('SERVICE_USER_IDENTITY_DB_URL'),
    useSSL: configurator.defaults(configurator.get('SERVICE_USER_IDENTITY_DB_USE_SSL', boolParser), () => !SharedConfig.dev.isDev),
  },

  dev: {
    useSeed: SharedConfig.dev.useSeed,
    rpc: {
      useRPC: SharedConfig.dev.useRPC,
      mountPath: configurator.get('SERVICE_USER_IDENTITY_DEV_RPC_MOUNT_PATH'),
      port: configurator.get('SERVICE_USER_IDENTITY_DEV_RPC_PORT', numberParser),
    },
  },

  auth: {
    serverPrivateKey: configurator.get('SERVICE_USER_IDENTITY_AUTH_SERVER_PRIVATE_KEY'),
    siweStatement: configurator.get('SERVICE_USER_IDENTITY_AUTH_SIWE_STATEMENT'),
    siweLifetimeMS: configurator.get('SERVICE_USER_IDENTITY_AUTH_SIWE_LIFETIME_MS', numberParser),
    telegramCodeLifetimeMS: configurator.get('SERVICE_USER_IDENTITY_AUTH_TELEGRAM_CODE_LIFETIME_MS', numberParser),
  },

  sumsub: {
    apiUrl: configurator.get('SERVICE_USER_IDENTITY_SUMSUB_API_URL'),
    apiToken: configurator.get('SERVICE_USER_IDENTITY_SUMSUB_API_TOKEN'),
    apiSecret: configurator.get('SERVICE_USER_IDENTITY_SUMSUB_API_SECRET'),
    verificationLevel: configurator.get('SERVICE_USER_IDENTITY_SUMSUB_VERIFICATION_LEVEL'),
  },
};
