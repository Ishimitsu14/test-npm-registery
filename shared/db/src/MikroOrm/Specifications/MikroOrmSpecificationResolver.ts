import { ISnapshotEntity } from '@ddd/infra';
import { Specification, SpecificationInferEntity, SpecificationResolver } from '@ddd/specifications';

import { MikroOrmQueryResolver } from '../MikroOrmQueryResolver';
import { MikroOrmSpecification, MikroOrmSpecificationPredicate } from '../types';

export abstract class MikroOrmSpecificationResolver<
  TSpecification extends Specification<any>,
  TSnapshot extends ISnapshotEntity<SpecificationInferEntity<TSpecification>>,
> extends SpecificationResolver<MikroOrmSpecificationPredicate<TSpecification, TSnapshot>> {
  abstract setup(): void;

  get queryResolver(): MikroOrmQueryResolver {
    return <MikroOrmQueryResolver>super.queryResolver;
  }

  protected addWhere(filter: MikroOrmSpecification<TSpecification, TSnapshot>) {
    return this.addPredicate(async (spec, repository) => {
      const filterQuery = await filter(spec, repository);

      return (builder) => builder.where(filterQuery);
    });
  }

  // getRootPredicate(): MikroOrmSpecificationPredicate<TSpecification, TSnapshot> {
  //   return async (specification, repository) => {
  //     const rawPredicates = this.predicates.slice();
  //     const rawFilters = Promise.all(rawPredicates.map((predicate) => predicate(specification, repository)));

  //     // if (specification.childSpecifications.length > 0) {
  //     //   const childFilters = this.getResult(
  //     //     specification.childSpecifications.length === 1 ? specification.childSpecifications[0] : AndSpecification.create(specification.childSpecifications),
  //     //     repository,
  //     //   );
  //     //   return Promise.all([rawFilters, childFilters]).then(([raw, child]) => [...raw, ...child]);
  //     // }

  //     // return rawFilters;

  //     // return (builder) => filters.reduce((builder, filter) => filter(builder), builder);

  //     return (builder) => builder;
  //   };
  // }
}
