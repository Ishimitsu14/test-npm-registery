import { AsyncLocalStorage } from 'async_hooks';

import { ContextData } from './ContextData';
import { distinct } from './methods';

export interface Context<Value> {
  getValue(): Value;
  setValue(value: Value): void;
  run<T>(value: Value, callback: () => T): T;
  bind<T extends (...args: any[]) => any>(value: Value, callback: T): T;
}

export class Context<Value> {
  static tree: Context<Context<any>[]>;

  static {
    this.tree = new Context([]);
    this.tree._isTree = true;
  }

  private _asyncStorage: AsyncLocalStorage<Value>;
  private _isTree = false;

  constructor(value?: Value) {
    this._asyncStorage = new AsyncLocalStorage();
    this._asyncStorage.enterWith(value);
  }

  get currentContextData() {
    const value = this.getValue();
    return this.createContextData(value);
  }

  getValue(): Value {
    return this._asyncStorage.getStore();
  }

  run<T>(value: Value, callback: () => T): T {
    callback = this._wrapCallback(callback);

    return this._asyncStorage.run(value, callback);
  }

  bind<T extends (...args: any[]) => any>(value: Value, callback: T): T {
    callback = this._wrapCallback(callback) as any;

    return <T>((...args: any[]) => this._asyncStorage.run(value, () => callback(...args)));
  }

  setValue(value: Value): void {
    this._asyncStorage.enterWith(value);
  }

  createContextData(value: Value): ContextData<Value> {
    return new ContextData(this, value);
  }

  private _wrapCallback<T extends (...args: any[]) => any>(callback: T): T {
    if (this._isTree) return callback;

    const scopeContexts = Context.tree.getValue().slice();
    const newContexts = distinct([...scopeContexts, this]);

    return Context.tree.bind(newContexts, callback);
  }
}
