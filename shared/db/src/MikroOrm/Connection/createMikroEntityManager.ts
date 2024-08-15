import { MikroORM } from '@mikro-orm/postgresql';

export function createMikroEntityManager(mikroORM: MikroORM) {
  return mikroORM.em.fork();
}
