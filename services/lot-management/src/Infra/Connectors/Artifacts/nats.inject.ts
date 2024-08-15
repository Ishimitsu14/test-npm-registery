import { ModuleMetadata } from '@nestjs/common';
import { LotManagementConfig } from '@shared/config';
import * as nats from 'nats';

import { NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN } from '../../../Application';

export const NATS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: NATS_CONNECTOR_ARTIFACT_INJECT_TOKEN,
    useValue: async () => {
      return nats.connect({ servers: LotManagementConfig.connectors.nats.servers, timeout: 100000 });
    },
  },
];
