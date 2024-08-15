import { ArrayType, EntityProperty, Platform, TransformContext, Utils, ValidationError } from '@mikro-orm/core';
import { inspect } from 'util';

function mapHydrator<T>(items: T[] | undefined, hydrate: (i: string) => T): (i: string) => T {
  if (items && items.length > 0 && typeof items[0] === 'number') {
    return (i: string) => +i as unknown as T;
  }

  return hydrate;
}

export class EnumArrayType<T extends string | number = string> extends ArrayType<T> {
  constructor(
    private readonly items?: T[],
    hydrate: (i: string) => T = (i) => i as T,
  ) {
    super(mapHydrator(items, hydrate));
  }

  override convertToJSValue(value: string, platform: Platform): T[] {
    if (!value) return [];

    if (Utils.isString(value)) {
      if (value.startsWith('{') && value.endsWith('}')) {
        const values = platform.unmarshallArray(value);
        return values as T[];
      }
    }

    return super.convertToJSValue(value, platform);
  }

  override convertToDatabaseValue(value: T[], platform: Platform, context?: TransformContext): string {
    if (typeof value === 'string') return value;
    if (!value) return '{}';

    if (Array.isArray(value) && Array.isArray(this.items)) {
      const invalid = value.filter((v) => !this.items!.includes(v));

      if (invalid.length > 0) {
        throw new ValidationError(`Invalid enum array items provided: ${inspect(invalid)}`);
      }
    }
    return super.convertToDatabaseValue(value, platform, context);
  }

  override getColumnType(prop: EntityProperty, platform: Platform): string {
    if (prop.nativeEnumName) {
      return `${prop.nativeEnumName}[]`;
    }

    return super.getColumnType(prop, platform);
  }
}
