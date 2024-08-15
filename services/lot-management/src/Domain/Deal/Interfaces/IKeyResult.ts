import { IValueObject } from '@ddd/domain';

import { KeyResultStatus, KeyResultType } from '../Enums';

export interface IKeyResult extends IValueObject {
  readonly status: KeyResultStatus;
  readonly type: KeyResultType;

  inProcess(): IKeyResult;
  complete(): IKeyResult;
  fail(): IKeyResult;
}
