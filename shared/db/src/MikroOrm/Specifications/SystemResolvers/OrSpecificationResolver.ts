import { Entity } from '@ddd/domain';
import { ISnapshotEntity } from '@ddd/infra';
import { OrSpecification } from '@ddd/specifications';
import { SelectQueryBuilder } from '@mikro-orm/postgresql';

import { MikroOrmSpecificationResolver } from '../MikroOrmSpecificationResolver';

export class OrSpecificationResolver<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>> extends MikroOrmSpecificationResolver<OrSpecification<TEntity>, TSnapshot> {
  setup(): void {
    // this.addPredicate((spec, payload) => (builder) => {
    //   const subQueries = spec.innerSpecifications.map((subSpec) => {
    //     const subQuery = payload.manager.resolve(subSpec, payload);
    //     const subQueryBuilder = subQuery(builder.clone() as SelectQueryBuilder<TSnapshot>);

    //     return subQueryBuilder;
    //   });

    //   const em = payload.repository.em;
    //   const primaryKeys = em.getMetadata(payload.repository.SnapshotType).primaryKeys;
    //   return builder.where({ $or: subQueries.map((m) => m.select(primaryKeys).getKnexQuery()) });
    // });

    this.addPredicate(async (spec, repo) => {
      const subPredicates = await Promise.all(spec.orSpecifications.map((subSpec) => this.queryResolver.resolveSpecification(subSpec, repo)));

      return (builder) => {
        const subQueries = subPredicates.map((predicate) => predicate(builder.clone() as SelectQueryBuilder<TSnapshot>));
        return builder.where({ $or: subQueries.map((m) => m['_cond']) });
      };
    });
  }
}
