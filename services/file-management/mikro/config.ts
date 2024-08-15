import { Logger } from '@nestjs/common';
import { logFlatConfig } from '@packages/berish-configurator-core';
import { FileManagementConfig } from '@shared/config';
import { createMikroOrmConfig } from '@shared/db';
import path from 'path';

export async function createDataSource() {
  Logger.log(logFlatConfig(FileManagementConfig), 'FileManagementConfig');

  const config = createMikroOrmConfig({
    url: FileManagementConfig.database.url,
    imports: import('../src/Infra/Database/MikroOrm/snapshots.export'),
    useSSL: FileManagementConfig.database.useSSL,
    migrations: {
      path: path.join(__dirname, './migrations'),
      glob: '*.{js,ts}',
      disableForeignKeys: false,
      snapshot: true,
      snapshotName: `.snapshot.file-management`,
    },
  });

  return config;
}

export default createDataSource();
