import { ContextData } from '../ContextData';

export function runAll<T>(callback: () => T, ...providers: ContextData<any>[]) {
  return providers.reduce<() => T>((next, provider) => () => provider.run(next), callback)();
}
