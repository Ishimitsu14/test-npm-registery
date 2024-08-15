import { Nullable, NullableObject } from '@ddd/core';
import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

import { AssetLinkType } from '../Enums';

export class AssetLink extends ValueObject {
  static create(type: AssetLinkType, url: string) {
    return new AssetLink(type, url, NullableObject);
  }

  static fromSnapshot(type: AssetLinkType, url: string, customTitle: Nullable<string>) {
    return new AssetLink(type, url, customTitle);
  }

  private constructor(
    readonly type: AssetLinkType,
    readonly url: string,
    readonly customTitle: Nullable<string>,
  ) {
    super();
  }

  get title() {
    return NullableObject(this.customTitle, this.type.title);
  }

  setType(type: AssetLinkType) {
    return new AssetLink(type, this.url, this.customTitle);
  }

  setUrl(url: string) {
    return new AssetLink(this.type, url, this.customTitle);
  }

  setCustomTitle(customTitle: Nullable<string>) {
    return new AssetLink(this.type, this.url, customTitle);
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.type, this.url, this.customTitle];
  }
}
