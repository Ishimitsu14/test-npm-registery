import { Query, RegisterSpecificationResolver } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MockSpecificationResolver } from '@shared/db';

import { DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN } from '../../../../../Application';
import { DealMatchesDealTransactionSpecification, DealTransaction } from '../../../../../Domain';

@RegisterSpecificationResolver(DealMatchesDealTransactionSpecification)
export class DealMatchesDealTransactionSpecificationResolver extends MockSpecificationResolver<DealMatchesDealTransactionSpecification> {
  @InjectContext(DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN)
  private dealTransactionRepository: InjectContext<DEAL_TRANSACTION_REPOSITORY_INJECT_TOKEN>;

  setup(): void {
    this.addPredicate(async (spec, payload) => {
      if (Array.isArray(spec.dealTransactions)) return async (entities) => entities.filter((entity) => spec.isSatisfied(entity));

      const innerSpec = spec.dealTransactions;

      return async (entities) => {
        const dealTransactionRepository = await this.dealTransactionRepository();
        const result = await dealTransactionRepository.find(Query.create(DealTransaction).addSpecification(innerSpec));
        const outerSpec = new DealMatchesDealTransactionSpecification(result.items);

        return entities.filter((entity) => outerSpec.isSatisfied(entity));
      };
    });
  }
}
