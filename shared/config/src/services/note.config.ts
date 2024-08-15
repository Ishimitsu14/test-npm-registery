import { boolParser, numberParser } from '@packages/berish-configurator-core';

import { configurator } from '../configurator';
import { SharedConfig } from '../shared';

export interface NoteConfig {
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
}

export const NoteConfig: NoteConfig = {
  namespace: configurator.get('SERVICE_NOTE_NAMESPACE'),

  logger: SharedConfig.logger,
  connectors: SharedConfig.connectors,

  database: {
    useMock: SharedConfig.database.useMock,
    useSync: SharedConfig.database.useSync,

    url: configurator.get('SERVICE_NOTE_DB_URL'),
    useSSL: configurator.defaults(configurator.get('SERVICE_NOTE_DB_USE_SSL', boolParser), () => !SharedConfig.dev.isDev),
  },

  dev: {
    useSeed: SharedConfig.dev.useSeed,
    rpc: {
      useRPC: SharedConfig.dev.useRPC,
      mountPath: configurator.get('SERVICE_NOTE_DEV_RPC_MOUNT_PATH'),
      port: configurator.get('SERVICE_NOTE_DEV_RPC_PORT', numberParser),
    },
  },
};
