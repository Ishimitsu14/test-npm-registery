import { ISnapshot } from '@ddd/infra';
import { Embeddable } from '@mikro-orm/core';
import { DocumentOwnershipKR, KeyResultStatus } from 'services/lot-management/src/Domain';

import { KeyResultStatusSnapshot } from '../Enums';

@Embeddable()
export class DocumentOwnershipKRSnapshot implements ISnapshot<DocumentOwnershipKR> {
  @KeyResultStatusSnapshot({ fieldName: 'status' })
  status: KeyResultStatusSnapshot;

  applyDomain(domain: DocumentOwnershipKR): void {
    this.status = domain.status.id;
  }

  toDomain(): DocumentOwnershipKR {
    return DocumentOwnershipKR.fromSnapshot(KeyResultStatus.getById(this.status));
  }
}
