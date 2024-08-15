import { Inject, Injectable, InjectionToken, Logger } from '@nestjs/common';
import { ContextId, ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Context } from '@packages/berish-context';

@Injectable()
export class NestContextManager {
  @Inject(ModuleRef)
  private moduleRef: ModuleRef;

  private readonly NEST_ID_CONTEXT = new Context<ContextId>();
  private _requestContextWeakMap: WeakMap<object, ContextId> = new WeakMap();

  get context() {
    return this.NEST_ID_CONTEXT;
  }

  /**
   * Если ContextId передан, тогда запускает на основе него.
   * Если значения нет, тогда использует текущий ContextId в потоке. Если его нет, создает новый ContextId
   * @param callback Поток
   * @param contextId Уникальный идентификатор текущего запроса (NestJS)
   * @returns Результат выполнения потока
   */
  runInContext<T>(callback: () => T, contextId?: ContextId) {
    contextId = contextId || this._currentOrCreateContextId();
    return this._runInContext(callback, contextId);
  }

  /**
   * Выполняет поток по уникальному запросу. Если такой запрос уже был, тогда контекст остается одним и тем же.
   * Если запрос не является объектом (или он null), тогда запускает в текущем контексте
   * @param callback Поток
   * @param request Уникальный объект запроса
   * @returns Результат выполнения потока
   */
  runInContextByRequest<T>(callback: () => T, request: object): T {
    if (!request || typeof request !== 'object') {
      return this.runInContext(callback);
    }

    const contextId = this._requestContextWeakMap.get(request) || this._currentOrCreateContextId();
    if (this._requestContextWeakMap.get(request) !== contextId) {
      this._requestContextWeakMap.set(request, contextId);
    }

    return this.runInContext(callback, contextId);
  }

  /**
   * Принудительно создает новый ContextId и запускает в нем поток
   * @param callback  Поток
   * @returns Результат выполнения потока
   */
  forceRunInNewContext<T>(callback: () => T): T {
    const contextId = this._createContextId();
    return this._runInContext(callback, contextId);
  }

  getCurrentContextId(): ContextId {
    const contextId = this.context.getValue();
    if (!contextId) {
      Logger.warn('ContextId is missing, include RequestContextInterceptor in controllers for dynamic resolve by contextId', 'RequestContextResolver');
      throw new Error('ContextId is missing, include RequestContextInterceptor in controllers for dynamic resolve by contextId');
    }
    return contextId;
  }

  resolve<T>(token: InjectionToken): Promise<T> {
    const contextId = this.getCurrentContextId();
    return this.moduleRef.resolve(token, contextId, { strict: false });
  }

  createResolver<T>(token: InjectionToken): () => Promise<T> {
    return () => this.resolve(token);
  }

  private _runInContext<T>(callback: () => T, contextId: ContextId) {
    return this.context.run(contextId, callback);
  }

  private _createContextId(): ContextId {
    return ContextIdFactory.create();
  }

  private _currentOrCreateContextId(): ContextId {
    return this.context.getValue() || this._createContextId();
  }
}
