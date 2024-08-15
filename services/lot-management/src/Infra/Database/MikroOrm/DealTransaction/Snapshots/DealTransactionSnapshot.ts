import { ISnapshotEntity } from '@ddd/infra';
import { Entity, ManyToOne, PrimaryKey, Ref, Reference } from '@mikro-orm/core';
import { DealPK, DealTransaction, DealTransactionPK, DealTransactionStatus } from 'services/lot-management/src/Domain';

import { DealSnapshot } from '../../Deal';
import { DealTransactionStatusSnapshot } from './Enums';

@Entity({ tableName: 'deal_transaction' })
export class DealTransactionSnapshot implements ISnapshotEntity<DealTransaction> {
  @PrimaryKey({ fieldName: 'id', type: 'varchar' })
  id: string;

  @DealTransactionStatusSnapshot({ fieldName: 'status' })
  status: DealTransactionStatusSnapshot;

  // References
  @ManyToOne({ entity: () => DealSnapshot, inversedBy: (deal) => deal.transactions, ref: true })
  deal: Ref<DealSnapshot>;

  applyPK(primaryKey: DealTransactionPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: DealTransaction): void {
    this.id = domain.primaryKey.id;
    this.deal = Reference.createFromPK(DealSnapshot, domain.dealPK.id);
    this.status = domain.status.id;
  }

  toDomain(): DealTransaction {
    return DealTransaction.fromSnapshot(DealTransactionPK.fromSnapshot(this.id), DealPK.fromSnapshot(this.deal.id), DealTransactionStatus.getById(this.status));
  }
}
