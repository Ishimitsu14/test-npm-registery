import { ModuleMetadata, Scope } from '@nestjs/common';
import { NestDomainEventBus } from '@shared/events';

import { UNIT_OF_WORK_INJECT_TOKEN } from '../../Application';
import { UnitOfWork } from './UnitOfWork';

export const UNIT_OF_WORK_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  NestDomainEventBus,
  {
    provide: UNIT_OF_WORK_INJECT_TOKEN,
    useClass: UnitOfWork,
    scope: Scope.REQUEST,
  },
];
