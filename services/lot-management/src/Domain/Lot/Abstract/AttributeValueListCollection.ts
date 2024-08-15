import { ListCollection, Nullable, NullableObject, Voidable, VoidableObject } from '@ddd/core';
import { ValueObjectAtomicValue } from '@ddd/domain';
import { LotInvalidAttributeError } from '@schema/common';

import { Attribute } from './Attribute';
import { AttributeListCollection } from './AttributeListCollection';
import { AttributeValue } from './AttributeValue';

export class AttributeValueListCollection extends ListCollection<AttributeValue<any>> {
  override clone() {
    return new AttributeValueListCollection(this.items);
  }

  add(item: AttributeValue<any>): void {
    if (this.hasAttribute(item.attribute)) this.removeAttribute(item.attribute);

    super.add(item);
  }

  addDefaults(attributes: AttributeListCollection): void {
    const withDefaultsAttributes = attributes.items.filter((m) => NullableObject.hasValue(m.defaultValue));
    for (const attribute of withDefaultsAttributes) {
      if (!this.hasAttribute(attribute)) this.add(attribute.createValue(attribute.defaultValue));
    }
  }

  find<Value extends ValueObjectAtomicValue>(attribute: Attribute<Value>) {
    return NullableObject(this.items.find((m) => m.attribute.isEquals(attribute))) as AttributeValue<Value>;
  }

  findValue<Value extends ValueObjectAtomicValue>(attribute: Attribute<Value>) {
    return NullableObject.map(this.find(attribute), (m) => m.value);
  }

  findValueStrict<Value extends ValueObjectAtomicValue>(attribute: Attribute<Value>) {
    const value = this.findValue(attribute);
    if (NullableObject.isEmpty(value)) return void this.throwInvalidAttribute(attribute);

    return value;
  }

  hasAttribute(attribute: Attribute<any>) {
    return this.items.findIndex((m) => m.attribute.isEquals(attribute)) !== -1;
  }

  canBeRequireAttribute(attribute: Attribute<any>): boolean {
    if (!this.hasAttribute(attribute)) return false;

    if (NullableObject.hasValue(attribute.customRule)) {
      const isOkay = attribute.customRule(this.findValueStrict(attribute));
      if (!isOkay) return false;
    }

    return true;
  }

  requireAttribute(attribute: Attribute<any>) {
    if (!this.canBeRequireAttribute(attribute)) this.throwInvalidAttribute(attribute);
  }

  requireSomeOfAttributes(attributes: Attribute<any>[], requiredCount: number = 1) {
    if (attributes.length <= 0) return;
    requiredCount = Math.max(0, Math.min(attributes.length, requiredCount));

    const requireResults = attributes.map((attribute) => ({ attribute, isCorrect: this.canBeRequireAttribute(attribute) }));
    const isCorrectCount = requireResults.filter((m) => m.isCorrect).length;

    if (isCorrectCount < requiredCount) {
      const firstCanNotBeRequiredAttribute = requireResults.filter((m) => !m.isCorrect)[0];
      this.throwInvalidAttribute(firstCanNotBeRequiredAttribute.attribute);
    }
  }

  /** Порядок важен! Оставляет те, которые идут в самом начале по приоритету */
  removeSomeOfAttributes(attributes: Attribute<any>[], requiredCount: number = 1) {
    if (attributes.length <= 0) return;
    requiredCount = Math.max(0, Math.min(attributes.length, requiredCount));

    const toRemoveAttributes: Attribute<any>[] = [];

    let index = 0;
    for (const attribute of attributes) {
      const isCorrect = this.canBeRequireAttribute(attribute);
      if (isCorrect) {
        index++;
        if (index > requiredCount) {
          toRemoveAttributes.push(attribute);
        }
      } else {
        toRemoveAttributes.push(attribute);
      }
    }

    for (const attribute of toRemoveAttributes) {
      this.removeAttribute(attribute);
    }
  }

  removeAttribute(attribute: Attribute<any>) {
    const values = this.items.filter((m) => m.attribute.isEquals(attribute));
    values.forEach((value) => this.remove(value));
  }

  /**
   * Оставляет только такие, которые поддерживаются
   * @param status
   * @param values
   * @returns
   */
  onlySupportedAttributes(supportedAttributes: AttributeListCollection | Attribute<any>[]) {
    const attributeListCollection = AttributeListCollection.isExtends(supportedAttributes) ? supportedAttributes : new AttributeListCollection(supportedAttributes);

    const notSupportedValues = this.items.filter((value) => !attributeListCollection.isExists(value.attribute));
    notSupportedValues.forEach((value) => this.remove(value));
  }

  setValue<Value extends ValueObjectAtomicValue>(value: Voidable<Nullable<Value>>, attribute: Attribute<Value>): void;
  setValue<Income, Value extends ValueObjectAtomicValue>(value: Voidable<Nullable<Income>>, attribute: Attribute<Value>, map: (income: Income) => Value): void;
  setValue<Income, Value extends ValueObjectAtomicValue>(value: Voidable<Nullable<Income | Value>>, attribute: Attribute<Value>, map?: (income: Income) => Value): void {
    if (VoidableObject.hasValue(value)) {
      if (NullableObject.hasValue(value)) {
        if (typeof map === 'function') {
          this.add(attribute.createValue(map(<Income>value)));
        } else {
          this.add(attribute.createValue(<Value>value));
        }
      } else {
        this.add(attribute.createValue(<Value>NullableObject));
        // this.removeAttribute(attribute);
      }
    }
  }

  async setValueAsync<Income, Value extends ValueObjectAtomicValue>(value: Voidable<Nullable<Income>>, attribute: Attribute<Value>, map: (income: Income) => Promise<Value>) {
    if (VoidableObject.hasValue(value)) {
      if (NullableObject.hasValue(value)) {
        this.add(attribute.createValue(await map(value)));
      } else {
        this.add(attribute.createValue(<Value>NullableObject));
        // this.removeAttribute(attribute);
      }
    }
  }

  throwInvalidAttribute(attribute: Attribute<any>) {
    throw new LotInvalidAttributeError(attribute.name);
  }
}
