import { Entity } from '@ddd/domain';
import { ISnapshotEntity } from '@ddd/infra';
import { NotSpecification } from '@ddd/specifications';
import { SelectQueryBuilder } from '@mikro-orm/postgresql';

import { MikroOrmSpecificationResolver } from '../MikroOrmSpecificationResolver';

export class NotSpecificationResolver<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>> extends MikroOrmSpecificationResolver<NotSpecification<TEntity>, TSnapshot> {
  setup(): void {
    // this.addPredicate(
    //   (query, payload) =>
    //     new NotBrackets((builder) => {
    //       return builder.where(payload.manager.resolve(query.innerSpecification, payload));
    //     }),
    // );

    this.addPredicate(async (spec, repo) => {
      const subPredicate = await this.queryResolver.resolveSpecification(spec.notSpecification, repo);

      return (builder) => {
        const subQuery = subPredicate(builder.clone() as SelectQueryBuilder<TSnapshot>);

        return builder.where({ $not: subQuery['_cond'] });
      };
    });
  }
}
