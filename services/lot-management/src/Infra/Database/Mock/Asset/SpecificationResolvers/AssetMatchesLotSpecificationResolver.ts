import { Query, RegisterSpecificationResolver } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MockSpecificationResolver } from '@shared/db';

import { AssetMatchesLotSpecification, Lot } from '../../../../../Domain';
import { LotRepository } from '../../Lot';

@RegisterSpecificationResolver(AssetMatchesLotSpecification)
export class AssetMatchesLotSpecificationResolver extends MockSpecificationResolver<AssetMatchesLotSpecification> {
  @InjectContext(LotRepository)
  private lotRepository: InjectContext<LotRepository>;

  setup(): void {
    this.addPredicate(async (spec, payload) => {
      if (Array.isArray(spec.lots)) return async (entities) => entities.filter((entity) => spec.isSatisfied(entity));

      const lotSpec = spec.lots;

      return async (entities) => {
        const lotRepository = await this.lotRepository();
        const lotsResult = await lotRepository.find(Query.create(Lot).addSpecification(lotSpec));
        const lots = lotsResult.items;
        const lotAssetMatchesLotSpecSpecification = new AssetMatchesLotSpecification(lots);

        return entities.filter((entity) => lotAssetMatchesLotSpecSpecification.isSatisfied(entity));
      };
    });
  }
}
