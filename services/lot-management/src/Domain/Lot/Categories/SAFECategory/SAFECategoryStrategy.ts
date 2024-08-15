import { NullableObject } from '@ddd/core';

import { AttributeListCollection, AttributeValueListCollection } from '../../Abstract';
import { LotStatus } from '../../Enums';
import { LotInputs } from '../../Inputs';
import { InvestDocCategoryStrategy } from '../InvestDocCategory';

export class SAFECategoryStrategy extends InvestDocCategoryStrategy {
  get supportedAttributes(): AttributeListCollection {
    return super.supportedAttributes.concat([LotInputs.SAFE_WITH_TOKEN_WARRANT_INPUT, LotInputs.TOKEN_LOCKUP_PERIOD_INPUT, LotInputs.TOKEN_TGE_INPUT, LotInputs.TOKEN_VESTING_PERIOD_INPUT]);
  }

  protected createCommon(status: LotStatus, attributes: AttributeValueListCollection): void {
    super.createCommon(status, attributes);

    const withTokenWarrant = attributes.findValue(LotInputs.SAFE_WITH_TOKEN_WARRANT_INPUT);

    if (NullableObject.isEmpty(withTokenWarrant) || !withTokenWarrant) {
      attributes.removeAttribute(LotInputs.TOKEN_LOCKUP_PERIOD_INPUT);
      attributes.removeAttribute(LotInputs.TOKEN_TGE_INPUT);
      attributes.removeAttribute(LotInputs.TOKEN_VESTING_PERIOD_INPUT);
    }
  }
}
