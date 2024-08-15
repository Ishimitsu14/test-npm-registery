import { Entity } from '@ddd/domain';

import { Specification } from '../Specification';
import { SpecificationFilter } from '../SpecificationFilter';

export function combineSpecificationsToSpecificationFilter<TEntity extends Entity>(specifications: Specification<TEntity>[]): SpecificationFilter<TEntity> {
  return (item) => specifications.every((specification) => specification.isSatisfied(item));
}
