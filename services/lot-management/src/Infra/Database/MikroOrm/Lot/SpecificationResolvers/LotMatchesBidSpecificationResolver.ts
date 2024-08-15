import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotMatchesBidSpecification } from '../../../../../Domain';
import { BidRepository } from '../../Bid';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotMatchesBidSpecification)
export class LotMatchesBidSpecificationResolver extends MikroOrmSpecificationResolver<LotMatchesBidSpecification, LotSnapshot> {
  @InjectContext(BidRepository)
  private bidRepository: InjectContext<BidRepository>;

  setup(): void {
    this.addPredicate(async (spec) => {
      const bidRepository = await this.bidRepository();

      const matchesSpec = Array.isArray(spec.bids) ? WhereInPKSpecification.create(spec.bids.map((m) => m.primaryKey)) : spec.bids;
      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, bidRepository);
      const queryBuilderSpec = wrapperSpec(bidRepository.createEmptyQueryBuilder(bidRepository.em));

      return (builder) => {
        return builder.where({
          id: {
            $in: queryBuilderSpec.select('lot').getKnexQuery(),
          },
        });
      };
    });

    // this.addPredicate((spec) => {
    //   return (builder) => {
    //     if (spec.id) builder = builder.orderBy({ [raw('COUNT')]: 'DESC' });
    //     builder.orderBy({
    //       bids: {

    //       }
    //     })
    //     return builder;
    //   };
    // });
  }
}
