import { NullableObject } from '@ddd/core';
import { EntityProperty, Platform, Type, ValidationError } from '@mikro-orm/core';
import Decimal from 'decimal.js';

export class DecimalType extends Type<Decimal, string> {
  convertToDatabaseValue(value: Decimal | string | undefined, platform: Platform): string {
    if (NullableObject.isEmpty(value)) return null;

    if (Decimal.isDecimal(value)) {
      return value.toString();
    }

    if (typeof value === 'string') {
      return value;
    }

    throw ValidationError.invalidType(DecimalType, value, 'JS');
  }

  convertToJSValue(value: Decimal | string | undefined, platform: Platform): Decimal {
    if (NullableObject.isEmpty(value)) return null;

    if (Decimal.isDecimal(value)) return value;

    if (typeof value === 'string') return new Decimal(value);

    throw ValidationError.invalidType(DecimalType, value, 'database');
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `numeric`;
  }
}
