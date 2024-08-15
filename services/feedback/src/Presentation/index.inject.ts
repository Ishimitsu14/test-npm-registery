import { ModuleMetadata } from '@nestjs/common';

import { FeedbackController } from './FeedbackController';

export const PRESENTATION_INJECT_CONTROLLERS: ModuleMetadata['controllers'] = [FeedbackController];
