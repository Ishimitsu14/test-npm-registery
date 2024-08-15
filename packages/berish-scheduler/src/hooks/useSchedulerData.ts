import { useContext } from '@packages/berish-context';

import { SchedulerDataContext } from '../contexts';

export function useSchedulerData<T>(): T {
  return useContext(SchedulerDataContext) as T;
}
