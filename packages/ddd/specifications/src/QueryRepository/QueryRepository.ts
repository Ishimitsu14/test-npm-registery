import { Nullable, NullableObject } from '@ddd/core';
import { Entity } from '@ddd/domain';
import { BaseRepository, DbTransactionExecutePayload } from '@ddd/infra';

import { Query, QueryResult } from '../query';
import { QueryRepositoryCountOptions, QueryRepositoryFindOptions, QueryRepositoryFirstOptions } from './IQueryReadRepository';
import { IQueryRepository } from './IQueryRepository';
import { QueryRemoveOptions } from './IQueryWriteRepository';

export abstract class QueryRepository<TEntity extends Entity, TransactionPayload extends DbTransactionExecutePayload = DbTransactionExecutePayload>
  extends BaseRepository<TEntity, TransactionPayload>
  implements IQueryRepository<TEntity>
{
  first(): Promise<Nullable<TEntity>>;
  first(query: Query<TEntity>): Promise<Nullable<TEntity>>;
  first(options: QueryRepositoryFirstOptions<TEntity>): Promise<Nullable<TEntity>>;
  first(query: Query<TEntity>, options: QueryRepositoryFirstOptions<TEntity>): Promise<Nullable<TEntity>>;
  first(arg0?: NullableObject | Query<TEntity> | QueryRepositoryFirstOptions<TEntity>, arg1?: NullableObject | QueryRepositoryFirstOptions<TEntity>): Promise<Nullable<TEntity>> {
    let query = Query.create(this.EntityType);
    let options: QueryRepositoryFirstOptions<TEntity>;

    if (NullableObject.hasValue(arg0)) {
      if (Query.isExtends(arg0)) {
        query = query.addSpecification(arg0.specs).addSortable(arg0.sorts).addPageable(arg0.pageable.skip, 1);
      } else {
        query = query.addSpecification(arg0.specifications).addSortable(arg0.sortable).addPageable(arg0.skip, 1);
        options = arg0;
      }
    }

    if (NullableObject.hasValue(arg1)) {
      query = query.addSpecification(arg1.specifications).addSortable(arg1.sortable).addPageable(arg1.skip, 1);
      options = arg1;
    }

    return this.useFirst(async () => {
      const item = await this.internalFirst(query);
      if (NullableObject.isEmpty(item)) return NullableObject;

      const isSatisfied = query.isLockedLocalSpecify || query.isSatified(item);
      if (!isSatisfied) return NullableObject;

      return item;
    }, options || {});
  }

  count(): Promise<number>;
  count(query: Query<TEntity>): Promise<number>;
  count(options: QueryRepositoryCountOptions<TEntity>): Promise<number>;
  count(query: Query<TEntity>, options: QueryRepositoryCountOptions<TEntity>): Promise<number>;
  count(arg0?: NullableObject | Query<TEntity> | QueryRepositoryCountOptions<TEntity>, arg1?: NullableObject | QueryRepositoryCountOptions<TEntity>): Promise<number> {
    let query = Query.create(this.EntityType);
    let options: QueryRepositoryCountOptions<TEntity>;

    if (NullableObject.hasValue(arg0)) {
      if (Query.isExtends(arg0)) {
        query = query.addSpecification(arg0.specs);
      } else {
        query = query.addSpecification(arg0.specifications);
        options = arg0;
      }
    }

    if (NullableObject.hasValue(arg1)) {
      query = query.addSpecification(arg1.specifications);
      options = arg1;
    }

    return this.internalCount(query);
  }

  find(): Promise<QueryResult<TEntity, TEntity>>;
  find(query: Query<TEntity>): Promise<QueryResult<TEntity, TEntity>>;
  find(options: QueryRepositoryFindOptions<TEntity>): Promise<QueryResult<TEntity, TEntity>>;
  find(query: Query<TEntity>, options: QueryRepositoryFindOptions<TEntity>): Promise<QueryResult<TEntity, TEntity>>;
  async find(arg0?: NullableObject | Query<TEntity> | QueryRepositoryFindOptions<TEntity>, arg1?: NullableObject | QueryRepositoryFindOptions<TEntity>): Promise<QueryResult<TEntity, TEntity>> {
    let query = Query.create(this.EntityType);
    let options: QueryRepositoryFindOptions<TEntity>;

    if (NullableObject.hasValue(arg0)) {
      if (Query.isExtends(arg0)) {
        query = query.addSpecification(arg0.specs).addSortable(arg0.sorts).addPageable(arg0.pageable);
      } else {
        query = query.addSpecification(arg0.specifications).addSortable(arg0.sortable).addPageable(arg0.pageable);
        options = arg0;
      }
    }

    if (NullableObject.hasValue(arg1)) {
      query = query.addSpecification(arg1.specifications).addSortable(arg1.sortable).addPageable(arg1.pageable);
      options = arg1;
    }

    let _count = 0;
    const items = await this.useFindMany(async () => {
      const [items, count] = await this.internalFind(query);
      _count = count;

      return items.filter((item) => {
        if (NullableObject.isEmpty(item)) return false;

        // const isSatisfied = query.isLockedLocalSpecify || query.isSatified(item);
        // if (!isSatisfied) return false;

        return true;
      });
    }, options || {});

    return QueryResult.create(query, items, _count);
  }

  removeByQuery(query: Query<TEntity>): void;
  removeByQuery(options: QueryRemoveOptions<TEntity>): void;
  removeByQuery(query: Query<TEntity>, options: QueryRemoveOptions<TEntity>): void;
  removeByQuery(arg0: Query<TEntity> | QueryRemoveOptions<TEntity>, arg1?: NullableObject | QueryRemoveOptions<TEntity>): void {
    let query = Query.create(this.EntityType);
    let options: QueryRemoveOptions<TEntity>;

    if (Query.isExtends(arg0)) {
      query = query.addSpecification(arg0.specs).addSortable(arg0.sorts).addPageable(arg0.pageable);
    } else {
      query = query.addSpecification(arg0.specifications).addSortable(arg0.sortable).addPageable(arg0.pageable);
      options = arg0;
    }

    if (NullableObject.hasValue(arg1)) {
      query = query.addSpecification(arg1.specifications).addSortable(arg1.sortable).addPageable(arg1.pageable);
      options = arg1;
    }

    return void this.useTransaction(async (payload) => {
      await this.internalRemove(query, payload);
    });
  }

  protected abstract internalFind(query: Query<TEntity>): Promise<[items: TEntity[], count: number]>;
  protected abstract internalFirst(query: Query<TEntity>): Promise<Nullable<TEntity>>;
  protected abstract internalCount(query: Query<TEntity>): Promise<number>;
  protected abstract internalRemove(query: Query<TEntity>, payload: TransactionPayload): Promise<void>;
}
