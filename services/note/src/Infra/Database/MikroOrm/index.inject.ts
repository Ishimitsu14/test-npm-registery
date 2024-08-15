import { ModuleMetadata } from '@nestjs/common';
import { NoteConfig } from '@shared/config';
import { mikroOrmInject } from '@shared/db';

import { NOTE_INJECT_PROVIDERS } from './Note';

export const MIKRO_ORM_INJECT_PROVIDERS: ModuleMetadata['providers'] = [
  ...mikroOrmInject({
    url: NoteConfig.database.url,
    synchronize: NoteConfig.database.useSync,
    imports: import('./snapshots.export'),
    useSSL: NoteConfig.database.useSSL,
    debug: NoteConfig.logger.level === 'debug',
  }),
  ...NOTE_INJECT_PROVIDERS,
];
