import { ISnapshotEntity } from '@ddd/infra';
import { Sortable, SortableInferEntity, SortableResolver, SortableValue } from '@ddd/specifications';
import { QueryOrder } from '@mikro-orm/core';

import { MikroOrmQueryResolver } from '../MikroOrmQueryResolver';
import { MikroOrmSortable } from '../types';

export abstract class MikroOrmSortableResolver<TSortable extends Sortable<any>, TSnapshot extends ISnapshotEntity<SortableInferEntity<TSortable>>> extends SortableResolver<
  MikroOrmSortable<TSortable, TSnapshot>
> {
  static getQueryOrder(sortableValue: SortableValue): QueryOrder {
    if (sortableValue.isEquals(SortableValue.ASC)) return QueryOrder.ASC;
    if (sortableValue.isEquals(SortableValue.ASC_NULLS_FIRST)) return QueryOrder.ASC_NULLS_FIRST;
    if (sortableValue.isEquals(SortableValue.ASC_NULLS_LAST)) return QueryOrder.ASC_NULLS_LAST;
    if (sortableValue.isEquals(SortableValue.DESC)) return QueryOrder.DESC;
    if (sortableValue.isEquals(SortableValue.DESC_NULLS_FIRST)) return QueryOrder.DESC_NULLS_FIRST;
    if (sortableValue.isEquals(SortableValue.DESC_NULLS_LAST)) return QueryOrder.DESC_NULLS_LAST;

    return QueryOrder.ASC;
  }

  get queryResolver(): MikroOrmQueryResolver {
    return <MikroOrmQueryResolver>super.queryResolver;
  }
}
