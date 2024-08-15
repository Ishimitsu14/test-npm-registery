import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { DealMatchesDealTransactionSpecification } from '../../../../../Domain';
import { DealTransactionRepository } from '../../DealTransaction';
import { DealSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(DealMatchesDealTransactionSpecification)
export class DealMatchesDealTransactionSpecificationResolver extends MikroOrmSpecificationResolver<DealMatchesDealTransactionSpecification, DealSnapshot> {
  @InjectContext(DealTransactionRepository)
  private dealTransactionRepository: InjectContext<DealTransactionRepository>;

  setup(): void {
    this.addPredicate(async (spec) => {
      const dealTransactionRepository = await this.dealTransactionRepository();

      const matchesSpec = Array.isArray(spec.dealTransactions) ? WhereInPKSpecification.create(spec.dealTransactions.map((m) => m.primaryKey)) : spec.dealTransactions;
      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, dealTransactionRepository);
      const queryBuilderSpec = wrapperSpec(dealTransactionRepository.createEmptyQueryBuilder(dealTransactionRepository.em));

      return (builder) => {
        return builder.where({
          id: {
            $in: queryBuilderSpec.select('deal').getKnexQuery(),
          },
        });
      };
    });
  }
}
