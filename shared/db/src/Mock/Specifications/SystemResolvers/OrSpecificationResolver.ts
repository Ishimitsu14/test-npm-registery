import { Entity } from '@ddd/domain';
import { OrSpecification } from '@ddd/specifications';

import { MockSpecificationResolver } from '../MockSpecificationResolver';

export class OrSpecificationResolver<TEntity extends Entity> extends MockSpecificationResolver<OrSpecification<TEntity>> {
  setup(): void {
    this.addPredicate(async (spec, payload) => {
      const subQueries = await Promise.all(spec.orSpecifications.map((spec) => this.queryResolver.resolveSpecification(spec, payload)));

      return async (entities) => {
        const trueEntities: TEntity[] = [];

        for (const subQuery of subQueries) {
          const groupEntities = (await subQuery(entities)) as TEntity[];
          trueEntities.push(...groupEntities);
        }

        const uniqueEntities: TEntity[] = [];
        for (const trueEntity of trueEntities) {
          if (uniqueEntities.findIndex((m) => m.isEquals(trueEntity)) === -1) {
            uniqueEntities.push(trueEntity);
          }
        }

        return uniqueEntities;
      };
    });
  }
}
