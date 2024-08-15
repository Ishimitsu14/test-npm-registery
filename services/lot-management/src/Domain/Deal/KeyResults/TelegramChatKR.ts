import { Nullable, NullableObject } from '@ddd/core';
import { StateObject } from '@ddd/domain';

import { KeyResultStatus, KeyResultType } from '../Enums';
import { IKeyResult } from '../Interfaces';

export type TelegramChatKRState = {
  status: KeyResultStatus;
  url: Nullable<string>;
};

export class TelegramChatKR extends StateObject<TelegramChatKRState> implements IKeyResult {
  static createNew() {
    return new TelegramChatKR({ status: KeyResultStatus.NEW, url: NullableObject });
  }

  static fromSnapshot(status: KeyResultStatus, url: Nullable<string>) {
    return new TelegramChatKR({ status, url } as TelegramChatKRState);
  }

  protected constructor(state: TelegramChatKRState) {
    super();

    this.initState(state);
  }

  get type() {
    return KeyResultType.TELEGRAM_CHAT;
  }

  get status() {
    return this.state.status;
  }

  updateURL(url: Nullable<string>) {
    return this.set('url', url);
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
