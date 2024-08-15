import { Entity } from '@ddd/domain';
import { AndSpecification } from '@ddd/specifications';

import { MockSpecificationResolver } from '../MockSpecificationResolver';

export class AndSpecificationResolver<TEntity extends Entity> extends MockSpecificationResolver<AndSpecification<TEntity>> {
  setup(): void {
    this.addPredicate(async (spec, payload) => {
      const subQueries = await Promise.all(spec.andSpecifications.map((spec) => this.queryResolver.resolveSpecification(spec, payload)));

      return async (entities) => {
        for (const subQuery of subQueries) {
          entities = (await subQuery(entities)) as TEntity[];
        }
        return entities;
      };
    });
  }
}
