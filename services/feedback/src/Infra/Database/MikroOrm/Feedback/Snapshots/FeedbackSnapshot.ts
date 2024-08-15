import { ISnapshot } from '@ddd/infra';
import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

import { Feedback, FeedbackPK } from '../../../../../Domain';

@Entity({ tableName: 'feedback' })
export class FeedbackSnapshot extends BaseEntity implements ISnapshot<Feedback> {
  private constructor() {
    super();
  }

  @PrimaryKey()
  id: string;

  @Property({ name: 'text', type: 'text' })
  text: string;

  @Property({ name: 'page', type: 'varchar' })
  page: string;

  @Property({ name: 'rating', type: 'numeric' })
  rating: number;

  @Property({ name: 'user_pk' })
  userPk: string;

  @Property({ name: 'created_at', nullable: false })
  createdAt: Date;

  applyPK(primaryKey: FeedbackPK) {
    this.id = primaryKey.id;
  }

  applyDomain(domain: Feedback) {
    this.id = domain.primaryKey.id;
    this.text = domain.text;
    this.page = domain.page;
    this.rating = domain.rating;
    this.userPk = domain.userPk;
    this.createdAt = domain.createdAt;
  }

  toDomain(): Feedback {
    const feedbackPK = FeedbackPK.raw(this.id);

    return Feedback.fromSnapshot(feedbackPK, this.text, this.page, this.rating, this.userPk, this.createdAt);
  }
}
