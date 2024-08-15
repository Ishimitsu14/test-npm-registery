import { AggregateRoot } from '@ddd/domain';

import { LotBadgePK } from './LotBadgePK';

export class LotBadge extends AggregateRoot<LotBadgePK> {
  static createNew(primaryKey: LotBadgePK, sort: number) {
    return new LotBadge(primaryKey, sort, new Date());
  }

  static fromSnapshot(primaryKey: LotBadgePK, sort: number, createdAt: Date) {
    return new LotBadge(primaryKey, sort, createdAt);
  }

  readonly primaryKey: LotBadgePK;

  private readonly _sort: number;

  private _createdAt: Date;

  private constructor(primaryKey: LotBadgePK, sort: number, createdAt: Date) {
    super();

    this.primaryKey = primaryKey;
    this._sort = sort;
    this._createdAt = createdAt;
  }

  get sort() {
    return this._sort;
  }

  get createdAt() {
    return this._createdAt;
  }
}
