import { AggregateRoot } from '@ddd/domain';

import { DealPK } from '../Deal';
import { DealTransactionPK } from './DealTransactionPK';
import { DealTransactionStatus } from './Enums';
import { DealTransactionExecutedEvent, DealTransactionFailedEvent, DealTransactionReservedEvent } from './Events';

export class DealTransaction extends AggregateRoot<DealTransactionPK> {
  static createReserve(pk: DealTransactionPK, dealPK: DealPK) {
    const transaction = new DealTransaction(pk, dealPK, DealTransactionStatus.RESERVED);

    transaction.addEvent(new DealTransactionReservedEvent(transaction));

    return transaction;
  }

  static fromSnapshot(pk: DealTransactionPK, dealPK: DealPK, status: DealTransactionStatus) {
    return new DealTransaction(pk, dealPK, status);
  }

  readonly primaryKey: DealTransactionPK;

  private readonly _dealPK: DealPK;
  private _status: DealTransactionStatus;

  private constructor(pk: DealTransactionPK, dealPK: DealPK, status: DealTransactionStatus) {
    super();

    this.primaryKey = pk;

    this._dealPK = dealPK;
    this._status = status;
  }

  get dealPK() {
    return this._dealPK;
  }

  get status() {
    return this._status;
  }

  markAsExecuted() {
    if (this._status.isEquals(DealTransactionStatus.EXECUTED)) return;

    this._status = DealTransactionStatus.EXECUTED;
    this.addEvent(new DealTransactionExecutedEvent(this));
  }

  markAsFailed() {
    if (this._status.isEquals(DealTransactionStatus.FAILED)) return;

    this._status = DealTransactionStatus.FAILED;
    this.addEvent(new DealTransactionFailedEvent(this));
  }
}
