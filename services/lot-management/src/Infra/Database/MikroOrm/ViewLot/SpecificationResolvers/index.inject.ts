import { ModuleMetadata } from '@nestjs/common';

import { ViewLotByLotSpecificationResolver } from './ViewLotByLotSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [ViewLotByLotSpecificationResolver];
