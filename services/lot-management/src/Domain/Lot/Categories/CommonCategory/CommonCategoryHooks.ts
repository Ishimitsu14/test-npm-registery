import { NullableObject } from '@ddd/core';

import { Precision, Price, StablecoinQuantity, UnitQuantity } from '../../../Common';
import { registerHook } from '../../Abstract/AttributeHook';
import { LotInputs } from '../../Inputs';

export namespace CommonCategoryHooks {
  export const calculateSummaryHook = registerHook(
    (attributes) => {
      const price = attributes.findValue(LotInputs.COMMON_PRICE_INPUT);
      const units = attributes.findValue(LotInputs.COMMON_UNITS_INPUT);

      if (NullableObject.isEmpty(price) || NullableObject.isEmpty(units)) {
        attributes.removeAttribute(LotInputs.COMMON_SUMMARY_INPUT);
      } else {
        const summary = StablecoinQuantity.fromUnitQuantity(units, price);
        attributes.add(LotInputs.COMMON_SUMMARY_INPUT.createValue(summary));
      }
    },
    [LotInputs.COMMON_PRICE_INPUT, LotInputs.COMMON_UNITS_INPUT],
  );

  export const calculatePriceHook = registerHook(
    (attributes) => {
      const summary = attributes.findValue(LotInputs.COMMON_SUMMARY_INPUT);
      const units = attributes.findValue(LotInputs.COMMON_UNITS_INPUT);

      if (NullableObject.isEmpty(summary) || NullableObject.isEmpty(units)) {
        attributes.removeAttribute(LotInputs.COMMON_PRICE_INPUT);
      } else {
        const price = Price.fromQuantities(summary, units, Precision.DYNAMIC);
        attributes.add(LotInputs.COMMON_PRICE_INPUT.createValue(price));
      }
    },
    [LotInputs.COMMON_SUMMARY_INPUT, LotInputs.COMMON_UNITS_INPUT],
  );

  export const calculateUnitsHook = registerHook(
    (attributes) => {
      const price = attributes.findValue(LotInputs.COMMON_PRICE_INPUT);
      const summary = attributes.findValue(LotInputs.COMMON_SUMMARY_INPUT);

      if (NullableObject.isEmpty(summary) || NullableObject.isEmpty(price)) {
        attributes.removeAttribute(LotInputs.COMMON_UNITS_INPUT);
      } else {
        const units = UnitQuantity.fromStablecoinQuantity(summary, price, Precision.DYNAMIC);
        attributes.add(LotInputs.COMMON_UNITS_INPUT.createValue(units));
      }
    },
    [LotInputs.COMMON_SUMMARY_INPUT, LotInputs.COMMON_UNITS_INPUT],
  );
}
