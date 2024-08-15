import { Sortable, SortableResolver } from '@ddd/specifications';

import { MockQueryResolver } from '../MockQueryResolver';
import { MockSortablePredicate } from '../types';

export abstract class MockSortableResolver<TSortable extends Sortable<any>> extends SortableResolver<MockSortablePredicate<TSortable>> {
  get queryResolver(): MockQueryResolver {
    return <MockQueryResolver>super.queryResolver;
  }
}
