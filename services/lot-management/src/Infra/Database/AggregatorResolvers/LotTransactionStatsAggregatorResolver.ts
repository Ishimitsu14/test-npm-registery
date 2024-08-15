import { NullableObject } from '@ddd/core';
import { AggregationResolver, Query, RegisterAggregationResolver } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';

import { BID_REPOSITORY_INJECT_TOKEN, DEAL_REPOSITORY_INJECT_TOKEN, DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN, LOT_REPOSITORY_INJECT_TOKEN } from '../../../Application';
import {
  Bid,
  BidMatchesDealSpecification,
  Deal,
  DealMatchesDealTransactionSpecification,
  DealTransaction,
  DealTransactionByStatusSpecification,
  DealTransactionMatchesLotSpecification,
  DealTransactionStatus,
  LotTransactionStatsAggregator,
  LotTransactionStatsAggregatorResult,
  StablecoinQuantity,
} from '../../../Domain';

@RegisterAggregationResolver(LotTransactionStatsAggregator)
export class LotTransactionStatsAggregatorResolver extends AggregationResolver<LotTransactionStatsAggregator> {
  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN)
  private dealTransactionRepository: InjectContext<DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(BID_REPOSITORY_INJECT_TOKEN)
  private bidRepository: InjectContext<BID_REPOSITORY_INJECT_TOKEN>;

  @InjectContext(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: InjectContext<DEAL_REPOSITORY_INJECT_TOKEN>;

  async resolve(aggregator: LotTransactionStatsAggregator): Promise<LotTransactionStatsAggregatorResult[]> {
    const lotRepository = await this.lotRepository();
    const dealTransactionRepository = await this.dealTransactionRepository();
    const bidRepository = await this.bidRepository();
    const dealRepository = await this.dealRepository();

    const lotsResult = await lotRepository.getMany(aggregator.pks);
    const lots = lotsResult.filter(NullableObject.hasValue);

    const dealTransactions = await dealTransactionRepository
      .find(
        Query.create(DealTransaction)
          .addSpecification(new DealTransactionMatchesLotSpecification(lots))
          .addSpecification(new DealTransactionByStatusSpecification([DealTransactionStatus.EXECUTED, DealTransactionStatus.RESERVED])),
      )
      .then((m) => m.items);

    const deals = await dealRepository.find(Query.create(Deal).addSpecification(new DealMatchesDealTransactionSpecification(dealTransactions))).then((m) => m.items);
    const bids = await bidRepository.find(Query.create(Bid).addSpecification(new BidMatchesDealSpecification(deals))).then((m) => m.items);

    return lots.map((lot) => {
      const lotBids = bids.filter((bid) => bid.lotPK.isEquals(lot.primaryKey));
      const lotDeals = deals.filter((deal) => NullableObject.hasValue(lotBids.find((bid) => deal.bidPK.isEquals(bid.primaryKey))));
      const lotDealTransactions = dealTransactions.filter((dealTransaction) => NullableObject.hasValue(lotDeals.find((deal) => dealTransaction.dealPK.isEquals(deal.primaryKey))));

      const executedSummary = StablecoinQuantity.sum(
        lotDealTransactions
          .map((transaction) => {
            const deal = NullableObject(lotDeals.find((m) => m.primaryKey.isEquals(transaction.dealPK)));
            if (NullableObject.isEmpty(deal)) return NullableObject;

            if (!transaction.status.isEquals(DealTransactionStatus.EXECUTED)) return NullableObject;

            return deal.summary;
          })
          .filter(NullableObject.hasValue),
      );

      const reservedSummary = StablecoinQuantity.sum(
        lotDealTransactions
          .map((transaction) => {
            const deal = NullableObject(lotDeals.find((m) => m.primaryKey.isEquals(transaction.dealPK)));
            if (NullableObject.isEmpty(deal)) return NullableObject;
            if (!transaction.status.isEquals(DealTransactionStatus.RESERVED)) return NullableObject;

            return deal.summary;
          })
          .filter(NullableObject.hasValue),
      );

      const availableSummaryRaw = NullableObject(lot.summary, StablecoinQuantity.ZERO).minus(executedSummary).minus(reservedSummary);
      const availableSummary = availableSummaryRaw.value.lessThanOrEqualTo(0) ? StablecoinQuantity.ZERO : availableSummaryRaw;
      const total = executedSummary.plus(reservedSummary).plus(availableSummary);

      return {
        primaryKey: lot.primaryKey,

        executed: executedSummary,
        reserved: reservedSummary,
        available: availableSummary,
        total,
      };
    });
  }
}
