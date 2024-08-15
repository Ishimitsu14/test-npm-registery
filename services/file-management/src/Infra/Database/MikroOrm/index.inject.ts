import { ModuleMetadata } from '@nestjs/common';
import { FileManagementConfig } from '@shared/config';
import { mikroOrmInject } from '@shared/db';

import { FILE_ENTITY_INJECT_PROVIDERS } from './FileEntity';

export const MIKRO_ORM_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...mikroOrmInject({
    url: FileManagementConfig.database.url,
    synchronize: FileManagementConfig.database.useSync,
    imports: import('./snapshots.export'),
    useSSL: FileManagementConfig.database.useSSL,
    debug: FileManagementConfig.logger.level === 'debug',
  }),
  ...FILE_ENTITY_INJECT_PROVIDERS,
];
