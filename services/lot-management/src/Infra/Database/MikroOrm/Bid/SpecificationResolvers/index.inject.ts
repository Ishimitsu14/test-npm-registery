import { ModuleMetadata } from '@nestjs/common';

import { BidByBidMakerSpecificationResolver } from './BidByBidMakerSpecificationResolver';
import { BidByLotSpecificationResolver } from './BidByLotSpecificationResolver';
import { BidByStatusSpecificationResolver } from './BidByStatusSpecificationResolver';
import { BidMatchesDealSpecificationResolver } from './BidMatchesDealSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  BidByBidMakerSpecificationResolver,
  BidByLotSpecificationResolver,
  BidByStatusSpecificationResolver,
  BidMatchesDealSpecificationResolver,
];
