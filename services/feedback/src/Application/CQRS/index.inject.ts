import { ModuleMetadata } from '@nestjs/common';

import { FeedbackCreateCommand } from './FeedbackCreateCommand';
import { FeedbackGetByIdQuery } from './FeedbackGetByIdQuery';
import { FeedbackListQuery } from './FeedbackListQuery';

export const CQRS_INJECT_PROVIDERS: ModuleMetadata['providers'] = [FeedbackCreateCommand, FeedbackListQuery, FeedbackGetByIdQuery];
