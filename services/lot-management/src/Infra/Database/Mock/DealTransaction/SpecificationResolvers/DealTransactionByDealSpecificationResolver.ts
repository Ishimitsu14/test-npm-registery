import { Query, RegisterSpecificationResolver } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MockSpecificationResolver } from '@shared/db';

import { DEAL_REPOSITORY_INJECT_TOKEN } from '../../../../../Application';
import { Deal, DealTransactionByDealSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(DealTransactionByDealSpecification)
export class DealTransactionByDealSpecificationResolver extends MockSpecificationResolver<DealTransactionByDealSpecification> {
  @InjectContext(DEAL_REPOSITORY_INJECT_TOKEN)
  private dealRepository: InjectContext<DEAL_REPOSITORY_INJECT_TOKEN>;

  setup(): void {
    this.addPredicate(async (spec, payload) => {
      if (Array.isArray(spec.deals)) return async (entities) => entities.filter((entity) => spec.isSatisfied(entity));

      const innerSpec = spec.deals;

      return async (entities) => {
        const dealRepository = await this.dealRepository();
        const result = await dealRepository.find(Query.create(Deal).addSpecification(innerSpec));
        const outerSpec = new DealTransactionByDealSpecification(result.items);

        return entities.filter((entity) => outerSpec.isSatisfied(entity));
      };
    });
  }
}
