import { ListCollection, Nullable, NullableObject, ReadonlyListCollection } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

import { FilePK } from '../../Common';
import { AssetTier, AssetVertical } from '../Enums';
import { AssetLink } from './AssetLink';

export class AssetInfo extends ValueObject {
  static createNew(title: string, description: string, tier: AssetTier) {
    return new AssetInfo(title, description, tier, new ListCollection(), new ListCollection(), NullableObject, NullableObject);
  }

  static fromSnapshot(
    title: string,
    description: string,
    tier: AssetTier,
    links: ReadonlyListCollection<AssetLink>,
    verticals: ReadonlyListCollection<AssetVertical>,
    logoFile: Nullable<FilePK>,
    analyticFile: Nullable<FilePK>,
  ) {
    return new AssetInfo(title, description, tier, links, verticals, logoFile, analyticFile);
  }

  private constructor(
    readonly title: string,
    readonly description: string,
    readonly tier: AssetTier,
    readonly links: ReadonlyListCollection<AssetLink>,
    readonly verticals: ReadonlyListCollection<AssetVertical>,
    readonly logoFile: Nullable<FilePK>,
    readonly analyticFile: Nullable<FilePK>,
  ) {
    super();
  }

  setTier(tier: AssetTier) {
    return new AssetInfo(this.title, this.description, tier, this.links, this.verticals, this.logoFile, this.analyticFile);
  }

  setTitle(title: string) {
    return new AssetInfo(title, this.description, this.tier, this.links, this.verticals, this.logoFile, this.analyticFile);
  }

  setDescription(description: string) {
    return new AssetInfo(this.title, description, this.tier, this.links, this.verticals, this.logoFile, this.analyticFile);
  }

  setLinks(links: ReadonlyListCollection<AssetLink>) {
    return new AssetInfo(this.title, this.description, this.tier, links, this.verticals, this.logoFile, this.analyticFile);
  }

  setVerticals(verticals: ReadonlyListCollection<AssetVertical>) {
    return new AssetInfo(this.title, this.description, this.tier, this.links, verticals, this.logoFile, this.analyticFile);
  }

  setLogoFile(logoFile: Nullable<FilePK>) {
    return new AssetInfo(this.title, this.description, this.tier, this.links, this.verticals, logoFile, this.analyticFile);
  }

  setAnalyticFile(analyticFile: Nullable<FilePK>) {
    return new AssetInfo(this.title, this.description, this.tier, this.links, this.verticals, this.logoFile, analyticFile);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return {
      title: this.title,
      description: this.description,
      links: this.links,
      tier: this.tier,
      verticals: this.verticals,
      logoFile: this.logoFile,
      analyticFile: this.analyticFile,
    };
  }
}
