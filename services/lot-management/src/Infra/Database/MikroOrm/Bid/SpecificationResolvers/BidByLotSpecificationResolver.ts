import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { BidByLotSpecification } from '../../../../../Domain';
import { LotRepository } from '../../Lot';
import { BidSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(BidByLotSpecification)
export class BidByLotSpecificationResolver extends MikroOrmSpecificationResolver<BidByLotSpecification, BidSnapshot> {
  @InjectContext(forwardRef(() => LotRepository))
  private lotRepository: InjectContext<LotRepository>;

  setup(): void {
    this.addPredicate(async (spec) => {
      const lotRepository = await this.lotRepository();

      const matchesSpec = Array.isArray(spec.lots) ? WhereInPKSpecification.create(spec.lots.map((m) => m.primaryKey)) : spec.lots;
      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, lotRepository);
      const queryBuilderSpec = wrapperSpec(lotRepository.createEmptyQueryBuilder(lotRepository.em));

      return (builder) => {
        return builder.where({
          lot: {
            id: {
              $in: queryBuilderSpec.select('id').getKnexQuery(),
            },
          },
        });
      };
    });
  }
}
