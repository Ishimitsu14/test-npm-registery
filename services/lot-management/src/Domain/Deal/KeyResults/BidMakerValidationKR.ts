import { StateObject } from '@ddd/domain';

import { KeyResultStatus, KeyResultType } from '../Enums';
import { IKeyResult } from '../Interfaces';

export type BidMakerValidationKRState = {
  status: KeyResultStatus;
};

export class BidMakerValidationKR extends StateObject<BidMakerValidationKRState> implements IKeyResult {
  static createNew() {
    return new BidMakerValidationKR(KeyResultStatus.NEW);
  }

  static fromSnapshot(status: KeyResultStatus) {
    return new BidMakerValidationKR(status);
  }

  protected constructor(status: KeyResultStatus) {
    super();

    this.initState({ status });
  }

  get type() {
    return KeyResultType.BID_MAKER_VALIDATION;
  }

  get status() {
    return this.state.status;
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
