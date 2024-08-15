import { arrayParser, numberParser } from '@packages/berish-configurator-core';

import { configurator } from '../configurator';
import { SharedConfig } from '../shared';

export interface TgGatewayConfig {
  namespace: string;

  logger: SharedConfig['logger'];

  dev: {
    rpc: {
      useRPC: boolean;
      mountPath: string;
      port: number;
    };
  };

  connectors: {
    nats: {
      servers: string[];
    };
  };

  bot: {
    token: string;
    url: string;
  };

  app: {
    url: string;
  };
}

export const TgGatewayConfig: TgGatewayConfig = {
  namespace: configurator.get('SERVICE_TG_GATEWAY_NAMESPACE'),

  logger: SharedConfig.logger,

  dev: {
    rpc: {
      useRPC: SharedConfig.dev.useRPC,
      mountPath: configurator.get('SERVICE_TG_GATEWAY_DEV_RPC_MOUNT_PATH'),
      port: configurator.get('SERVICE_TG_GATEWAY_DEV_RPC_PORT', numberParser),
    },
  },
  connectors: {
    nats: {
      servers: configurator.get('SHARED_CONNECTOR_NATS_SERVERS', arrayParser()),
    },
  },

  bot: {
    token: configurator.get('SERVICE_TG_GATEWAY_BOT_TOKEN'),
    url: configurator.get('SERVICE_TG_GATEWAY_APP_URL'),
  },

  app: {
    url: configurator.get('SERVICE_TG_GATEWAY_APP_URL'),
  },
};
