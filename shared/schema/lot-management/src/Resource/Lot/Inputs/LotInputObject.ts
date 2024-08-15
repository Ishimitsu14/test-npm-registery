import { MergeAttributes } from '@schema/core';

import { BoosterInfoCategory, EquityCategory, SAFECategory, SAFTCategory, TokenWarrantCategory, UnlockedTokensCategory } from '../Categories';

export type LotInputObject = MergeAttributes<
  [SAFTCategory.InputObject, SAFECategory.InputObject, TokenWarrantCategory.InputObject, EquityCategory.InputObject, UnlockedTokensCategory.InputObject, BoosterInfoCategory.InputObject]
>;
