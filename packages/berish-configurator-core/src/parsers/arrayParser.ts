import { ConfigParser } from '../types';

export function arrayParser(): ConfigParser<string[]>;
export function arrayParser(separator: string | RegExp): ConfigParser<string[]>;
export function arrayParser<T>(parser: ConfigParser<T>): ConfigParser<T[]>;
export function arrayParser<T>(parser: ConfigParser<T>, separator: string | RegExp): ConfigParser<T[]>;
export function arrayParser<T>(arg1?: ConfigParser<T> | string | RegExp, separator?: string | RegExp): ConfigParser<(string | T)[]> {
  return (value: string) => {
    const parser: ConfigParser<string | T> = typeof arg1 === 'function' ? arg1 : (value: string) => value;
    separator = (typeof arg1 !== 'function' ? arg1 : separator) || ',';

    if (typeof value === 'undefined' || value === null) return undefined;
    if (value === '[]') return [];
    if (!value.startsWith('[') || !value.endsWith(']')) return undefined;

    value = value.substring(1, value.length - 1);
    const splitted = value.split(separator).map((m) => m.trim());
    return splitted.map(parser);
  };
}
