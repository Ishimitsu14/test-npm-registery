import { MikroORM } from '@mikro-orm/postgresql';

import { createMikroOrmConfig, CreateMikroOrmConfigOptions } from './createMikroOrmConfig';

export interface CreateMikroOrmOptions extends CreateMikroOrmConfigOptions {
  synchronize: boolean;
}

export async function createMikroOrm({ synchronize, ...createMikroOrmConfigOptions }: CreateMikroOrmOptions) {
  const config = await createMikroOrmConfig(createMikroOrmConfigOptions);

  const orm = await MikroORM.init(config);

  if (synchronize) {
    await orm.schema.dropSchema({ wrap: false });
    await orm.schema.createSchema({ wrap: false });
  }

  return orm;
}
