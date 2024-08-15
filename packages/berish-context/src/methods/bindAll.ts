import { ContextData } from '../ContextData';

export function bindAll<T extends (...args: any[]) => any>(callback: T, ...providers: ContextData<any>[]): T {
  return providers.reduce<T>((next, provider) => provider.bind(next), callback);
}
