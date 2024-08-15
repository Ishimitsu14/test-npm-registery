import { Equatable, NullableObject } from '../../core';
import { Entity, ValueObject, ValueObjectAtomicValue } from '../../domain';
import { SortableValue } from './SortableValue';

export type SortableInferEntity<T> = T extends Sortable<infer TEntity extends Entity<any>> ? TEntity : never;

export abstract class Sortable<TEntity> extends ValueObject {
  private readonly _sorts: ((a: TEntity, b: TEntity) => number)[] = [];

  constructor(readonly value: SortableValue) {
    super();

    this.initialize();
  }

  get sorts() {
    return this._sorts.slice();
  }

  sort(items: TEntity[]): TEntity[] {
    const rootSort = this.combineSorts(this._sorts);
    return items.slice().sort((a, b) => rootSort(a, b));
  }

  protected abstract initialize(): void;

  protected addSort<K>(callback: (item: TEntity) => K): void {
    return this.addSortRaw((a, b) => {
      const ak = NullableObject.map(a, (a) => callback(a));
      const bk = NullableObject.map(b, (b) => callback(b));

      if (this.value.isEquals(SortableValue.ASC)) {
        const aValue = NullableObject.hasValue(ak) ? ak : 0;
        const bValue = NullableObject.hasValue(bk) ? bk : 0;

        if (Equatable.isEquals(aValue, bValue)) return 0;
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      } else if (this.value.isEquals(SortableValue.ASC_NULLS_FIRST)) {
        if (NullableObject.isEmpty(ak)) return -1;
        if (NullableObject.isEmpty(bk)) return 1;

        if (Equatable.isEquals(ak, bk)) return 0;
        if (ak < bk) return -1;
        if (ak > bk) return 1;
      } else if (this.value.isEquals(SortableValue.ASC_NULLS_LAST)) {
        if (NullableObject.isEmpty(ak)) return 1;
        if (NullableObject.isEmpty(bk)) return -1;

        if (Equatable.isEquals(ak, bk)) return 0;
        if (ak < bk) return -1;
        if (ak > bk) return 1;
      } else if (this.value.isEquals(SortableValue.DESC)) {
        const aValue = NullableObject.hasValue(ak) ? ak : 0;
        const bValue = NullableObject.hasValue(bk) ? bk : 0;

        if (Equatable.isEquals(aValue, bValue)) return 0;
        if (aValue < bValue) return 1;
        if (aValue > bValue) return -1;
      } else if (this.value.isEquals(SortableValue.DESC_NULLS_FIRST)) {
        if (NullableObject.isEmpty(ak)) return -1;
        if (NullableObject.isEmpty(bk)) return 1;

        if (Equatable.isEquals(ak, bk)) return 0;
        if (ak < bk) return 1;
        if (ak > bk) return -1;
      } else if (this.value.isEquals(SortableValue.DESC_NULLS_LAST)) {
        if (NullableObject.isEmpty(ak)) return 1;
        if (NullableObject.isEmpty(bk)) return -1;

        if (Equatable.isEquals(ak, bk)) return 0;
        if (ak < bk) return 1;
        if (ak > bk) return -1;
      }
      return 0;
    });
  }

  protected combineSorts(sorts: ((a: TEntity, b: TEntity) => number)[]): (a: TEntity, b: TEntity) => number {
    return (a, b) => {
      return sorts.reduce((value, sort) => value || sort(a, b), 0);
    };
  }

  protected addSortRaw(callback: (item1: TEntity, item2: TEntity) => number): void {
    this._sorts.push(callback);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { value: this.value };
  }
}
