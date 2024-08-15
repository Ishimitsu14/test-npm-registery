import { Module } from '@nestjs/common';

import { APPLICATION_INJECT_PROVIDERS } from './Application';
import { INFRA_INJECT_PROVIDERS } from './Infra';
import { PRESENTATION_INJECT_CONTROLLERS } from './Presentation';

@Module({
  imports: [],
  controllers: [...PRESENTATION_INJECT_CONTROLLERS],
  providers: [...APPLICATION_INJECT_PROVIDERS, ...INFRA_INJECT_PROVIDERS],
})
export class MicroserviceModule {}
