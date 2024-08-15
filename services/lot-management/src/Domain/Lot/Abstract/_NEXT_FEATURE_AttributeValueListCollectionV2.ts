import { Nullable, NullableObject, Voidable, VoidableObject } from '@ddd/core';
import { DictionaryCollection, DictionaryPair, ValueObjectAtomicValue } from '@ddd/domain';
import { LotInvalidAttributeError } from '@schema/common';

import { Attribute } from './Attribute';

export class AttributeValueListCollection extends DictionaryCollection<Attribute<any>, any> {
  // override add(key: Attribute<any>, value: AttributeValue<any>): void;
  // override add(item: DictionaryPair<Attribute<any>, AttributeValue<any>>): void;
  // override add(arg_0: Attribute<any> | DictionaryPair<Attribute<any>, AttributeValue<any>>, arg_1?: AttributeValue<any>): void;
  // override add(arg_0: Attribute<any> | AttributeValue<any> | DictionaryPair<Attribute<any>, AttributeValue<any>>, arg_1?: AttributeValue<any>): void {
  //   if (AttributeValue.isExtends(arg_0)) {
  //     super.add(arg_0.attribute, arg_0.value);
  //   } else {
  //     super.add(arg_0, arg_1);
  //   }
  // }

  override clone(): AttributeValueListCollection {
    return new AttributeValueListCollection(this);
  }

  findByKey<Value extends ValueObjectAtomicValue>(key: Attribute<Value>): Nullable<DictionaryPair<Attribute<Value>, Value>> {
    return super.findByKey(key);
  }

  findValueByKey<Value extends ValueObjectAtomicValue>(key: Attribute<Value>): Nullable<Value> {
    return super.findValueByKey(key);
  }

  findValueStrict<Value extends ValueObjectAtomicValue>(key: Attribute<Value>) {
    const value = this.findValueByKey(key);
    if (NullableObject.isEmpty(value)) return void this.throwInvalidAttribute(key);

    return value;
  }

  throwInvalidAttribute(key: Attribute<any>) {
    throw new LotInvalidAttributeError(key.name);
  }

  canBeRequireAttribute(key: Attribute<any>): boolean {
    if (!this.hasKey(key)) return false;

    if (NullableObject.hasValue(key.customRule)) {
      const isOkay = key.customRule(this.findValueStrict(key));
      if (!isOkay) return false;
    }

    return true;
  }

  requireKey(key: Attribute<any>) {
    if (!this.canBeRequireAttribute(key)) this.throwInvalidAttribute(key);
  }

  requireSomeOfKeys(keys: Attribute<any>[], requiredCount: number = 1) {
    if (keys.length <= 0) return;
    requiredCount = Math.max(0, Math.min(keys.length, requiredCount));

    const requireResults = keys.map((attribute) => ({ attribute, isCorrect: this.canBeRequireAttribute(attribute) }));
    const isCorrectCount = requireResults.filter((m) => m.isCorrect).length;

    if (isCorrectCount < requiredCount) {
      const firstCanNotBeRequiredAttribute = requireResults.filter((m) => !m.isCorrect)[0];
      this.throwInvalidAttribute(firstCanNotBeRequiredAttribute.attribute);
    }
  }

  /** Порядок важен! Оставляет те, которые идут в самом начале по приоритету */
  removeSomeOfKeys(keys: Attribute<any>[], requiredCount: number = 1) {
    if (keys.length <= 0) return;
    requiredCount = Math.max(0, Math.min(keys.length, requiredCount));

    const toRemoveKeys: Attribute<any>[] = [];

    let index = 0;
    for (const key of keys) {
      const isCorrect = this.canBeRequireAttribute(key);
      if (isCorrect) {
        index++;
        if (index > requiredCount) {
          toRemoveKeys.push(key);
        }
      } else {
        toRemoveKeys.push(key);
      }
    }

    for (const attribute of toRemoveKeys) {
      this.removeByKey(attribute);
    }
  }

  setValue<Value extends ValueObjectAtomicValue>(value: Voidable<Nullable<Value>>, attribute: Attribute<Value>): void;
  setValue<Income, Value extends ValueObjectAtomicValue>(value: Voidable<Nullable<Income>>, attribute: Attribute<Value>, map: (income: Income) => Value): void;
  setValue<Income, Value extends ValueObjectAtomicValue>(value: Voidable<Nullable<Income | Value>>, attribute: Attribute<Value>, map?: (income: Income) => Value): void {
    if (VoidableObject.hasValue(value)) {
      if (NullableObject.hasValue(value)) {
        if (typeof map === 'function') {
          this.add(attribute, attribute.createValue(map(<Income>value)));
        } else {
          this.add(attribute, attribute.createValue(<Value>value));
        }
      } else {
        this.removeByKey(attribute);
      }
    }
  }
}

// export class AttributeValueListCollection extends ListCollection<AttributeValue<any>> {
//   override clone() {
//     return new AttributeValueListCollection(this);
//   }

//   add(item: AttributeValue<any>): void {
//     if (this.hasAttribute(item.attribute)) this.removeAttribute(item.attribute);

//     super.add(item);
//   }

//   addDefaults(attributes: AttributeListCollection): void {
//     const withDefaultsAttributes = attributes.items.filter((m) => NullableObject.hasValue(m.defaultValue));
//     for (const attribute of withDefaultsAttributes) {
//       if (!this.hasAttribute(attribute)) this.add(attribute.createValue(attribute.defaultValue));
//     }
//   }

//   find<Value extends ValueObjectAtomicValue>(attribute: Attribute<Value>) {
//     return NullableObject(this.items.find((m) => m.attribute.isEquals(attribute))) as AttributeValue<Value>;
//   }

//   findValue<Value extends ValueObjectAtomicValue>(attribute: Attribute<Value>) {
//     return NullableObject.map(this.find(attribute), (m) => m.value);
//   }

//   findValueStrict<Value extends ValueObjectAtomicValue>(attribute: Attribute<Value>) {
//     const value = this.findValue(attribute);
//     if (NullableObject.isEmpty(value)) return void this.throwInvalidAttribute(attribute);

//     return value;
//   }

//   hasAttribute(attribute: Attribute<any>) {
//     return this.items.findIndex((m) => m.attribute.isEquals(attribute)) !== -1;
//   }

//   canBeRequireAttribute(attribute: Attribute<any>): boolean {
//     if (!this.hasAttribute(attribute)) return false;

//     if (NullableObject.hasValue(attribute.customRule)) {
//       const isOkay = attribute.customRule(this.findValueStrict(attribute));
//       if (!isOkay) return false;
//     }

//     return true;
//   }

//   requireAttribute(attribute: Attribute<any>) {
//     if (!this.canBeRequireAttribute(attribute)) this.throwInvalidAttribute(attribute);
//   }

//   requireSomeOfAttributes(attributes: Attribute<any>[], requiredCount: number = 1) {
//     if (attributes.length <= 0) return;
//     requiredCount = Math.max(0, Math.min(attributes.length, requiredCount));

//     const requireResults = attributes.map((attribute) => ({ attribute, isCorrect: this.canBeRequireAttribute(attribute) }));
//     const isCorrectCount = requireResults.filter((m) => m.isCorrect).length;

//     if (isCorrectCount < requiredCount) {
//       const firstCanNotBeRequiredAttribute = requireResults.filter((m) => !m.isCorrect)[0];
//       this.throwInvalidAttribute(firstCanNotBeRequiredAttribute.attribute);
//     }
//   }

//   /** Порядок важен! Оставляет те, которые идут в самом начале по приоритету */
//   removeSomeOfAttributes(attributes: Attribute<any>[], requiredCount: number = 1) {
//     if (attributes.length <= 0) return;
//     requiredCount = Math.max(0, Math.min(attributes.length, requiredCount));

//     const toRemoveAttributes: Attribute<any>[] = [];

//     let index = 0;
//     for (const attribute of attributes) {
//       const isCorrect = this.canBeRequireAttribute(attribute);
//       if (isCorrect) {
//         index++;
//         if (index > requiredCount) {
//           toRemoveAttributes.push(attribute);
//         }
//       } else {
//         toRemoveAttributes.push(attribute);
//       }
//     }

//     for (const attribute of toRemoveAttributes) {
//       this.removeAttribute(attribute);
//     }
//   }

//   removeAttribute(attribute: Attribute<any>) {
//     const values = this.items.filter((m) => m.attribute.isEquals(attribute));
//     values.forEach((value) => this.remove(value));
//   }

//   /**
//    * Оставляет только такие, которые поддерживаются
//    * @param status
//    * @param values
//    * @returns
//    */
//   onlySupportedAttributes(supportedAttributes: AttributeListCollection | Attribute<any>[]) {
//     const attributeListCollection = AttributeListCollection.isExtends(supportedAttributes) ? supportedAttributes : new AttributeListCollection(supportedAttributes);

//     const notSupportedValues = this.items.filter((value) => !attributeListCollection.isExists(value.attribute));
//     notSupportedValues.forEach((value) => this.remove(value));
//   }

//   setValue<Value extends ValueObjectAtomicValue>(value: Voidable<Nullable<Value>>, attribute: Attribute<Value>): void;
//   setValue<Income, Value extends ValueObjectAtomicValue>(value: Voidable<Nullable<Income>>, attribute: Attribute<Value>, map: (income: Income) => Value): void;
//   setValue<Income, Value extends ValueObjectAtomicValue>(value: Voidable<Nullable<Income | Value>>, attribute: Attribute<Value>, map?: (income: Income) => Value): void {
//     if (VoidableObject.hasValue(value)) {
//       if (NullableObject.hasValue(value)) {
//         if (typeof map === 'function') {
//           this.add(attribute.createValue(map(<Income>value)));
//         } else {
//           this.add(attribute.createValue(<Value>value));
//         }
//       } else {
//         this.removeAttribute(attribute);
//       }
//     }
//   }

//   async setValueAsync<Income, Value extends ValueObjectAtomicValue>(value: Voidable<Nullable<Income>>, attribute: Attribute<Value>, map: (income: Income) => Promise<Value>) {
//     if (VoidableObject.hasValue(value)) {
//       if (NullableObject.hasValue(value)) {
//         this.add(attribute.createValue(await map(value)));
//       } else {
//         this.removeAttribute(attribute);
//       }
//     }
//   }

//   throwInvalidAttribute(attribute: Attribute<any>) {
//     throw new LotInvalidAttributeError(attribute.name);
//   }
// }
