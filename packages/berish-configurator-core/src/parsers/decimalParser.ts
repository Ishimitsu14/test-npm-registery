import Decimal from 'decimal.js';

import { ConfigParser } from '../types';

export const decimalParser: ConfigParser<Decimal> = (value: string) => {
  if (value === '0') return new Decimal(0);
  if (!value) return undefined;

  if (value.toString().toLowerCase() === 'infinity') return new Decimal(Infinity);
  if (value.toString().toLowerCase() === 'nan') return new Decimal(NaN);

  return new Decimal(value);
};
