import { ModuleMetadata } from '@nestjs/common';

import { LotQuestionByLotSpecficationResolver } from './LotQuestionByLotSpecficationResolver';
import { LotQuestionByStatusSpecificationResolver } from './LotQuestionByStatusSpecificationResolver';

export const SPECIFICATION_RESOLVERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [LotQuestionByLotSpecficationResolver, LotQuestionByStatusSpecificationResolver];
