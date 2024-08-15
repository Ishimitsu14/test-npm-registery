import { NullableObject } from '@ddd/core';
import { ISnapshot } from '@ddd/infra';
import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property, Ref, Reference } from '@mikro-orm/core';

import { Note, NotePK } from '../../../../../Domain';

@Entity({ tableName: 'note' })
export class NoteSnapshot extends BaseEntity implements ISnapshot<Note> {
  private constructor() {
    super();
  }

  @PrimaryKey()
  id: string;

  @Property({ name: 'namespace', type: 'varchar' })
  namespace: string;

  @Property({ name: 'entity', type: 'varchar' })
  entity: string;

  @Property({ name: 'entity_pk', type: 'varchar' })
  entityPk: string;

  @Property({ name: 'owner_pk', type: 'varchar', nullable: true })
  ownerPk?: string;

  @Property({ name: 'text', type: 'text' })
  text: string;

  @ManyToOne({ entity: () => NoteSnapshot, ref: true, nullable: true })
  parentNote?: Ref<NoteSnapshot>;

  @Property({ name: 'created_at', nullable: false })
  createdAt: Date;

  applyPK(primaryKey: NotePK) {
    this.id = primaryKey.id;
  }

  applyDomain(domain: Note) {
    this.id = domain.primaryKey.id;
    this.parentNote = NullableObject.mapNull(domain.parentNotePk, (m) => Reference.createFromPK(NoteSnapshot, m.id));
    this.namespace = domain.namespace;
    this.entity = domain.entity;
    this.entityPk = domain.entityPk;
    this.ownerPk = NullableObject.mapNull(domain.ownerPk, (m) => m);
    this.text = domain.text;
    this.createdAt = domain.createdAt;
  }

  toDomain(): Note {
    const notePK = NotePK.raw(this.id);

    const parentNotePk = NullableObject.mapNull(this.parentNote, (m) => NotePK.raw(m.id));

    return Note.fromSnapshot(notePK, this.namespace, this.entity, this.entityPk, this.text, this.createdAt, this.ownerPk, parentNotePk);
  }
}
