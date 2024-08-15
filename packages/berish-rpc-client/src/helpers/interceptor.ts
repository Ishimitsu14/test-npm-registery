import { v4 } from 'uuid';

export type InterceptorCallback<Income, Outcome> = (result: Income, next: () => Promise<any>) => Promise<Outcome>;

export interface Interceptor<Income, Outcome> {
  use: (callback: InterceptorCallback<Income, Outcome>) => string;
  eject: (id: string) => void;
  all: () => InterceptorCallback<Income, Outcome>[];
  call: InterceptorCallback<Income, Outcome>;
  combine: () => InterceptorCallback<Income, Outcome>;
}

export function createInterceptor<Income, Outcome>(): Interceptor<Income, Outcome> {
  let map: { id: string; callback: InterceptorCallback<Income, Outcome> }[] = [];

  const use: Interceptor<Income, Outcome>['use'] = (callback) => {
    const id = v4();
    map.push({ id, callback });
    return id;
  };

  const eject: Interceptor<Income, Outcome>['eject'] = (id) => {
    map = map.filter((m) => m.id !== id);
  };

  const all: Interceptor<Income, Outcome>['all'] = () => map.map((m) => m.callback);

  const combine: Interceptor<Income, Outcome>['combine'] = () => {
    return (result, next) => {
      const interceptors = all();
      if (!interceptors || interceptors.length <= 0) return next();

      const reducedInterceptor = interceptors.reduceRight<() => Promise<any>>((next, interceptor) => {
        return async () => await interceptor(result, next);
      }, next);

      return reducedInterceptor();
    };
  };

  const call: Interceptor<Income, Outcome>['call'] = async (result, next) => {
    const combinedInterceptor = combine();
    return combinedInterceptor(result, next);
  };

  return {
    use,
    eject,
    all,
    combine,
    call,
  };
}
