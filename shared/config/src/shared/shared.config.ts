import { arrayParser, boolParser, NODE_ENV, numberParser } from '@packages/berish-configurator-core';
import { paths } from '@packages/berish-configurator-env';
import { LoggerLevel } from '@packages/berish-rpc-logger';

import { configurator } from '../configurator';

export interface SharedConfig {
  version: string;
  mode: NODE_ENV;

  dev: {
    isDev: boolean;
    useRPC: boolean;

    useSeed: boolean;
  };

  database: {
    useMock: boolean;
    useSync: boolean;
  };

  logger: {
    level: LoggerLevel;
  };

  connectors: {
    nats: {
      servers: string[];
    };
    kafka: {
      brokers: string[];
    };
    bull: {
      host: string;
      port: number;
      db: number;
      user: string;
      password: string;
      useTLS: boolean;
      prefix: string;
    };
  };
}

const isDev = NODE_ENV === 'development';
const useDBMock = configurator.defaults(configurator.get('SHARED_DATABASE_USE_MOCK', boolParser), () => isDev);
const useDBSync = configurator.defaults(configurator.get('SHARED_DATABASE_USE_SYNC', boolParser), () => isDev);
const useSeed = configurator.defaults(configurator.get('SHARED_DEV_USE_SEED', boolParser), () => isDev && useDBMock);
const useDevRPC = configurator.defaults(configurator.get('SHARED_DEV_USE_RPC', boolParser), () => isDev);

export const SharedConfig: SharedConfig = {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: configurator.defaults(configurator.get('SHARED_VERSION'), () => require(paths.appPackageJson)['version']),
  mode: NODE_ENV,
  dev: {
    isDev,
    useRPC: useDevRPC,

    useSeed,
  },

  database: {
    useMock: useDBMock,
    useSync: useDBSync,
  },

  logger: {
    level: configurator.defaults(configurator.get('SHARED_LOGGER_LEVER'), () => (isDev ? 'debug' : 'critical')),
  },

  connectors: {
    nats: {
      servers: configurator.get('SHARED_CONNECTOR_NATS_SERVERS', arrayParser()),
    },
    kafka: {
      brokers: configurator.get('SHARED_CONNECTOR_KAFKA_BROKERS', arrayParser()),
    },
    bull: {
      host: configurator.get('SHARED_CONNECTOR_BULL_REDIS_HOST'),
      port: configurator.get('SHARED_CONNECTOR_BULL_REDIS_PORT', numberParser),
      db: configurator.get('SHARED_CONNECTOR_BULL_REDIS_DB', numberParser),
      user: configurator.get('SHARED_CONNECTOR_BULL_REDIS_USER'),
      password: configurator.get('SHARED_CONNECTOR_BULL_REDIS_PASSWORD'),
      useTLS: configurator.get('SHARED_CONNECTOR_BULL_REDIS_USE_TLS', boolParser),
      prefix: configurator.defaults(configurator.get('SHARED_CONNECTOR_BULL_PREFIX'), () => 'bull'),
    },
  },
};
