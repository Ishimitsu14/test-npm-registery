import LINQ from '@berish/linq';
import { Entity } from '@ddd/domain';

import { Specification } from '../Specification';
import { AndSpecification, EmptySpecification } from '../system';

export function combineSpecifications<TEntity extends Entity>(...specs: (Specification<TEntity> | Specification<TEntity>[])[]) {
  const inlineSpecs = LINQ.from(specs)
    .selectMany((m) => (Array.isArray(m) ? m : [m]))
    .filter(Boolean)
    .toArray();
  if (inlineSpecs.length <= 0) return EmptySpecification.create<TEntity>();

  return inlineSpecs.length === 1 ? inlineSpecs[0] : AndSpecification.create(inlineSpecs);
}
