import { AttributeListCollection, AttributeValueListCollection, LotStatus } from '../../../Lot';
import { AttributeHook, CategoryStrategy } from '../../Abstract';
import { LotAttributes } from '../../Attributes';
import { LotInputs } from '../../Inputs';

export abstract class CommonCategoryStrategy extends CategoryStrategy {
  get supportedAttributes(): AttributeListCollection {
    return new AttributeListCollection([
      LotInputs.COMMON_BID_MAKER_TYPES_INPUT,
      LotInputs.COMMON_DEADLINE_INPUT,
      LotInputs.COMMON_DIRECTION_INPUT,
      LotInputs.COMMON_MEDIATOR_INPUT,
      LotInputs.COMMON_MIN_FILTER_SUMMARY_INPUT,
      LotInputs.COMMON_MIN_FILTER_UNITS_INPUT,
      LotInputs.COMMON_OFFER_MAKER_TYPES_INPUT,
      LotInputs.COMMON_PRICE_INPUT,
      LotInputs.COMMON_SUMMARY_INPUT,
      LotInputs.COMMON_TELEGRAM_INPUT,
      LotInputs.COMMON_UNITS_INPUT,
      LotInputs.COMMON_ADDITIONAL_INFO_INPUT,
      LotInputs.COMMON_BADGE_INPUT,

      LotAttributes.COMMON_ARCHIVED_AT_ATTRIBUTE,
      LotAttributes.COMMON_COMPLETED_AT_ATTRIBUTE,
      LotAttributes.COMMON_COMPLETED_REASON_ATTRIBUTE,
      LotAttributes.COMMON_CREATED_AT_ATTRIBUTE,
      LotAttributes.COMMON_PUBLISHED_AT_ATTRIBUTE,
      LotAttributes.COMMON_REJECTED_AT_ATTRIBUTE,
      LotAttributes.COMMON_REJECT_REASON_ATTRIBUTE,
      LotAttributes.COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE,
    ]);
  }

  registerHooks(): AttributeHook[] {
    return [];
  }

  protected createCommon(status: LotStatus, attributes: AttributeValueListCollection): void {
    // Всегда должен быть direction
    attributes.requireAttribute(LotInputs.COMMON_DIRECTION_INPUT);

    // Если даты создания лота нет, тогда указать текущую
    if (!attributes.hasAttribute(LotAttributes.COMMON_CREATED_AT_ATTRIBUTE)) {
      attributes.add(LotAttributes.COMMON_CREATED_AT_ATTRIBUTE.createValue(new Date()));
    }
  }

  protected createDraft(attributes: AttributeValueListCollection): void {
    // Удаляем поля, которых не должно быть в DRAFT
    attributes.removeAttribute(LotAttributes.COMMON_ARCHIVED_AT_ATTRIBUTE);
    attributes.removeAttribute(LotAttributes.COMMON_COMPLETED_AT_ATTRIBUTE);
    attributes.removeAttribute(LotAttributes.COMMON_COMPLETED_REASON_ATTRIBUTE);
    attributes.removeAttribute(LotAttributes.COMMON_PUBLISHED_AT_ATTRIBUTE);
    attributes.removeAttribute(LotAttributes.COMMON_REJECTED_AT_ATTRIBUTE);
    attributes.removeAttribute(LotAttributes.COMMON_REJECT_REASON_ATTRIBUTE);
    attributes.removeAttribute(LotAttributes.COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE);
  }

  protected createOnModeration(attributes: AttributeValueListCollection): void {
    attributes.requireAttribute(LotInputs.COMMON_MEDIATOR_INPUT);
    attributes.requireAttribute(LotInputs.COMMON_TELEGRAM_INPUT);
    attributes.requireAttribute(LotInputs.COMMON_OFFER_MAKER_TYPES_INPUT);
    attributes.requireAttribute(LotInputs.COMMON_SUMMARY_INPUT);

    if (!attributes.hasAttribute(LotAttributes.COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE)) {
      attributes.add(LotAttributes.COMMON_SEND_ON_MODERATION_AT_ATTRIBUTE.createValue(new Date()));
    }
  }

  protected createActive(attributes: AttributeValueListCollection): void {
    attributes.requireAttribute(LotInputs.COMMON_MEDIATOR_INPUT);
    attributes.requireAttribute(LotInputs.COMMON_TELEGRAM_INPUT);
    attributes.requireAttribute(LotInputs.COMMON_OFFER_MAKER_TYPES_INPUT);
    attributes.requireAttribute(LotInputs.COMMON_SUMMARY_INPUT);

    if (!attributes.hasAttribute(LotAttributes.COMMON_PUBLISHED_AT_ATTRIBUTE)) {
      attributes.add(LotAttributes.COMMON_PUBLISHED_AT_ATTRIBUTE.createValue(new Date()));
    }
  }

  protected createCompleted(attributes: AttributeValueListCollection): void {
    attributes.requireAttribute(LotInputs.COMMON_MEDIATOR_INPUT);
    attributes.requireAttribute(LotInputs.COMMON_TELEGRAM_INPUT);
    attributes.requireAttribute(LotInputs.COMMON_OFFER_MAKER_TYPES_INPUT);
    attributes.requireAttribute(LotInputs.COMMON_SUMMARY_INPUT);

    attributes.requireAttribute(LotAttributes.COMMON_COMPLETED_REASON_ATTRIBUTE);

    if (!attributes.hasAttribute(LotAttributes.COMMON_COMPLETED_AT_ATTRIBUTE)) {
      attributes.add(LotAttributes.COMMON_COMPLETED_AT_ATTRIBUTE.createValue(new Date()));
    }
  }

  protected createArchived(attributes: AttributeValueListCollection): void {
    if (!attributes.hasAttribute(LotAttributes.COMMON_ARCHIVED_AT_ATTRIBUTE)) {
      attributes.add(LotAttributes.COMMON_ARCHIVED_AT_ATTRIBUTE.createValue(new Date()));
    }
  }

  protected createRejected(attributes: AttributeValueListCollection): void {
    if (!attributes.hasAttribute(LotAttributes.COMMON_REJECTED_AT_ATTRIBUTE)) {
      attributes.add(LotAttributes.COMMON_REJECTED_AT_ATTRIBUTE.createValue(new Date()));
    }
  }

  protected internalChangeCategory(status: LotStatus, fromCategory: CategoryStrategy, attributes: AttributeValueListCollection): void {}

  // private _calculateUnitsAndSummary(attributes: AttributeValueListCollection) {
  //   let price = attributes.findValue(LotInputs.COMMON_PRICE_INPUT);
  //   let units = attributes.findValue(LotInputs.COMMON_UNITS_INPUT);
  //   let summary = attributes.findValue(LotInputs.COMMON_SUMMARY_INPUT);

  //   if (NullableObject.hasValue(price) && NullableObject.hasValue(units) && NullableObject.hasValue(summary)) return;

  //   if (NullableObject.hasValue(price) && NullableObject.hasValue(units)) {
  //     summary = StablecoinQuantity.fromUnitQuantity(units, price);
  //   }

  //   if (NullableObject.hasValue(price) && NullableObject.hasValue(summary)) {
  //     units = UnitQuantity.fromStablecoinQuantity(summary, price, Precision.DYNAMIC);
  //   }

  //   if (NullableObject.hasValue(units) && NullableObject.hasValue(summary)) {
  //     price = Price.fromQuantities(summary, units, Precision.DYNAMIC);
  //   }

  //   // Set values
  //   if (NullableObject.hasValue(price)) {
  //     attributes.add(LotInputs.COMMON_PRICE_INPUT.createValue(price));
  //   }

  //   if (NullableObject.hasValue(units)) {
  //     attributes.add(LotInputs.COMMON_UNITS_INPUT.createValue(units));
  //   }

  //   if (NullableObject.hasValue(summary)) {
  //     attributes.add(LotInputs.COMMON_SUMMARY_INPUT.createValue(summary));
  //   }
  // }
}
