import { Entity } from '@ddd/domain';

export type SpecificationFilter<TEntity extends Entity> = (item: TEntity) => boolean;
