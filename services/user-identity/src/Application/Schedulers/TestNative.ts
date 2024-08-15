import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerManager, useSchedulerData } from '@packages/berish-scheduler';

export class TestNative implements OnApplicationBootstrap {
  @Inject('SCHEDULER')
  private scheduler: SchedulerManager;

  async onApplicationBootstrap() {
    // await this.scheduler.registerGroupScheduler('testWorker', [
    //   { key: '123', data: '123', cron: '* * * * * *' },
    //   { key: '666', data: '666', every: 1000 },
    // ]);

    // await this.scheduler.registerGroupScheduler('testWorker', [
    //   { key: '123', data: '123', every: 5000 },
    //   { key: '425', data: '425', every: 1000 },
    // ]);

    await this.scheduler.registerScheduler('testWorker', { every: 1000 }, this.testWorker.bind(this));
  }

  async testWorker() {
    const data = useSchedulerData();
    console.log('start worker', data);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
