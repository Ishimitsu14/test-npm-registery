import { AggregateRoot } from '@ddd/domain';

import { AssetPK } from './AssetPK';
import { AssetStatus } from './Enums';
import { AssetArchivedEvent, AssetCreatedEvent, AssetUpdatedInfoEvent } from './Events';
import { AssetInfo } from './ValueObjects';

export class Asset extends AggregateRoot<AssetPK> {
  static create(pk: AssetPK, info: AssetInfo, score: number) {
    const asset = new Asset(pk, info, score, AssetStatus.ACTIVE);
    asset.addEvent(new AssetCreatedEvent(asset));

    return asset;
  }

  static fromSnapshot(primaryKey: AssetPK, info: AssetInfo, score: number, status: AssetStatus) {
    return new Asset(primaryKey, info, score, status);
  }

  readonly primaryKey: AssetPK;

  private _info: AssetInfo;
  private _score: number;
  private _status: AssetStatus;

  private constructor(primaryKey: AssetPK, info: AssetInfo, score: number, status: AssetStatus) {
    super();

    this.primaryKey = primaryKey;
    this._info = info;
    this._score = score;
    this._status = status;
  }

  get info() {
    return this._info;
  }

  get score() {
    return this._score;
  }

  get status() {
    return this._status;
  }

  updateInfo(data: AssetInfo | ((info: AssetInfo) => AssetInfo)) {
    const prevInfo = this._info;
    this._info = AssetInfo.isExtends(data) ? data : data(this._info);

    if (!prevInfo.isEquals(this._info)) {
      this.addEvent(new AssetUpdatedInfoEvent(this, prevInfo));
    }
  }

  makeActive() {
    if (this._status.isEquals(AssetStatus.ACTIVE)) return;

    this._status = AssetStatus.ACTIVE;
  }

  archive() {
    if (this._status.isEquals(AssetStatus.ARCHIVED)) return;

    this._status = AssetStatus.ARCHIVED;
    this.addEvent(new AssetArchivedEvent(this));
  }
}
