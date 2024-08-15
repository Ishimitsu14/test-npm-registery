import { SchemaKey, ValidationResult, Validator } from '../types';

export function validateValidator<T>(validator: Validator<T>, value: T, key: SchemaKey[] = []): ValidationResult[] {
  const results: ValidationResult[] = [];
  const isNil = typeof value === 'undefined' || value === null;
  let isValidated = true;

  if (!isNil || (isNil && validator.disableNullCheck)) {
    if (Array.isArray(validator.validate)) {
      isValidated = validator.validate.every((validateAtomic) => {
        if (typeof validateAtomic === 'function') {
          const isValidated = validateAtomic(value, key);
          return isValidated;
        } else {
          const results = validateValidator(validateAtomic, value, key);
          const isValidated = results.filter((m) => m.key.join('.') === key.join('.')).every((m) => m.isValidated);
          return isValidated;
        }
      });
    }

    if (typeof validator.composite === 'function' && isValidated) {
      results.push(...validator.composite(value, key, isValidated));
    }
  }

  results.unshift({
    key,
    type: validator.type,
    validator,
    isValidated,
  });

  return results;
}
