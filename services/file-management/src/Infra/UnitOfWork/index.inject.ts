import { ModuleMetadata, Scope } from '@nestjs/common';

import { UNIT_OF_WORK_INJECT_TOKEN } from '../../Application';
import { UnitOfWork } from './UnitOfWork';

export const UNIT_OF_WORK_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: UNIT_OF_WORK_INJECT_TOKEN,
    useClass: UnitOfWork,
    scope: Scope.REQUEST,
  },
];
