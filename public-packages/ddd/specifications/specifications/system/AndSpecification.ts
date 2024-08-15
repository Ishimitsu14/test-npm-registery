import { Entity, ValueObjectAtomicValue } from '../../domain';
import { mapManyArray } from '../../utils';
import { Specification } from '../Specification';

export class AndSpecification<TEntity extends Entity> extends Specification<TEntity> {
  static create<TEntity extends Entity>(...specs: (Specification<TEntity> | Specification<TEntity>[])[]): Specification<TEntity> {
    const innerSpecifications = mapManyArray(specs);

    if (innerSpecifications.length === 1) return innerSpecifications[0];
    return new AndSpecification<TEntity>(innerSpecifications);
  }

  private constructor(readonly andSpecifications: Specification<TEntity>[]) {
    super();

    this.addFilter((entity) => andSpecifications.every((spec) => spec.isSatisfied(entity)));

    if (this.andSpecifications.some((spec) => spec.isLockedLocalSpecify)) {
      this.lockLocalSpecify();
    }
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { innerSpecifications: this.andSpecifications };
  }
}
