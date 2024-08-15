import { useContext } from '@packages/berish-context';

import { SchedulerNextContext } from '../contexts';

export function useSchedulerNext() {
  return useContext(SchedulerNextContext);
}
