import { Entity } from '@ddd/domain';
import { ISnapshotEntity } from '@ddd/infra';
import { EmptySpecification } from '@ddd/specifications';

import { MikroOrmSpecificationResolver } from '../MikroOrmSpecificationResolver';

export class EmptySpecificationResolver<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>> extends MikroOrmSpecificationResolver<EmptySpecification<TEntity>, TSnapshot> {
  setup(): void {}
}
