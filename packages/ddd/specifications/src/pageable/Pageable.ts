import { Nullable, NullableObject } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

export class Pageable extends ValueObject {
  static create(skip?: Nullable<number>, limit?: Nullable<number>) {
    return new Pageable(NullableObject(skip, 0), NullableObject(limit, 5000));
  }

  static firstPage(limit: number): Pageable {
    return Pageable.create(0, limit);
  }

  static defaults() {
    return Pageable.create();
  }

  private readonly _skip: number;
  private readonly _limit: number;

  private constructor(skip: number, limit: number) {
    super();

    const _skip = Math.floor(skip);
    const _limit = Math.floor(limit);

    this._skip = _skip <= 0 ? 0 : _skip;
    this._limit = _limit <= 0 ? 0 : _limit;
  }

  get skip() {
    return this._skip;
  }

  get limit() {
    return this._limit;
  }

  firstPage(): Pageable {
    return new Pageable(0, this._limit);
  }

  nextPage(): Pageable {
    return new Pageable(this._skip + this._limit, this._limit);
  }

  previousOrFirstPage(): Pageable {
    const nextSkip = this._skip - this._limit <= 0 ? 0 : this._skip - this._limit;
    return new Pageable(nextSkip, this._limit);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return { skip: this._skip, limit: this._limit };
  }
}
