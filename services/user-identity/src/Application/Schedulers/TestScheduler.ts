import { RegisterScheduler } from '@packages/nestjs-scheduler';

@RegisterScheduler(TestScheduler.name, { every: 1000 })
export class TestScheduler {
  async execute(): Promise<void> {
    console.log('TestScheduler');
  }
}
