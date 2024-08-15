import { NullableObject } from '@ddd/core';
import { AggregationResolver, Query, RegisterAggregationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import Decimal from 'decimal.js';

import { LOT_REPOSITORY_INJECT_TOKEN } from '../../../Application';
import {
  AssetLotStatsAggregator,
  AssetLotStatsAggregatorResult,
  Lot,
  LotByAssetSpecification,
  LotByStatusSpecification,
  LotInputs,
  LotStatus,
  StablecoinQuantity,
  TradeDirection,
} from '../../../Domain';

@RegisterAggregationResolver(AssetLotStatsAggregator)
export class AssetLotStatsAggregatorResolver extends AggregationResolver<AssetLotStatsAggregator> {
  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  async resolve(aggregator: AssetLotStatsAggregator): Promise<AssetLotStatsAggregatorResult[]> {
    const lotRepository = await this.lotRepository();

    const ZERO = new Decimal(0);

    const allLots = await lotRepository.find(
      Query.create(Lot)
        .addSpecification(new LotByAssetSpecification(WhereInPKSpecification.create(aggregator.pks)))
        .addSpecification(new LotByStatusSpecification(LotStatus.ACTIVE)),
    );

    return aggregator.pks.map((primaryKey) => {
      const assetLots = allLots.items.filter((lot) => {
        const assetPK = lot.attributes.findValue(LotInputs.INVEST_DOC_ASSET_PK_INPUT);
        if (NullableObject.isEmpty(assetPK)) return false;
        return assetPK.isEquals(primaryKey);
      });

      const buyLots = assetLots.filter((m) => m.direction.isEquals(TradeDirection.BUY));
      const sellLots = assetLots.filter((m) => m.direction.isEquals(TradeDirection.SELL));

      const buyLotsSummaryItems = buyLots.map((lot) => {
        const summary = lot.attributes.findValue(LotInputs.COMMON_SUMMARY_INPUT);
        if (NullableObject.isEmpty(summary)) return ZERO;

        return summary.value;
      });
      const buyLotsSummary = buyLotsSummaryItems.length > 0 ? Decimal.sum(...buyLotsSummaryItems) : ZERO;

      const sellLotsSummaryItems = sellLots.map((lot) => {
        const summary = lot.attributes.findValue(LotInputs.COMMON_SUMMARY_INPUT);
        if (NullableObject.isEmpty(summary)) return ZERO;

        return summary.value;
      });
      const sellLotsSummary = sellLotsSummaryItems.length > 0 ? Decimal.sum(...sellLotsSummaryItems) : ZERO;

      const allLotsWithFDV = assetLots
        .map((lot) => {
          const fdv = lot.attributes.findValue(LotInputs.INVEST_DOC_FDV_INPUT);
          if (NullableObject.isEmpty(fdv)) return null;

          return fdv.value;
        })
        .filter(Boolean);
      const allLotsAverageFDV = allLotsWithFDV.length > 0 ? Decimal.sum(...allLotsWithFDV).div(allLotsWithFDV.length) : ZERO;

      return {
        primaryKey,

        lotBuyCount: buyLots.length,
        lotSellCount: sellLots.length,
        lotBuyCvSum: StablecoinQuantity.fromNumber(buyLotsSummary),
        lotSellCvSum: StablecoinQuantity.fromNumber(sellLotsSummary),
        averageFdv: StablecoinQuantity.fromNumber(allLotsAverageFDV),
      };
    });
  }
}
