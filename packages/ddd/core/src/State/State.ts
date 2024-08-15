export class State<T extends object> {
  static applyState<T extends object>(reference: T, state: State<T>): T {
    Object.setPrototypeOf(reference, state._proto);
    Object.defineProperties(reference, state._descriptorsMap);
    return reference;
  }

  static getStateFromReference<T extends object>(item: T): State<T> {
    return new State<T>(Object.getPrototypeOf(item), Object.getOwnPropertyDescriptors(item));
  }

  static isExtends<T extends object>(instance: any): instance is State<T> {
    return !!instance && instance instanceof State;
  }

  private _proto: object;
  private _descriptorsMap: Record<string, PropertyDescriptor>;

  private constructor(proto: object, descriptorsMap: Record<string, PropertyDescriptor>) {
    this._proto = proto;
    this._descriptorsMap = descriptorsMap;
  }
}
