import { StateObject } from '@ddd/domain';

import { KeyResultStatus, KeyResultType } from '../Enums';
import { IKeyResult } from '../Interfaces';

export type OfferMakerValidationKRState = {
  status: KeyResultStatus;
};

export class OfferMakerValidationKR extends StateObject<OfferMakerValidationKRState> implements IKeyResult {
  static createNew() {
    return new OfferMakerValidationKR(KeyResultStatus.NEW);
  }

  static fromSnapshot(status: KeyResultStatus) {
    return new OfferMakerValidationKR(status);
  }

  protected constructor(status: KeyResultStatus) {
    super();

    this.initState({ status });
  }

  get type() {
    return KeyResultType.OFFER_MAKER_VALIDATION;
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
