import { Logger } from '@nestjs/common';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { LotManagementConfig } from '@shared/config';
import { createMikroOrmConfig } from '@shared/db';
import path from 'path';

export async function createDataSource() {
  Logger.log(logFlatConfig(LotManagementConfig), 'LotManagementConfig');

  const config = createMikroOrmConfig({
    url: LotManagementConfig.database.url,
    imports: import('../src/Infra/Database/MikroOrm/snapshots.export'),
    useSSL: LotManagementConfig.database.useSSL,
    migrations: {
      path: path.join(__dirname, './migrations'),
      glob: '*.{js,ts}',
      disableForeignKeys: false,
      snapshot: true,
      snapshotName: `.snapshot.lot-management`,
    },
  });

  return config;
}

export default createDataSource();
