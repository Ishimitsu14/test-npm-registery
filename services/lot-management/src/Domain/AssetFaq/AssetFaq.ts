import { AggregateRoot } from '@ddd/domain';

import { AssetPK } from '../Asset';
import { AssetFaqPK } from './AssetFaqPK';

export class AssetFaq extends AggregateRoot<AssetFaqPK> {
  static createNew(primaryKey: AssetFaqPK, assetPK: AssetPK, question: string, answer: string) {
    return new AssetFaq(primaryKey, assetPK, question, answer, new Date());
  }

  static fromSnapshot(primaryKey: AssetFaqPK, assetPK: AssetPK, question: string, answer: string, createdAt: Date) {
    return new AssetFaq(primaryKey, assetPK, question, answer, createdAt);
  }

  readonly primaryKey: AssetFaqPK;

  private _assetPK: AssetPK;

  private _question: string;
  private _answer: string;
  private _createdAt: Date;

  private constructor(primaryKey: AssetFaqPK, assetPK: AssetPK, question: string, answer: string, createdAt: Date) {
    super();

    this.primaryKey = primaryKey;

    this._assetPK = assetPK;
    this._question = question;
    this._answer = answer;
    this._createdAt = createdAt;
  }

  get assetPK() {
    return this._assetPK;
  }

  get question() {
    return this._question;
  }

  get answer() {
    return this._answer;
  }

  get createdAt() {
    return this._createdAt;
  }

  update(asset: AssetPK, question: string, answer: string) {
    this._assetPK = asset;
    this._question = question;
    this._answer = answer;
  }
}
