import { Validator } from '../types';

export function isValidator<T>(value: any): value is Validator<T> {
  if (typeof value === 'object' && Boolean(value)) {
    const hasType = 'type' in value;
    const typeValue = hasType ? value['type'] : void 0;
    const typeIsValid = hasType && (typeof typeValue === 'string' || (Array.isArray(typeValue) && typeValue.every((item) => typeof item === 'string')));

    const hasValidate = 'validate' in value;
    const validateValue = hasValidate ? value['validate'] : void 0;
    const validateIsValid = hasValidate && Array.isArray(validateValue) && validateValue.every((item) => isValidator(item) || typeof item === 'function');

    if (typeIsValid && validateIsValid) return true;
  }

  return false;
}

// export function isValidatorArray<T>(value: any): value is Validator<T>[] {
//   return Array.isArray(value) && !value.some((m) => !isValidator(m));
// }
