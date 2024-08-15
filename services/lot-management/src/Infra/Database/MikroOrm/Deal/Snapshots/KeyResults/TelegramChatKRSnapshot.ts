import { NullableObject } from '@ddd/core';
import { ISnapshot } from '@ddd/infra';
import { Embeddable, Property } from '@mikro-orm/core';
import { KeyResultStatus, TelegramChatKR } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class TelegramChatKRSnapshot implements ISnapshot<TelegramChatKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  @Property({ fieldName: 'url', type: 'varchar', nullable: true })
  url?: string;

  applyDomain(domain: TelegramChatKR): void {
    this.status = domain.status.id;
    this.url = NullableObject.mapNull(domain.state.url);
  }

  toDomain(): TelegramChatKR {
    return TelegramChatKR.fromSnapshot(KeyResultStatus.getById(this.status), NullableObject.map(this.url));
  }
}
