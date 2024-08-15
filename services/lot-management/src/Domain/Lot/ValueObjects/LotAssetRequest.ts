import { ValueObject, ValueObjectAtomicValue } from '@ddd/domain';

export class LotAssetRequest extends ValueObject {
  static fromSnapshot(title: string, site: string, pitchDeck: string, tokenomics: string) {
    return new LotAssetRequest(title, site, pitchDeck, tokenomics);
  }

  constructor(
    readonly title: string,
    readonly site: string,
    readonly pitchDeck: string,
    readonly tokenomics: string,
  ) {
    super();
  }

  protected getAtomicValues(): ValueObjectAtomicValue {
    return [this.title, this.site, this.pitchDeck, this.tokenomics];
  }
}
