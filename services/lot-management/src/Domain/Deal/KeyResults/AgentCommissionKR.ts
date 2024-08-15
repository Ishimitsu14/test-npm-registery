import { StateObject } from '@ddd/domain';

import { KeyResultStatus, KeyResultType } from '../Enums';
import { IKeyResult } from '../Interfaces';

export type AgentCommissionKRState = {
  status: KeyResultStatus;
};

export class AgentCommissionKR extends StateObject<AgentCommissionKRState> implements IKeyResult {
  static createNew() {
    return new AgentCommissionKR(KeyResultStatus.NEW);
  }

  static fromSnapshot(status: KeyResultStatus) {
    return new AgentCommissionKR(status);
  }

  protected constructor(status: KeyResultStatus) {
    super();

    this.initState({ status });
  }

  get type() {
    return KeyResultType.AGENT_COMMISSION;
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
