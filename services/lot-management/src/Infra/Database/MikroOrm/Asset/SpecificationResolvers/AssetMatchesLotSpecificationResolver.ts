import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { AssetMatchesLotSpecification } from '../../../../../Domain';
import { LotRepository } from '../../Lot';
import { AssetSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(AssetMatchesLotSpecification)
export class AssetMatchesLotSpecificationResolver extends MikroOrmSpecificationResolver<AssetMatchesLotSpecification, AssetSnapshot> {
  @InjectContext(LotRepository)
  private lotRepository: InjectContext<LotRepository>;

  setup(): void {
    this.addPredicate(async (spec) => {
      const lotRepository = await this.lotRepository();

      const matchesSpec = Array.isArray(spec.lots) ? WhereInPKSpecification.create(spec.lots.map((m) => m.primaryKey)) : spec.lots;
      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, lotRepository);
      const queryBuilderSpec = wrapperSpec(lotRepository.createEmptyQueryBuilder(lotRepository.em));

      return (builder) => {
        return builder.where({
          id: {
            $in: queryBuilderSpec.select('attributes_invest_doc_asset_id').getKnexQuery(),
          },
        });
      };
    });
  }
}
