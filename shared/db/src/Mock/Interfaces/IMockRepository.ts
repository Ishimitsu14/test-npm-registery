import { Entity } from '@ddd/domain';
import { IRepository } from '@ddd/infra';
import { IQueryRepository } from '@ddd/specifications';

export interface IMockRepository<TEntity extends Entity> extends IRepository<TEntity>, IQueryRepository<TEntity> {}
