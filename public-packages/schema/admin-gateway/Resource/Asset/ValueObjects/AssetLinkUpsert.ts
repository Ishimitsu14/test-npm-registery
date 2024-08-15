import { AssetLinkType } from '../Enums';

export interface AssetLinkUpsert {
  type: AssetLinkType;
  url: string;
  title?: string;
}
