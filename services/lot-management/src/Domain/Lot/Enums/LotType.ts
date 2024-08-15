import { Enumeration } from '@ddd/domain';
import { LotManagementSchema } from '@schema/lot-management';

import { CategoryStrategy } from '../Abstract';
import { EquityCategoryStrategy, SAFECategoryStrategy, SAFTCategoryStrategy, TokenWarrantCategoryStrategy, UnlockedTokensCategoryStrategy } from '../Categories';

export class LotType extends Enumeration<LotManagementSchema.LotType> {
  static SAFE = new LotType('SAFE', new SAFECategoryStrategy());
  static SAFT = new LotType('SAFT', new SAFTCategoryStrategy());
  static TOKEN_WARRANT = new LotType('TOKEN_WARRANT', new TokenWarrantCategoryStrategy());
  static EQUITY = new LotType('EQUITY', new EquityCategoryStrategy());
  static UNLOCKED_TOKENS = new LotType('UNLOCKED_TOKENS', new UnlockedTokensCategoryStrategy());

  private constructor(
    id: LotManagementSchema.LotType,
    readonly categoryStrategy: CategoryStrategy,
  ) {
    super(id);
  }
}
