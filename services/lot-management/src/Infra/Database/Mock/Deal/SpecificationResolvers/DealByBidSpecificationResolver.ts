import { Query, RegisterSpecificationResolver } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MockSpecificationResolver } from '@shared/db';

import { BID_REPOSITORY_INJECT_TOKEN } from '../../../../../Application';
import { Bid, DealByBidSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(DealByBidSpecification)
export class DealByBidSpecificationResolver extends MockSpecificationResolver<DealByBidSpecification> {
  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  setup(): void {
    this.addPredicate(async (spec, payload) => {
      if (Array.isArray(spec.bids)) return async (entities) => entities.filter((entity) => spec.isSatisfied(entity));

      const bidsSpec = spec.bids;

      return async (entities) => {
        const bidRepository = await this.bidRepository();
        const bidsResult = await bidRepository.find(Query.create(Bid).addSpecification(bidsSpec));
        const assetLotMatchesAssetSpecification = new DealByBidSpecification(bidsResult.items);

        return entities.filter((entity) => assetLotMatchesAssetSpecification.isSatisfied(entity));
      };
    });
  }
}
