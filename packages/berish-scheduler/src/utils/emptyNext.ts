import { SchedulerNext } from '../types';

export function emptyNext(): SchedulerNext {
  return () => Promise.resolve();
}
