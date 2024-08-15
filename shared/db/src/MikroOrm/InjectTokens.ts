import { MikroORM, PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';

export const MIKRO_ORM_INJECT_TOKEN = Symbol('MIKRO_ORM_INJECT_TOKEN');
export type MIKRO_ORM_INJECT_TOKEN = MikroORM;

export const MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN = Symbol('MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN');
export type MIKRO_ORM_ENTITY_MANAGER_INJECT_TOKEN = SqlEntityManager<PostgreSqlDriver>;
