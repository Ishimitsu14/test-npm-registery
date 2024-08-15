import { NullableObject } from '@ddd/core';

import { AttributeHook, AttributeListCollection, AttributeValueListCollection, LotStatus } from '../../Lot';

export abstract class CategoryStrategy {
  abstract get supportedAttributes(): AttributeListCollection;

  protected abstract createCommon(status: LotStatus, attributes: AttributeValueListCollection): void;
  protected abstract createDraft(attributes: AttributeValueListCollection): void;
  protected abstract createOnModeration(attributes: AttributeValueListCollection): void;
  protected abstract createActive(attributes: AttributeValueListCollection): void;
  protected abstract createCompleted(attributes: AttributeValueListCollection): void;
  protected abstract createArchived(attributes: AttributeValueListCollection): void;
  protected abstract createRejected(attributes: AttributeValueListCollection): void;
  protected abstract registerHooks(): AttributeHook[];

  protected abstract internalChangeCategory(status: LotStatus, fromCategory: CategoryStrategy, attributes: AttributeValueListCollection): void;

  changeStrategy(status: LotStatus, fromStrategy: CategoryStrategy, prevCollection: AttributeValueListCollection, newCollection: AttributeValueListCollection) {
    // 1. Делаем клон списка, чтобы не менять настоящий список
    newCollection = newCollection.clone();
    prevCollection = prevCollection.clone();

    // Получаем новые аттрибуты со всеми новыми значениями
    const valuesCollection = prevCollection.concat(newCollection);
    valuesCollection.onlySupportedAttributes(this.supportedAttributes);
    valuesCollection.addDefaults(this.supportedAttributes);

    // 2. Помогаем перекатить аттрибуты
    this.internalChangeCategory(status, fromStrategy, valuesCollection);

    // 3. Относительно статуса, подготавливаем текущую категорию, чтобы она была в согласованном состоянии
    const registeredHooks = this.registerHooks();
    for (const hook of registeredHooks) {
      const isNeededToExecute = NullableObject.isEmpty(hook.deps) || hook.deps.some((dep) => newCollection.hasAttribute(dep));
      if (isNeededToExecute) {
        hook.callback(valuesCollection);
      }
    }

    return this.evaluateByStatus(status, valuesCollection);
  }

  updateAttributes(status: LotStatus, prevCollection: AttributeValueListCollection, newCollection: AttributeValueListCollection) {
    // Делаем копию
    newCollection = newCollection.clone();
    prevCollection = prevCollection.clone();

    // Получаем новые аттрибуты со всеми новыми значениями
    const valuesCollection = prevCollection.concat(newCollection);
    valuesCollection.onlySupportedAttributes(this.supportedAttributes);
    valuesCollection.addDefaults(this.supportedAttributes);

    const registeredHooks = this.registerHooks();
    for (const hook of registeredHooks) {
      const isNeededToExecute = NullableObject.isEmpty(hook.deps) || hook.deps.some((dep) => newCollection.hasAttribute(dep));
      if (isNeededToExecute) {
        hook.callback(valuesCollection);
      }
    }

    return this.evaluateByStatus(status, valuesCollection);
  }

  /**
   * Выполняет валидацию значений + выдает ошибку, если что-то не корректно
   * @param status
   * @param values
   * @returns
   */
  private evaluateByStatus(status: LotStatus, origValuesCollection: AttributeValueListCollection) {
    // 1. Делаем копию коллекции, чтобы не менять оригинальную
    const valuesCollection = origValuesCollection.clone();
    // 2. Удаляем не поддерживаемые категорией аттрибуты
    valuesCollection.onlySupportedAttributes(this.supportedAttributes);
    // Добавление значений по-умолчанию
    valuesCollection.addDefaults(this.supportedAttributes);

    // 3. В зависимости от статуса, до-готавливаем коллекцию.
    // Может выдавать ошибки, если аттрибуты не подходят под условия
    this.createCommon(status, valuesCollection);

    if (status.isEquals(LotStatus.DRAFT)) {
      this.createDraft(valuesCollection);
    } else if (status.isEquals(LotStatus.ON_MODERATION)) {
      this.createOnModeration(valuesCollection);
    } else if (status.isEquals(LotStatus.ACTIVE)) {
      this.createActive(valuesCollection);
    } else if (status.isEquals(LotStatus.COMPLETED)) {
      this.createCompleted(valuesCollection);
    } else if (status.isEquals(LotStatus.ARCHIVED)) {
      this.createArchived(valuesCollection);
    } else if (status.isEquals(LotStatus.REJECTED)) {
      this.createRejected(valuesCollection);
    }

    // 4. Еще раз убеждаемся, что не было добавлено аттрибутов, которые не поддерживаются текущей категорией
    valuesCollection.onlySupportedAttributes(this.supportedAttributes);
    // Добавление значений по-умолчанию
    valuesCollection.addDefaults(this.supportedAttributes);

    return valuesCollection;
  }
}
