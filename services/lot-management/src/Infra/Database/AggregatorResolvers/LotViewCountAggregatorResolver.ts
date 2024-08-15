import { AggregationResolver, Query, RegisterAggregationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';

import { VIEW_LOT_REPOSITORY_INJECT_TOKEN } from '../../../Application';
import { Lot, LotViewCountAggregator, LotViewCountAggregatorResult, ViewLot, ViewLotByLotSpecification } from '../../../Domain';

@RegisterAggregationResolver(LotViewCountAggregator)
export class LotViewCountAggregatorResolver extends AggregationResolver<LotViewCountAggregator> {
  @InjectContext(VIEW_LOT_REPOSITORY_INJECT_TOKEN)
  private viewLotRepository: InjectContext<VIEW_LOT_REPOSITORY_INJECT_TOKEN>;

  async resolve(aggregator: LotViewCountAggregator): Promise<LotViewCountAggregatorResult[]> {
    const viewLotRepository = await this.viewLotRepository();

    const whereInPksSpecification = WhereInPKSpecification.create<Lot>(aggregator.pks);

    const viewLots = await viewLotRepository.find(Query.create(ViewLot).addSpecification(new ViewLotByLotSpecification(whereInPksSpecification.primaryKeys)));

    return aggregator.pks.map((primaryKey) => {
      const viewLotsByPk = viewLots.items.filter((m) => m.lotId.isEquals(primaryKey));

      return {
        primaryKey,
        count: viewLotsByPk.length,
      };
    });
  }
}
