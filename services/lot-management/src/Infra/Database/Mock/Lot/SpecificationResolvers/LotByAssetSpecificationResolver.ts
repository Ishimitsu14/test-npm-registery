import { Query, RegisterSpecificationResolver } from '@ddd/specifications';
import { InjectContext } from '@packages/nestjs-request-context';
import { MockSpecificationResolver } from '@shared/db';

import { ASSET_REPOSITORY_INJECT_TOKEN } from '../../../../../Application';
import { Asset, LotByAssetSpecification } from '../../../../../Domain';

@RegisterSpecificationResolver(LotByAssetSpecification)
export class LotByAssetSpecificationResolver extends MockSpecificationResolver<LotByAssetSpecification> {
  @InjectContext(ASSET_REPOSITORY_INJECT_TOKEN)
  private assetRepository: InjectContext<ASSET_REPOSITORY_INJECT_TOKEN>;

  setup(): void {
    this.addPredicate(async (spec, payload) => {
      const assetRepository = await this.assetRepository();
      if (Array.isArray(spec.assets)) return async (entities) => entities.filter((entity) => spec.isSatisfied(entity));

      const assetsResult = await assetRepository.find(Query.create(Asset).addSpecification(spec.assets));

      return async (entities) => {
        const assets = assetsResult.items;
        const assetLotMatchesAssetSpecification = new LotByAssetSpecification(assets);

        return entities.filter((entity) => assetLotMatchesAssetSpecification.isSatisfied(entity));
      };
    });
  }
}
