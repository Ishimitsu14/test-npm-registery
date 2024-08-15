import { NullableObject } from '@ddd/core';
import { MetadataStorage, MigrationsOptions, ReflectMetadataProvider } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';

export interface CreateMikroOrmConfigOptions {
  imports: Record<string, any> | Promise<Record<string, any>>;
  url: string;
  useSSL?: boolean;
  migrations?: MigrationsOptions;
  debug?: boolean;
}

export async function createMikroOrmConfig({ imports, url, migrations, debug, useSSL }: CreateMikroOrmConfigOptions) {
  const snapshotImport = await imports;
  const snapshots = Object.values(snapshotImport);

  const metadata = MetadataStorage.getMetadata();
  const metadataItems = Object.keys(metadata).map((key) => metadata[key]);

  const entries = snapshots
    .map((snapshot) => {
      if (typeof snapshot === 'function') {
        const table = metadataItems.find((table) => table.class === snapshot);
        if (table) {
          return {
            entity: <Function>snapshot,
            table,
          };
        }
      }
      return NullableObject;
    })
    .filter(NullableObject.hasValue);

  for (const entry of entries) {
    if (entry.table.tableName) Logger.log(`Registered: [TABLE] "${entry.table.tableName}" - [CLASS] "${entry.entity.name}"`, 'MIKRO ORM');
  }

  const config = defineConfig({
    clientUrl: url,
    entities: entries.map((entry) => entry.entity),
    extensions: [Migrator],
    migrations,
    tsNode: true,
    debug,
    metadataProvider: ReflectMetadataProvider,
    discovery: { alwaysAnalyseProperties: true },
    driverOptions: {
      connection: {
        ssl: useSSL && {
          rejectUnauthorized: false,
        },
      },
    },
  });

  return config;
}
