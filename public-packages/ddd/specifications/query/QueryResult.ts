import { Entity, ValueObject, ValueObjectAtomicValue } from '../../domain';
import { Query } from './Query';

export class QueryResult<TEntity extends Entity, TItem extends ValueObjectAtomicValue = TEntity> extends ValueObject {
  static create<TEntity extends Entity>(query: Query<TEntity>, items: TEntity[], count: number) {
    return new QueryResult(query, items, count);
  }

  private constructor(
    readonly query: Query<TEntity>,
    readonly items: TItem[],
    readonly count: number,
  ) {
    super();
  }

  mapTo<UItem extends ValueObjectAtomicValue>(callbackfn: (value: TItem, index: number, array: TItem[]) => UItem): QueryResult<TEntity, UItem> {
    return new QueryResult(this.query, this.items.map(callbackfn), this.count);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { query: this.query, items: this.items, count: this.count };
  }
}
