import { Query, RegisterSpecificationResolver } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MockSpecificationResolver } from '@shared/db';

import { LOT_REPOSITORY_INJECT_TOKEN } from '../../../../../Application';
import { BidByLotSpecification, Lot } from '../../../../../Domain';

@RegisterSpecificationResolver(BidByLotSpecification)
export class BidByLotSpecificationResolver extends MockSpecificationResolver<BidByLotSpecification> {
  @InjectContext(LOT_REPOSITORY_INJECT_TOKEN)
  private lotRepository: InjectContext<LOT_REPOSITORY_INJECT_TOKEN>;

  setup(): void {
    this.addPredicate(async (spec, payload) => {
      if (Array.isArray(spec.lots)) return async (entities) => entities.filter((entity) => spec.isSatisfied(entity));

      const lotsSpec = spec.lots;

      return async (entities) => {
        const lotRepository = await this.lotRepository();
        const lotsResult = await lotRepository.find(Query.create(Lot).addSpecification(lotsSpec));
        const lots = lotsResult.items;
        const bidsMatchesLotSpecification = new BidByLotSpecification(lots);

        return entities.filter((entity) => bidsMatchesLotSpecification.isSatisfied(entity));
      };
    });
  }
}
