import { ModuleMetadata } from '@nestjs/common';

import { LotByAssetCreateRequestSpecificationResolver } from './LotByAssetCreateRequestSpecificationResolver';
import { LotByAssetSpecificationResolver } from './LotByAssetSpecificationResolver';
import { LotByCreatedAtSpecificationResolver } from './LotByCreatedAtSpecificationResolver';
import { LotByDirectionSpecificationResolver } from './LotByDirectionSpecificationResolver';
import { LotByInvestDocFdvSpecificationResolver } from './LotByInvestDocFdvSpecificationResolver';
import { LotByIsHotSpecificationResolver } from './LotByIsHotSpecificationResolver';
import { LotByMinSummarySpecificationResolver } from './LotByMinSummarySpecificationResolver';
import { LotByOfferMakerSpecificationResolver } from './LotByOfferMakerSpecificationResolver';
import { LotByReassignmentTypeSpecificationResolver } from './LotByReassignmentTypeSpecificationResolver';
import { LotByStatusSpecificationResolver } from './LotByStatusSpecificationResolver';
import { LotBySummarySpecificationResolver } from './LotBySummarySpecificationResolver';
import { LotByTypeSpecificationResolver } from './LotByTypeSpecificationResolver';
import { LotMatchesBidSpecificationResolver } from './LotMatchesBidSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  LotByAssetCreateRequestSpecificationResolver,
  LotByAssetSpecificationResolver,
  LotByDirectionSpecificationResolver,
  LotByIsHotSpecificationResolver,
  LotByOfferMakerSpecificationResolver,
  LotByStatusSpecificationResolver,
  LotBySummarySpecificationResolver,
  LotByTypeSpecificationResolver,
  LotByReassignmentTypeSpecificationResolver,
  LotMatchesBidSpecificationResolver,
  LotByCreatedAtSpecificationResolver,
  LotByMinSummarySpecificationResolver,
  LotByInvestDocFdvSpecificationResolver,
];
