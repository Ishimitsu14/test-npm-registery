import { Logger } from '@nestjs/common';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { NotificationConfig } from '@shared/config';
import { createMikroOrmConfig } from '@shared/db';
import path from 'path';

export async function createDataSource() {
  Logger.log(logFlatConfig(NotificationConfig), 'NotificationConfig');

  const config = createMikroOrmConfig({
    url: NotificationConfig.database.url,
    imports: import('../src/Infra/Database/MikroOrm/snapshots.export'),
    useSSL: NotificationConfig.database.useSSL,
    migrations: {
      path: path.join(__dirname, './migrations'),
      glob: '*.{js,ts}',
      disableForeignKeys: false,
      snapshot: true,
      snapshotName: `.snapshot.notification`,
    },
  });

  return config;
}

export default createDataSource();
