import { StateObject } from '@ddd/domain';

import { KeyResultStatus, KeyResultType } from '../Enums';
import { IKeyResult } from '../Interfaces';

export type AMLValidationKRState = {
  status: KeyResultStatus;
};

export class AMLValidationKR extends StateObject<AMLValidationKRState> implements IKeyResult {
  static createNew() {
    return new AMLValidationKR(KeyResultStatus.NEW);
  }

  static fromSnapshot(status: KeyResultStatus) {
    return new AMLValidationKR(status);
  }

  protected constructor(status: KeyResultStatus) {
    super();

    this.initState({ status });
  }

  get type() {
    return KeyResultType.AML_VALIDATION;
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
