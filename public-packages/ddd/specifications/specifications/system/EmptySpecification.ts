import { Entity, ValueObjectAtomicValue } from '../../domain';
import { Specification } from '../Specification';

export class EmptySpecification<TEntity extends Entity> extends Specification<TEntity> {
  static create<TEntity extends Entity>() {
    return new EmptySpecification<TEntity>();
  }

  private constructor() {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [];
  }
}
