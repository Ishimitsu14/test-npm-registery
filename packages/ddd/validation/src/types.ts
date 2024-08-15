export type Schema<T> = Array<Schema<T>> | ObjectSchema<T> | Validator<T> | RefSchema<T>;

export type SchemaKey = string | number;
export type ObjectSchema<T extends Record<string, any>> = {
  [P in keyof T]-?: Schema<T[P]>;
};
export type RefSchema<T> = { ref: () => Schema<T> };

export type ValidatorType = string | string[];
export type ValidatorFunction<T> = (value: any, key: SchemaKey[]) => boolean;
export type Validator<T = any> = {
  type: ValidatorType;

  disableNullCheck?: boolean;
  validate?: (Validator<any> | ValidatorFunction<T>)[];
  composite?: (value: T, key: SchemaKey[], isValidated: boolean) => ValidationResult[];
};

export type ValidationResult = {
  key: SchemaKey[];
  type: ValidatorType;
  validator: Validator<any>;
  isValidated: boolean;
};
