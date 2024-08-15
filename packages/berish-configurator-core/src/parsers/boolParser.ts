import { ConfigParser } from '../types';

export const boolParser: ConfigParser<boolean> = (value: string) => !!value && value.toString().toLowerCase() === 'true';
