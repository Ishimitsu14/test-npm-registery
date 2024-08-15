import { NullableObject } from '@ddd/core';
import { ISnapshot } from '@ddd/infra';
import { Embeddable, Property } from '@mikro-orm/core';

import { AssetLink, AssetLinkType } from '../../../../../Domain';
import { AssetLinkTypeSnapshot } from './Enums';

@Embeddable()
export class AssetLinkSnapshot implements ISnapshot<AssetLink> {
  constructor() {}

  @AssetLinkTypeSnapshot({ fieldName: 'type' })
  type: AssetLinkTypeSnapshot;

  @Property({ fieldName: 'url', type: 'varchar' })
  url: string;

  @Property({ fieldName: 'custom_title', type: 'varchar', nullable: true })
  customTitle?: string;

  applyDomain(domain: AssetLink): void {
    this.type = domain.type.id;
    this.url = domain.url;
    this.customTitle = NullableObject.mapNull(domain.customTitle);
  }

  toDomain(): AssetLink {
    return AssetLink.fromSnapshot(AssetLinkType.getById(this.type), this.url, NullableObject(this.customTitle));
  }
}
