import { Context } from '@packages/berish-context';

export const SchedulerNextContext = new Context<() => Promise<void>>(() => Promise.resolve());
