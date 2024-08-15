import { Entity } from '../../domain';
import { IQueryReadRepository } from './IQueryReadRepository';
import { IQueryWriteRepository } from './IQueryWriteRepository';

export interface IQueryRepository<TEntity extends Entity<any>> extends IQueryReadRepository<TEntity>, IQueryWriteRepository<TEntity> {}
