import { ModuleMetadata } from '@nestjs/common';
import { FeedbackConfig } from '@shared/config';
import { mikroOrmInject } from '@shared/db';

import { FEEDBACK_INJECT_PROVIDERS } from './Feedback';

export const MIKRO_ORM_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...mikroOrmInject({
    url: FeedbackConfig.database.url,
    synchronize: FeedbackConfig.database.useSync,
    imports: import('./snapshots.export'),
    useSSL: FeedbackConfig.database.useSSL,
    debug: FeedbackConfig.logger.level === 'debug',
  }),
  ...FEEDBACK_INJECT_PROVIDERS,
];
