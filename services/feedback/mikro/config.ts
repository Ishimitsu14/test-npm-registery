import { Logger } from '@nestjs/common';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { FeedbackConfig } from '@shared/config';
import { createMikroOrmConfig } from '@shared/db';
import path from 'path';

export async function createDataSource() {
  Logger.log(logFlatConfig(FeedbackConfig), 'FeedbackConfig');

  const config = createMikroOrmConfig({
    url: FeedbackConfig.database.url,
    imports: import('../src/Infra/Database/MikroOrm/snapshots.export'),
    useSSL: FeedbackConfig.database.useSSL,
    migrations: {
      path: path.join(__dirname, './migrations'),
      glob: '*.{js,ts}',
      disableForeignKeys: false,
      snapshot: true,
      snapshotName: `.snapshot.feedback`,
    },
  });

  return config;
}

export default createDataSource();
