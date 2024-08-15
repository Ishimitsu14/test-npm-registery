import { ModuleMetadata } from '@nestjs/common';
import { CoreResourceMapper } from '@shared/common-internal';

import { FeedbackResourceMapper } from './FeedbackResourceMapper';

export const RESOURCE_MAPPERS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [FeedbackResourceMapper, CoreResourceMapper];
