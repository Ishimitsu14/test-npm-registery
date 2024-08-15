import { Entity, ValueObjectAtomicValue } from '@ddd/domain';

import { mapManyArray } from '../../utils';
import { Specification } from '../Specification';

export class OrSpecification<TEntity extends Entity> extends Specification<TEntity> {
  static create<TEntity extends Entity>(...specs: (Specification<TEntity> | Specification<TEntity>[])[]) {
    const innerSpecifications = mapManyArray(specs);
    return new OrSpecification<TEntity>(innerSpecifications);
  }

  private constructor(readonly orSpecifications: Specification<TEntity>[]) {
    super();

    this.addFilter((entity) => orSpecifications.some((spec) => spec.isSatisfied(entity)));

    if (this.orSpecifications.some((spec) => spec.isLockedLocalSpecify)) {
      this.lockLocalSpecify();
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.orSpecifications];
  }
}
