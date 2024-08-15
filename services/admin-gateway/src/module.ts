import { Module } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { NestShutdownRoot } from '@packages/nestjs-shutdown-hooks';

import { APPLICATION_INJECT_PROVIDERS } from './Application';
import { INFRA_INJECT_PROVIDERS } from './Infra';
import { PRESENTATION_INJECT_CONTROLLERS, PRESENTATION_INJECT_PROVIDERS } from './Presentation';

@Module({
  imports: [],
  controllers: [...PRESENTATION_INJECT_CONTROLLERS],
  providers: [NestShutdownRoot, DiscoveryService, ...APPLICATION_INJECT_PROVIDERS, ...INFRA_INJECT_PROVIDERS, ...PRESENTATION_INJECT_PROVIDERS],
})
export class MicroserviceModule {}
