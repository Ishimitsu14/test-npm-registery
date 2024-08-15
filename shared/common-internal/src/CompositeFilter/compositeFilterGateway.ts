import { NullableObject } from '@ddd/core';
import { CoreSchema } from '@schema/core';

export function compositeFilterGateway<TFilterIn extends CoreSchema.CompositeFilter<{}>, TFilterOut extends CoreSchema.CompositeFilter<{}>>(
  payload: TFilterIn,
  callback: (rawFilter: CoreSchema.CompositeFilterInferFilter<TFilterIn>) => CoreSchema.CompositeFilter<Required<CoreSchema.CompositeFilterInferFilter<TFilterOut>>>,
): TFilterOut {
  if (!payload) return undefined;

  const out: TFilterOut = callback(<CoreSchema.CompositeFilterInferFilter<TFilterIn>>payload) as TFilterOut;

  if (NullableObject.hasValue(payload.AND)) {
    const AND = payload.AND.filter(Boolean).map((subFilter) => compositeFilterGateway(subFilter, callback));
    out.AND = (out.AND || []).concat(AND);
  }

  if (NullableObject.hasValue(payload.OR)) {
    const OR = payload.OR.filter(Boolean).map((subFilter) => compositeFilterGateway(subFilter, callback));
    out.OR = (out.OR || []).concat(OR);
  }

  if (NullableObject.hasValue(payload.NOT) && payload.NOT) {
    const NOT = compositeFilterGateway(payload.NOT, callback);
    out.NOT = out.NOT ? <CoreSchema.CompositeFilter<TFilterOut>>{ AND: [out.NOT, NOT] } : NOT;
  }

  return out;
}
