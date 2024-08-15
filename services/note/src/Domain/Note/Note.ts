import { Nullable } from '@ddd/core';
import { AggregateRoot } from '@ddd/domain';

import { NotePK } from './NotePK';

export class Note extends AggregateRoot<NotePK> {
  static create(primaryKey: NotePK, namespace: string, entity: string, entityPK: string, text: string, ownerPk?: Nullable<string>, parentNotePk?: Nullable<NotePK>) {
    return new Note(primaryKey, namespace, entity, entityPK, text, new Date(), ownerPk, parentNotePk);
  }

  static fromSnapshot(primaryKey: NotePK, namespace: string, entity: string, entityPK: string, text: string, createdAt: Date, ownerPk: Nullable<string>, parentNotePk: Nullable<NotePK>) {
    return new Note(primaryKey, namespace, entity, entityPK, text, createdAt, ownerPk, parentNotePk);
  }

  private readonly _primaryKey: NotePK;

  private _text: string;

  private _ownerPk: Nullable<string>;
  private _parentNotePk: Nullable<NotePK>;

  private readonly _namespace: string;
  private readonly _entity: string;
  private readonly _entityPk: string;

  private readonly _createdAt: Date;

  private constructor(primaryKey: NotePK, namespace: string, entity: string, entityPK: string, text: string, createdAt: Date, ownerPk: Nullable<string>, parentNotePk: Nullable<NotePK>) {
    super();
    this._primaryKey = primaryKey;
    this._namespace = namespace;
    this._entity = entity;
    this._entityPk = entityPK;
    this._text = text;
    this._createdAt = createdAt;
    this._ownerPk = ownerPk;
    this._parentNotePk = parentNotePk;
  }

  get primaryKey() {
    return this._primaryKey;
  }

  get text() {
    return this._text;
  }

  get namespace() {
    return this._namespace;
  }

  get entity() {
    return this._entity;
  }

  get entityPk() {
    return this._entityPk;
  }

  get createdAt() {
    return this._createdAt;
  }

  get ownerPk() {
    return this._ownerPk;
  }

  get parentNotePk() {
    return this._parentNotePk;
  }

  setText(text: string) {
    this._text = text;
  }

  setOwnerPk(ownerPk: string) {
    this._ownerPk = ownerPk;
  }

  setParentNotePk(parentNotePk: NotePK) {
    this._parentNotePk = parentNotePk;
  }
}
