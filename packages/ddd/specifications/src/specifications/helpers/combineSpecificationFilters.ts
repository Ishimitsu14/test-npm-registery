import { Entity } from '@ddd/domain';

import { SpecificationFilter } from '../SpecificationFilter';

export function combineSpecificationFilters<TEntity extends Entity>(filters: SpecificationFilter<TEntity>[]): SpecificationFilter<TEntity> {
  return (item) => filters.every((filter) => filter(item));
}
