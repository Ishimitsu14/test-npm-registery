import type { Context } from './Context';

export class ContextData<Value> {
  private readonly _context: Context<Value>;
  private readonly _value: Value;

  constructor(context: Context<Value>, value: Value) {
    this._context = context;
    this._value = value;
  }

  get context() {
    return this._context;
  }

  get value() {
    return this._value;
  }

  run<T>(callback: () => T): T {
    return this._context.run(this._value, callback);
  }

  bind<T extends (...args: any[]) => any>(callback: T): T {
    return this._context.bind(this._value, callback);
  }
}
