import { NullableObject } from '@ddd/core';

import { ContractShare } from '../../../Common';
import { AttributeListCollection, AttributeValueListCollection } from '../../Abstract';
import { LotStatus } from '../../Enums';
import { LotInputs } from '../../Inputs';
import { CommonCategoryStrategy } from '../CommonCategory';

export abstract class InvestDocCategoryStrategy extends CommonCategoryStrategy {
  get supportedAttributes(): AttributeListCollection {
    return super.supportedAttributes.concat([
      LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT,
      LotInputs.INVEST_DOC_ASSET_PK_INPUT,
      LotInputs.INVEST_DOC_FDV_INPUT,
      LotInputs.INVEST_DOC_ROUND_FDV_INPUT,
      LotInputs.INVEST_DOC_ROUND_PRICE_INPUT,
      LotInputs.INVEST_DOC_ROUND_SHARE_INPUT,
      LotInputs.INVEST_DOC_ROUND_SUMMARY_INPUT,
      LotInputs.INVEST_DOC_ROUND_TYPE_INPUT,
      LotInputs.INVEST_DOC_ROUND_UNITS_INPUT,
      LotInputs.INVEST_DOC_SHARE_INPUT,
      LotInputs.INVEST_DOC_REASSIGNMENT_TYPE_INPUT,

      LotInputs.BOOSTER_INFO_ROUND_TYPE_INPUT,
      LotInputs.BOOSTER_INFO_FDV_INPUT,
      LotInputs.BOOSTER_INFO_ROUND_PRICE_INPUT,
      LotInputs.BOOSTER_INFO_PREVIOUS_ROUND_PRICE_INPUT,
      LotInputs.BOOSTER_INFO_FUTURE_ROUND_PRICE_INPUT,
      LotInputs.BOOSTER_INFO_LISTING_TIMELINE_INPUT,
      LotInputs.BOOSTER_INFO_ADDITIONAL_INFO_INPUT,
    ]);
  }

  protected createCommon(status: LotStatus, attributes: AttributeValueListCollection): void {
    super.createCommon(status, attributes);

    // Requirements
    attributes.requireSomeOfAttributes([LotInputs.INVEST_DOC_ASSET_PK_INPUT, LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT]);

    // Actions
    attributes.removeSomeOfAttributes([LotInputs.INVEST_DOC_ASSET_PK_INPUT, LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT]);
  }

  protected createDraft(attributes: AttributeValueListCollection): void {
    super.createDraft(attributes);

    // Requirements
    attributes.requireSomeOfAttributes([LotInputs.INVEST_DOC_ASSET_PK_INPUT, LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT]);

    // Actions
    attributes.removeSomeOfAttributes([LotInputs.INVEST_DOC_ASSET_PK_INPUT, LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT]);
  }

  protected createOnModeration(attributes: AttributeValueListCollection): void {
    super.createOnModeration(attributes);

    // Requirements
    attributes.requireSomeOfAttributes([LotInputs.INVEST_DOC_ASSET_PK_INPUT, LotInputs.INVEST_DOC_ASSET_CREATE_REQUEST_INPUT]);
    attributes.requireAttribute(LotInputs.INVEST_DOC_REASSIGNMENT_TYPE_INPUT);
  }

  protected createActive(attributes: AttributeValueListCollection): void {
    super.createActive(attributes);

    // Requirements
    attributes.requireAttribute(LotInputs.INVEST_DOC_ASSET_PK_INPUT);
    attributes.requireAttribute(LotInputs.INVEST_DOC_REASSIGNMENT_TYPE_INPUT);
  }

  protected createCompleted(attributes: AttributeValueListCollection): void {
    super.createCompleted(attributes);

    // Requirements
    attributes.requireAttribute(LotInputs.INVEST_DOC_ASSET_PK_INPUT);
    attributes.requireAttribute(LotInputs.INVEST_DOC_REASSIGNMENT_TYPE_INPUT);
  }

  protected createArchived(attributes: AttributeValueListCollection): void {
    super.createArchived(attributes);
  }

  protected createRejected(attributes: AttributeValueListCollection): void {
    super.createRejected(attributes);
  }

  private _calculateShare(attributes: AttributeValueListCollection) {
    const summary = attributes.findValue(LotInputs.COMMON_SUMMARY_INPUT);
    const fdv = attributes.findValue(LotInputs.INVEST_DOC_FDV_INPUT);

    if (NullableObject.hasValue(summary) && NullableObject.hasValue(fdv)) {
      const share = ContractShare.fromFDVAndContractValue(fdv, summary);
      attributes.add(LotInputs.INVEST_DOC_SHARE_INPUT.createValue(share.share));
    }
    // const share = attributes.findValue(LotInputs.INVEST_DOC_SHARE_INPUT);

    // if (NullableObject.hasValue(summary) && NullableObject.hasValue(fdv)) {
    //   const contractShare = ContractShare.fromFDVAndContractValue(fdv, summary);

    //   attributes.add(LotInputs.INVEST_DOC_FDV_INPUT.createValue(contractShare.fdv));
    //   attributes.add(LotInputs.COMMON_SUMMARY_INPUT.createValue(contractShare.contractValue));
    //   attributes.add(LotInputs.INVEST_DOC_SHARE_INPUT.createValue(contractShare.share));
    // }

    // if (NullableObject.hasValue(summary) && NullableObject.hasValue(share)) {
    //   const contractShare = ContractShare.fromContractValueAndShare(summary, share);

    //   attributes.add(LotInputs.INVEST_DOC_FDV_INPUT.createValue(contractShare.fdv));
    //   attributes.add(LotInputs.COMMON_SUMMARY_INPUT.createValue(contractShare.contractValue));
    //   attributes.add(LotInputs.INVEST_DOC_SHARE_INPUT.createValue(contractShare.share));
    // }

    // if (NullableObject.hasValue(fdv) && NullableObject.hasValue(share)) {
    //   const contractShare = ContractShare.fromFDVAndShare(fdv, share);

    //   attributes.add(LotInputs.INVEST_DOC_FDV_INPUT.createValue(contractShare.fdv));
    //   attributes.add(LotInputs.COMMON_SUMMARY_INPUT.createValue(contractShare.contractValue));
    //   attributes.add(LotInputs.INVEST_DOC_SHARE_INPUT.createValue(contractShare.share));
    // }
  }
}
