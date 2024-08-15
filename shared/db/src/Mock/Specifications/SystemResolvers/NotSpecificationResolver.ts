import { Entity } from '@ddd/domain';
import { NotSpecification } from '@ddd/specifications';

import { MockSpecificationResolver } from '../MockSpecificationResolver';

export class NotSpecificationResolver<TEntity extends Entity> extends MockSpecificationResolver<NotSpecification<TEntity>> {
  setup(): void {
    this.addPredicate(async (spec, payload) => {
      const subQuery = await this.queryResolver.resolveSpecification(spec.notSpecification, payload);

      return async (entities) => {
        const trueEntities = await subQuery(entities);

        return entities.filter((entity) => trueEntities.findIndex((trueEntity) => trueEntity.isEquals(entity)) === -1);
      };
    });
  }
}
