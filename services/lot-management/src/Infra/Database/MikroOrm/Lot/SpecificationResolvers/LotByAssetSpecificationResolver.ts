import { RegisterSpecificationResolver, WhereInPKSpecification } from '@ddd/specifications';
import { forwardRef } from '@nestjs/common';
import { InjectContext } from '@packages/nestjs-request-context';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotByAssetSpecification } from '../../../../../Domain';
import { AssetRepository } from '../../Asset';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotByAssetSpecification)
export class LotByAssetSpecificationResolver extends MikroOrmSpecificationResolver<LotByAssetSpecification, LotSnapshot> {
  @InjectContext(forwardRef(() => AssetRepository))
  private assetRepository: InjectContext<AssetRepository>;

  setup(): void {
    this.addPredicate(async (spec) => {
      const assetRepository = await this.assetRepository();

      const matchesSpec = Array.isArray(spec.assets) ? WhereInPKSpecification.create(spec.assets.map((m) => m.primaryKey)) : spec.assets;
      const wrapperSpec = await this.queryResolver.resolveSpecification(matchesSpec, assetRepository);
      const queryBuilderSpec = wrapperSpec(assetRepository.createEmptyQueryBuilder(assetRepository.em));

      return (builder) => {
        return builder.where({
          attributes: {
            investDocAsset: {
              $in: queryBuilderSpec.select('id').getKnexQuery(),
            },
          },
        });
      };
    });
  }
}
