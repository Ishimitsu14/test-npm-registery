import { Query, RegisterSpecificationResolver } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MockSpecificationResolver } from '@shared/db';

import { DEAL_REPOSITORY_INJECT_TOKEN } from '../../../../../Application';
import { BidMatchesDealSpecification, Deal } from '../../../../../Domain';

@RegisterSpecificationResolver(BidMatchesDealSpecification)
export class BidMatchesDealSpecificationResolver extends MockSpecificationResolver<BidMatchesDealSpecification> {
  @InjectContext(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: InjectContext<DEAL_REPOSITORY_INJECT_TOKEN>;

  setup(): void {
    this.addPredicate(async (spec, payload) => {
      if (Array.isArray(spec.deals)) return async (entities) => entities.filter((entity) => spec.isSatisfied(entity));

      const dealSpec = spec.deals;

      return async (entities) => {
        const dealRepository = await this.dealRepository();
        const dealsResult = await dealRepository.find(Query.create(Deal).addSpecification(dealSpec));
        const bidMatchesDealSpecification = new BidMatchesDealSpecification(dealsResult.items);

        return entities.filter((entity) => bidMatchesDealSpecification.isSatisfied(entity));
      };
    });
  }
}
