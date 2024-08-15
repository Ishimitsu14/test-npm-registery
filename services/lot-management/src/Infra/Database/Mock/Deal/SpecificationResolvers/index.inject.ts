import { ModuleMetadata } from '@nestjs/common';

import { DealByBidMakerSpecficationResolver } from './DealByBidMakerSpecficationResolver';
import { DealByBidSpecificationResolver } from './DealByBidSpecificationResolver';
import { DealByOfferMakerSpecficationResolver } from './DealByOfferMakerSpecficationResolver';
import { DealByStatusSpecificationResolver } from './DealByStatusSpecificationResolver';
import { DealMatchesDealTransactionSpecificationResolver } from './DealMatchesDealTransactionSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  DealByBidMakerSpecficationResolver,
  DealByBidSpecificationResolver,
  DealByOfferMakerSpecficationResolver,
  DealMatchesDealTransactionSpecificationResolver,
  DealByStatusSpecificationResolver,
];
