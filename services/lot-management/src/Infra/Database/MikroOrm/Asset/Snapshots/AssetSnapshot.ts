import { createSnapshotFromDomain, ISnapshotEntity } from '@ddd/infra';
import { Collection, Embedded, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

import { Asset, AssetPK, AssetStatus } from '../../../../../Domain';
import { LotSnapshot } from '../../Lot';
import { AssetInfoSnapshot } from './AssetInfoSnapshot';
import { AssetStatusSnapshot } from './Enums';

@Entity({ tableName: 'asset' })
export class AssetSnapshot implements ISnapshotEntity<Asset> {
  @PrimaryKey({ fieldName: 'id' })
  id: string;

  @Embedded({ entity: () => AssetInfoSnapshot })
  info: AssetInfoSnapshot;

  @Property({ fieldName: 'score', type: 'integer' })
  score: number;

  @AssetStatusSnapshot({ fieldName: 'status' })
  status: AssetStatusSnapshot;

  // References
  @OneToMany({
    entity: () => LotSnapshot,
    mappedBy: (lot) => lot.attributes['embeddedProps'].investDocAsset,
  })
  lots = new Collection<LotSnapshot>(this);

  applyPK(primaryKey: AssetPK): void {
    this.id = primaryKey.id;
  }

  applyDomain(domain: Asset): void {
    this.id = domain.primaryKey.id;
    this.info = createSnapshotFromDomain(AssetInfoSnapshot, domain.info);
    this.score = domain.score;
    this.status = domain.status.id;
  }

  toDomain(): Asset {
    return Asset.fromSnapshot(new AssetPK(this.id), this.info.toDomain(), this.score, AssetStatus.getById(this.status));
  }
}
