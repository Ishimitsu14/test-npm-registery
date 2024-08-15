import { AttributeListCollection } from '../../Abstract';
import { LotInputs } from '../../Inputs';
import { InvestDocCategoryStrategy } from '../InvestDocCategory';

export class TokenWarrantCategoryStrategy extends InvestDocCategoryStrategy {
  get supportedAttributes(): AttributeListCollection {
    return super.supportedAttributes.concat([LotInputs.TOKEN_LOCKUP_PERIOD_INPUT, LotInputs.TOKEN_TGE_INPUT, LotInputs.TOKEN_VESTING_PERIOD_INPUT]);
  }
}
