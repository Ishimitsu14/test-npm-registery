import { AssetLinkGroup, AssetLinkType } from '../Enums';

export interface AssetLink {
  group: AssetLinkGroup;
  type: AssetLinkType;
  title: string;
  url: string;
}
