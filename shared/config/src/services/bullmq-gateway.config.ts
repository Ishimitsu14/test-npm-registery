import { numberParser } from '@packages/berish-configurator-core';

import { configurator } from '../configurator';
import { SharedConfig } from '../shared';

export interface BullMQGatewayConfig {
  version: SharedConfig['version'];
  namespace: string;

  logger: SharedConfig['logger'];

  bullmq: SharedConfig['connectors']['bull'];
  port: number;
}

export const BullMQGatewayConfig: BullMQGatewayConfig = {
  version: SharedConfig.version,
  namespace: configurator.get('SERVICE_ADMIN_GATEWAY_NAMESPACE'),

  logger: SharedConfig.logger,
  bullmq: SharedConfig.connectors.bull,
  port: configurator.get('SERVICE_BULLMQ_GATEWAY_PORT', numberParser),
};
