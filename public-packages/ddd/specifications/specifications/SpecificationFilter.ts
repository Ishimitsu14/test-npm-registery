import { Entity } from '../../domain';

export type SpecificationFilter<TEntity extends Entity> = (item: TEntity) => boolean;
