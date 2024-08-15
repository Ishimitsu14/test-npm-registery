import { ModuleMetadata } from '@nestjs/common';

import { DealTransactionByDealSpecificationResolver } from './DealTransactionByDealSpecificationResolver';
import { DealTransactionByStatusSpecificationResolver } from './DealTransactionByStatusSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [DealTransactionByDealSpecificationResolver, DealTransactionByStatusSpecificationResolver];
