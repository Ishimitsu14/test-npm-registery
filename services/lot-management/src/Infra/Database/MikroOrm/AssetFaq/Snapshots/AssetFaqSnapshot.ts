import { ISnapshotEntity } from '@ddd/infra';
import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref, Reference } from '@mikro-orm/core';

import { AssetFaq, AssetFaqPK, AssetPK } from '../../../../../Domain';
import { AssetSnapshot } from '../../Asset';

@Entity({ tableName: 'asset_faq' })
export class AssetFaqSnapshot extends BaseEntity implements ISnapshotEntity<AssetFaq> {
  private constructor() {
    super();
  }

  @PrimaryKey({ name: 'id' })
  id: string;

  @ManyToOne({ entity: () => AssetSnapshot, ref: true })
  asset: Ref<AssetSnapshot>;

  @Property({ name: 'question', type: 'text' })
  question: string;

  @Property({ name: 'answer', type: 'text' })
  answer: string;

  @Property({ name: 'created_at' })
  createdAt: Date;

  applyPK(primaryKey: AssetFaqPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: AssetFaq): void {
    this.id = domain.primaryKey.id;
    this.asset = Reference.createFromPK(AssetSnapshot, domain.assetPK.id);
    this.question = domain.question;
    this.answer = domain.answer;
    this.createdAt = domain.createdAt;
  }

  toDomain(): AssetFaq {
    return AssetFaq.fromSnapshot(AssetFaqPK.raw(this.id), AssetPK.fromSnapshot(this.asset.id), this.question, this.answer, this.createdAt);
  }
}
