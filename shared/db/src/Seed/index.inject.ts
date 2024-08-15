import { ModuleMetadata } from '@nestjs/common';

import { SeedUtils } from './utils';

export function seedInject(): ModuleMetadata['providers'] {
  return [{ provide: SeedUtils, useClass: SeedUtils }];
}
