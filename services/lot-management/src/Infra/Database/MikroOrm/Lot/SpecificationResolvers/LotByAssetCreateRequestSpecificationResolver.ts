import { RegisterSpecificationResolver } from '@ddd/specifications';
import { MikroOrmSpecificationResolver } from '@shared/db';

import { LotByAssetCreateRequestSpecification } from '../../../../../Domain';
import { LotSnapshot } from '../Snapshots';

@RegisterSpecificationResolver(LotByAssetCreateRequestSpecification)
export class LotByAssetCreateRequestSpecificationResolver extends MikroOrmSpecificationResolver<LotByAssetCreateRequestSpecification, LotSnapshot> {
  setup(): void {
    this.addWhere(async (spec) => ({
      attributes: {
        invest_doc_asset_request: {
          title: {
            $ilike: spec.title.toLowerCase(),
          },
        },
      },
    }));
  }
}
