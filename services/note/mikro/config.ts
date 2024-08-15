import { Logger } from '@nestjs/common';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { NoteConfig } from '@shared/config';
import { createMikroOrmConfig } from '@shared/db';
import path from 'path';

export async function createDataSource() {
  Logger.log(logFlatConfig(NoteConfig), 'NoteConfig');

  const config = createMikroOrmConfig({
    url: NoteConfig.database.url,
    imports: import('../src/Infra/Database/MikroOrm/snapshots.export'),
    useSSL: NoteConfig.database.useSSL,
    migrations: {
      path: path.join(__dirname, './migrations'),
      glob: '*.{js,ts}',
      disableForeignKeys: false,
      snapshot: true,
      snapshotName: `.snapshot.note`,
    },
  });

  return config;
}

export default createDataSource();
