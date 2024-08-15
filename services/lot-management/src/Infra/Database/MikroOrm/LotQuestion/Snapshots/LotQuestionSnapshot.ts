import { NullableObject } from '@ddd/core';
import { ISnapshotEntity } from '@ddd/infra';
import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref, Reference } from '@mikro-orm/core';

import { LotPK, LotQuestion, LotQuestionPK, LotQuestionStatus, UserPK } from '../../../../../Domain';
import { LotSnapshot } from '../../Lot';
import { LotQuestionStatusSnapshot } from './Enums';

@Entity({ tableName: 'lot_question' })
export class LotQuestionSnapshot extends BaseEntity implements ISnapshotEntity<LotQuestion> {
  private constructor() {
    super();
  }

  @PrimaryKey({ name: 'id' })
  id: string;

  @Property({ fieldName: 'user_id', type: 'varchar' })
  userId: string;

  @ManyToOne({ entity: () => LotSnapshot, ref: true })
  lot: Ref<LotSnapshot>;

  @ManyToOne({ entity: () => LotQuestionSnapshot, ref: true, nullable: true })
  parentLotQuestion?: Ref<LotQuestionSnapshot>;

  @Property({ name: 'text', type: 'text' })
  text: string;

  @LotQuestionStatusSnapshot({ fieldName: 'status' })
  status: LotQuestionStatusSnapshot;

  @Property({ name: 'created_at' })
  createdAt: Date;

  applyPK(primaryKey: LotQuestionPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: LotQuestion): void {
    this.id = domain.primaryKey.id;
    this.userId = domain.userPK.id;
    this.lot = Reference.createFromPK(LotSnapshot, domain.lotPK.id);
    this.text = domain.text;
    this.status = domain.status.id;
    this.createdAt = domain.createdAt;

    if (!NullableObject.isEmpty(domain.parentLotQuestionPK)) {
      this.parentLotQuestion = Reference.createFromPK(LotQuestionSnapshot, domain.parentLotQuestionPK.id);
    }
  }

  toDomain(): LotQuestion {
    return LotQuestion.fromSnapshot(
      LotQuestionPK.raw(this.id),
      UserPK.raw(this.userId),
      LotPK.fromSnapshot(this.lot.id),
      this.text,
      NullableObject.map(this.parentLotQuestion, (v) => LotQuestionPK.raw(v.id)),
      LotQuestionStatus.getById(this.status),
      this.createdAt,
    );
  }
}
