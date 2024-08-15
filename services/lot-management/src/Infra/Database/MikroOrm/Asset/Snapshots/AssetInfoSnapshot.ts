import { ListCollection, NullableObject } from '@ddd/core';
import { createSnapshotFromDomain, ISnapshot } from '@ddd/infra';
import { Embeddable, Embedded, Property } from '@mikro-orm/core';

import { AssetInfo, AssetTier, AssetVertical, FilePK } from '../../../../../Domain';
import { AssetLinkSnapshot } from './AssetLinkSnapshot';
import { AssetTierSnapshot, AssetVerticalSnapshot } from './Enums';

@Embeddable()
export class AssetInfoSnapshot implements ISnapshot<AssetInfo> {
  @Property({ fieldName: 'title', type: 'text' })
  title: string;

  @Property({ fieldName: 'description', type: 'text' })
  description: string;

  @AssetTierSnapshot({ fieldName: 'tier' })
  tier: AssetTierSnapshot;

  @Embedded({
    entity: () => AssetLinkSnapshot,
    nullable: true,
    array: true,
  })
  links: AssetLinkSnapshot[] = [];

  @AssetVerticalSnapshot.array({ fieldName: 'verticals' })
  verticals: AssetVerticalSnapshot[];

  @Property({ fieldName: 'logo_file', nullable: true, type: 'text' })
  logoFile?: string;

  @Property({ fieldName: 'analytic_file', nullable: true, type: 'text' })
  analyticFile?: string;

  applyDomain(domain: AssetInfo): void {
    this.title = domain.title;
    this.description = domain.description;
    this.tier = domain.tier.id;
    this.links = domain.links.items.slice().map((m) => createSnapshotFromDomain(AssetLinkSnapshot, m));
    this.verticals = domain.verticals.items.map((vertical) => vertical.id);
    this.logoFile = NullableObject.mapNull(domain.logoFile, (m) => m.id);
    this.analyticFile = NullableObject.mapNull(domain.analyticFile, (m) => m.id);
  }

  toDomain(): AssetInfo {
    return AssetInfo.fromSnapshot(
      this.title,
      this.description,
      AssetTier.getById(this.tier),
      new ListCollection(this.links.map((m) => m.toDomain())),
      new ListCollection(AssetVertical.getByIds(this.verticals)),
      NullableObject.map(this.logoFile, (m) => new FilePK(m)),
      NullableObject.map(this.analyticFile, (m) => new FilePK(m)),
    );
  }
}
