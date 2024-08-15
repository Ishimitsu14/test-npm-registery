import { Entity } from '@ddd/domain';
import { ISnapshotEntity } from '@ddd/infra';
import { AndSpecification } from '@ddd/specifications';
import { SelectQueryBuilder } from '@mikro-orm/postgresql';

import { MikroOrmSpecificationResolver } from '../MikroOrmSpecificationResolver';

export class AndSpecificationResolver<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>> extends MikroOrmSpecificationResolver<AndSpecification<TEntity>, TSnapshot> {
  setup(): void {
    // this.addPredicate(
    //   (query, payload) =>
    //     new Brackets((builder) => {
    //       for (const subQuery of query.innerSpecifications) {
    //         builder = builder.andWhere(payload.manager.resolve(subQuery, payload));
    //       }
    //       return builder;
    //     }),
    // );

    this.addPredicate(async (spec, repo) => {
      const andFilters = await Promise.all(spec.andSpecifications.map((subSpec) => this.queryResolver.resolveSpecification(subSpec, repo)));

      return (builder) => {
        const subQueries = andFilters.map((predicate) => predicate(builder.clone() as SelectQueryBuilder<TSnapshot>));
        return builder.where({ $and: subQueries.map((m) => m['_cond']) });
      };
    });
  }
}
