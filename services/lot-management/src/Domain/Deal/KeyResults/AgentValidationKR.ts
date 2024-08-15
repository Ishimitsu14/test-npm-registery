import { StateObject } from '@ddd/domain';

import { KeyResultStatus, KeyResultType } from '../Enums';
import { IKeyResult } from '../Interfaces';

export type AgentValidationKRState = {
  status: KeyResultStatus;
};

export class AgentValidationKR extends StateObject<AgentValidationKRState> implements IKeyResult {
  static createNew() {
    return new AgentValidationKR(KeyResultStatus.NEW);
  }

  static fromSnapshot(status: KeyResultStatus) {
    return new AgentValidationKR(status);
  }

  protected constructor(status: KeyResultStatus) {
    super();

    this.initState({ status });
  }

  get type() {
    return KeyResultType.AGENT_VALIDATION;
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
