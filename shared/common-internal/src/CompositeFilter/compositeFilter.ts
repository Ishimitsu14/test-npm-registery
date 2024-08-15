import { NullableObject } from '@ddd/core';
import { Entity } from '@ddd/domain';
import { AndSpecification, EmptySpecification, NotSpecification, OrSpecification, Specification } from '@ddd/specifications';
import { CompositeFilter } from '@schema/core';

export function compositeFilter<TFilterRaw, TEntity extends Entity>(
  payload: CompositeFilter<TFilterRaw>,
  callback: (rawFilter: TFilterRaw, specs: Specification<TEntity>[]) => void,
): Specification<TEntity> {
  const specs: Specification<TEntity>[] = [];

  if (NullableObject.hasValue(payload.AND)) {
    specs.push(AndSpecification.create(payload.AND.filter(Boolean).map((subFilter) => compositeFilter(subFilter, callback))));
  }

  if (NullableObject.hasValue(payload.OR)) {
    specs.push(OrSpecification.create(payload.OR.filter(Boolean).map((subFilter) => compositeFilter(subFilter, callback))));
  }

  if (NullableObject.hasValue(payload.NOT) && payload.NOT) {
    specs.push(NotSpecification.create(compositeFilter(payload.NOT, callback)));
  }

  callback(<TFilterRaw>payload, specs);

  return specs.length === 0 ? EmptySpecification.create() : specs.length === 1 ? specs[0] : AndSpecification.create(specs);
}
