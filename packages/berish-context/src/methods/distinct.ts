import { Context } from '../Context';

export function distinct<Value>(contexts: Context<Value>[]) {
  const uniqueContexts: Set<Context<Value>> = new Set();

  for (const context of contexts) {
    if (uniqueContexts.has(context)) {
      uniqueContexts.delete(context);
      uniqueContexts.add(context);
    } else {
      uniqueContexts.add(context);
    }
  }

  return Array.from(uniqueContexts);
}
