import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { BidMatchesDealSpecification } from '../../../../../Domain';
import { DealRepository } from '../../Deal';
import { BidSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(BidMatchesDealSpecification)
export class BidMatchesDealSpecificationResolver extends MikroOrmSpecificationResolver<BidMatchesDealSpecification, BidSnapshot> {
  @InjectContext(DealRepository)
  private dealRepository: InjectContext<DealRepository>;

  setup(): void {
    // this.addBuilderPredicate((spec, builder, payload) => {
    //   const dealSpecification = Array.isArray(spec.deals) ? WhereInPKSpecification.create(spec.deals.map((m) => m.primaryKey)) : spec.deals;
    //   const dealSpecificationResolved = payload.manager.resolve(dealSpecification, payload);

    //   const alias = 'Deal';
    //   const subQuery = builder.subQuery().from(DealSnapshot, alias).select(`${alias}.bidId`).where(dealSpecificationResolved);
    //   return builder.where(`${builder.alias}.id IN (${subQuery.getQuery()})`, subQuery.getParameters());
    // });

    this.addPredicate(async (spec) => {
      const dealRepository = await this.dealRepository();

      const matchesSpec = Array.isArray(spec.deals) ? WhereInPKSpecification.create(spec.deals.map((m) => m.primaryKey)) : spec.deals;
      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, dealRepository);
      const queryBuilderSpec = wrapperSpec(dealRepository.createEmptyQueryBuilder(dealRepository.em));

      return (builder) => {
        return builder.where({
          id: {
            $in: queryBuilderSpec.select('bid').getKnexQuery(),
          },
        });
      };
    });
  }
}
