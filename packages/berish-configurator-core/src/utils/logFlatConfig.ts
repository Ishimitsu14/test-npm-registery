function traverseAndFlatten(currentNode: Record<string, any>, target: Record<string, any>, flattenedKey?: string) {
  for (const key in currentNode) {
    if (key in currentNode) {
      let newKey: string;
      if (typeof flattenedKey === 'undefined') {
        newKey = key;
      } else {
        newKey = flattenedKey + '.' + key;
      }

      const value = currentNode[key];
      if (typeof value === 'object') {
        traverseAndFlatten(value, target, newKey);
      } else {
        target[newKey] = typeof value === 'undefined' ? null : value;
      }
    }
  }
}

export function logFlatConfig(obj: Record<string, any>) {
  const flattenedObject = {};
  traverseAndFlatten(obj, flattenedObject);
  return flattenedObject;
}
