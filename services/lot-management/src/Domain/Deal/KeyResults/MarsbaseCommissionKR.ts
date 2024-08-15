import { StateObject } from '@ddd/domain';
import { LotInvalidStateError } from '@schema/common';

import { Percent } from '../../Common';
import { KeyResultStatus, KeyResultType } from '../Enums';
import { IKeyResult } from '../Interfaces';

export type MarsbaseCommissionKRState = {
  status: KeyResultStatus;
  percent: Percent;
};

export class MarsbaseCommissionKR extends StateObject<MarsbaseCommissionKRState> implements IKeyResult {
  static createNew(percent: Percent) {
    return new MarsbaseCommissionKR(KeyResultStatus.NEW, percent);
  }

  static fromSnapshot(status: KeyResultStatus, percent: Percent) {
    return new MarsbaseCommissionKR(status, percent);
  }

  protected constructor(status: KeyResultStatus, percent: Percent) {
    super();

    this.initState({ status, percent });
  }

  get type() {
    return KeyResultType.MARSBASE_COMMISSION;
  }

  get status() {
    return this.get('status');
  }

  updateCommission(percent: Percent) {
    if (this.status.isEquals(KeyResultStatus.COMPLETED)) throw new LotInvalidStateError();

    return this.set('percent', percent);
  }

  inProcess() {
    return this.set('status', KeyResultStatus.PROCESS);
  }

  complete() {
    return this.set('status', KeyResultStatus.COMPLETED);
  }

  fail() {
    return this.set('status', KeyResultStatus.FAILED);
  }
}
