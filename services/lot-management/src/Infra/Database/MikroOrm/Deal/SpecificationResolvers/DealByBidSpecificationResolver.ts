import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { DealByBidSpecification } from '../../../../../Domain';
import { BidRepository } from '../../Bid';
import { DealSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(DealByBidSpecification)
export class DealByBidSpecificationResolver extends MikroOrmSpecificationResolver<DealByBidSpecification, DealSnapshot> {
  @InjectContext(forwardRef(() => BidRepository))
  private bidRepository: InjectContext<BidRepository>;

  setup(): void {
    this.addPredicate(async (spec) => {
      const bidRepository = await this.bidRepository();

      const matchesSpec = Array.isArray(spec.bids) ? WhereInPKSpecification.create(spec.bids.map((m) => m.primaryKey)) : spec.bids;
      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, bidRepository);
      const queryBuilderSpec = wrapperSpec(bidRepository.createEmptyQueryBuilder(bidRepository.em));

      return (builder) => {
        return builder.where({
          bid: {
            $in: queryBuilderSpec.select('id').getKnexQuery(),
          },
        });
      };
    });
  }
}
