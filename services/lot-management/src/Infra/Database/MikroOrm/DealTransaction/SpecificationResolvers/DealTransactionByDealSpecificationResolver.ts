import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { DealTransactionByDealSpecification } from '../../../../../Domain';
import { DealRepository } from '../../Deal';
import { DealTransactionSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(DealTransactionByDealSpecification)
export class DealTransactionByDealSpecificationResolver extends MikroOrmSpecificationResolver<DealTransactionByDealSpecification, DealTransactionSnapshot> {
  @InjectContext(forwardRef(() => DealRepository))
  private dealRepository: InjectContext<DealRepository>;

  setup(): void {
    this.addPredicate(async (spec) => {
      const dealRepository = await this.dealRepository();

      const matchesSpec = Array.isArray(spec.deals) ? WhereInPKSpecification.create(spec.deals.map((m) => m.primaryKey)) : spec.deals;

      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, dealRepository);
      const queryBuilderSpec = wrapperSpec(dealRepository.createEmptyQueryBuilder(dealRepository.em));

      return (builder) => {
        return builder.where({
          deal: {
            $in: queryBuilderSpec.select('id').getKnexQuery(),
          },
        });
      };
    });
  }
}
