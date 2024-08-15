import { Query, RegisterSpecificationResolver } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MockSpecificationResolver } from '@shared/db';

import { BID_REPOSITORY_INJECT_TOKEN } from '../../../../../Application';
import { Bid, LotMatchesBidSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotMatchesBidSpecification)
export class LotMatchesBidSpecificationResolver extends MockSpecificationResolver<LotMatchesBidSpecification> {
  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  setup(): void {
    this.addPredicate(async (spec, payload) => {
      if (Array.isArray(spec.bids)) return async (entities) => entities.filter((entity) => spec.isSatisfied(entity));

      const bidSpec = spec.bids;

      return async (entities) => {
        const bidRepository = await this.bidRepository();
        const bidsResult = await bidRepository.find(Query.create(Bid).addSpecification(bidSpec));
        const lotAssetMatchesLotSpecSpecification = new LotMatchesBidSpecification(bidsResult.items);

        return entities.filter((entity) => lotAssetMatchesLotSpecSpecification.isSatisfied(entity));
      };
    });
  }
}
