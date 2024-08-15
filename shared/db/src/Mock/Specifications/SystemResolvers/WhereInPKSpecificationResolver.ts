import { Entity } from '@ddd/domain';
import { WhereInPKSpecification } from '@ddd/specifications';

import { MockSpecificationResolver } from '../MockSpecificationResolver';

export class WhereInPKSpecificationResolver<TEntity extends Entity> extends MockSpecificationResolver<WhereInPKSpecification<TEntity>> {
  setup(): void {
    this.addPredicate(async (spec, payload) => async (entities) => {
      return entities.filter((entity) => spec.primaryKeys.findIndex((key) => key.isEquals(entity.primaryKey)) !== -1);
    });
  }
}
