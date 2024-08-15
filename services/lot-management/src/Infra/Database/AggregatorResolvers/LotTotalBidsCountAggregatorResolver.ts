import { AggregationResolver, Query, RegisterAggregationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';

import { BID_REPOSITORY_INJECT_TOKEN } from '../../../Application';
import { Bid, BidByLotSpecification, BidByStatusSpecification, BidStatus, Lot, LotTotalBidsCountAggregator, LotTotalBidsCountAggregatorResult } from '../../../Domain';

@RegisterAggregationResolver(LotTotalBidsCountAggregator)
export class LotTotalBidsCountAggregatorResolver extends AggregationResolver<LotTotalBidsCountAggregator> {
  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  async resolve(aggregator: LotTotalBidsCountAggregator): Promise<LotTotalBidsCountAggregatorResult[]> {
    const bidRepository = await this.bidRepository();

    const whereInPksSpecification = WhereInPKSpecification.create<Lot>(aggregator.pks);

    const bids = await bidRepository.find(
      Query.create(Bid)
        .addSpecification(new BidByLotSpecification(whereInPksSpecification))
        .addSpecification(new BidByStatusSpecification([BidStatus.ACTIVE, BidStatus.DEAL])),
    );

    return aggregator.pks.map((primaryKey) => {
      const bidsByPk = bids.items.filter((m) => m.lotPK.isEquals(primaryKey));
      return { primaryKey, count: bidsByPk.length };
    });
  }
}
