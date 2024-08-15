import { ISnapshot } from '@ddd/infra';
import { Embeddable } from '@mikro-orm/core';
import { DocumentResignedKR, KeyResultStatus } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class DocumentResignedKRSnapshot implements ISnapshot<DocumentResignedKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  applyDomain(domain: DocumentResignedKR): void {
    this.status = domain.status.id;
  }

  toDomain(): DocumentResignedKR {
    return DocumentResignedKR.fromSnapshot(KeyResultStatus.getById(this.status));
  }
}
