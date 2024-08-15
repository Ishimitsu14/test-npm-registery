import { Entity, EntityManager, PrimaryKey, PrimaryKeyProp } from '@mikro-orm/core';

@Entity({
  tableName: 'counter',
})
export class CounterSnapshot {
  static async generateIncrement(key: string, dataSource: EntityManager) {
    const repository = dataSource.getRepository(CounterSnapshot);
    const counterRaw = repository.create({ key });
    await dataSource.persistAndFlush(counterRaw);

    return counterRaw.index;
  }

  @PrimaryKey({ fieldName: 'key', type: 'varchar' })
  key: string;

  @PrimaryKey({ fieldName: 'index', type: 'integer', autoincrement: true })
  index: number;

  [PrimaryKeyProp]: [string, number];
}
