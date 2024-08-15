import { ISnapshot } from '@ddd/infra';
import { Embeddable, Property } from '@mikro-orm/core';
import { LotAssetRequest } from 'services/lot-management/src/Domain';

// export interface LotAssetRequestSnapshot {
//   title: string;
//   site: string;
// }

// export const LotAssetRequestSnapshotTransformer: SnapshotTransformer<LotAssetRequest, LotAssetRequestSnapshot> = {
//   from: (snapshot) => LotAssetRequest.fromSnapshot(snapshot.title, snapshot.site),
//   to: (domain) => ({ title: domain.title, site: domain.site }),
// };

@Embeddable()
export class LotAssetRequestSnapshot implements ISnapshot<LotAssetRequest> {
  @Property({ fieldName: 'title', type: 'varchar', nullable: true })
  title: string;

  @Property({ fieldName: 'site', type: 'varchar', nullable: true })
  site: string;

  @Property({ fieldName: 'pitch_deck', type: 'varchar', nullable: true })
  pitchDeck: string;

  @Property({ fieldName: 'tokenomics', type: 'varchar', nullable: true })
  tokenomics: string;

  applyDomain(domain: LotAssetRequest): void {
    this.title = domain.title;
    this.site = domain.site;
    this.pitchDeck = domain.pitchDeck;
    this.tokenomics = domain.tokenomics;
  }

  toDomain(): LotAssetRequest {
    return LotAssetRequest.fromSnapshot(this.title, this.site, this.pitchDeck, this.tokenomics);
  }
}
