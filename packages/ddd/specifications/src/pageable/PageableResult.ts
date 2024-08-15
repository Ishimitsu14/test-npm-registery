import { NullableObject } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

import { Pageable } from './Pageable';

export class PageableResult<T extends ValueObjectAtomicValue> extends ValueObject {
  static create<T extends ValueObjectAtomicValue>(items: (T | NullableObject)[], count: number, pageable: Pageable) {
    const notNullable = items.filter((m) => NullableObject.hasValue(m)) as T[];
    return new PageableResult(notNullable, count, pageable);
  }

  private readonly _items: T[];
  private readonly _count: number;
  private readonly _pageable: Pageable;

  private constructor(items: T[], count: number, pageable: Pageable) {
    super();

    this._items = items;
    this._count = count;
    this._pageable = pageable;
  }

  get items() {
    return this._items;
  }

  get count() {
    return this._count;
  }

  get pageable() {
    return this._pageable;
  }

  mapTo<U extends ValueObjectAtomicValue>(callbackfn: (value: T, index: number, array: T[]) => U): PageableResult<U> {
    return PageableResult.create(this.items.map(callbackfn), this.count, this.pageable);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this._items, this._count, this._pageable];
  }
}
