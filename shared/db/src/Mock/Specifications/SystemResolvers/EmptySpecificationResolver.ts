import { Entity } from '@ddd/domain';
import { EmptySpecification } from '@ddd/specifications';

import { MockSpecificationResolver } from '../MockSpecificationResolver';

export class EmptySpecificationResolver<TEntity extends Entity> extends MockSpecificationResolver<EmptySpecification<TEntity>> {
  setup(): void {}
}
