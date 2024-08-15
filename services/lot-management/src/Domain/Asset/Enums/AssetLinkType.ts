import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

import { AssetLinkGroup } from './AssetLinkGroup';

export class AssetLinkType extends Enumeration<LotManagementSchema.AssetLinkType> {
  static SITE = new AssetLinkType('SITE', AssetLinkGroup.OFFICIAL, 'Site');
  static WHITE_PAPER = new AssetLinkType('WHITE_PAPER', AssetLinkGroup.OFFICIAL, 'White paper');
  static GITHUB = new AssetLinkType('GITHUB', AssetLinkGroup.OFFICIAL, 'Github');
  static REDDIT = new AssetLinkType('REDDIT', AssetLinkGroup.SOCIAL, 'Reddit');
  static TWITTER = new AssetLinkType('TWITTER', AssetLinkGroup.SOCIAL, 'Twitter');
  static DISCORD = new AssetLinkType('DISCORD', AssetLinkGroup.SOCIAL, 'Discord');
  static OTHER = new AssetLinkType('OTHER', AssetLinkGroup.OTHER, 'Site');

  private constructor(
    id: LotManagementSchema.AssetLinkType,
    readonly group: AssetLinkGroup,
    readonly title: string,
  ) {
    super(id);
  }
}
