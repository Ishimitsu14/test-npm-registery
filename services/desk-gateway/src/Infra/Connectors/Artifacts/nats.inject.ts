import { ModuleMetadata } from '@nestjs/common';
import { DeskGatewayConfig } from '@shared/config';
import * as nats from 'nats';

import { NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN } from '../../../Application';

export const NATS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN,
    useValue: async () => {
      return nats.connect({ servers: DeskGatewayConfig.connectors.nats.servers, timeout: 100000 });
    },
  },
];
