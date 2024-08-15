import { Entity } from '@ddd/domain';
import { ISnapshotEntity } from '@ddd/infra';
import { WhereInPKSpecification } from '@ddd/specifications';

import { MikroOrmSpecificationResolver } from '../MikroOrmSpecificationResolver';

export class WhereInPKSpecificationResolver<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>> extends MikroOrmSpecificationResolver<WhereInPKSpecification<TEntity>, TSnapshot> {
  setup(): void {
    this.addWhere(async (spec, repo) => spec.primaryKeys.map((key) => repo.createSnapshotFromPK(key)));
  }
}
