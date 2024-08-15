import { Nullable, NullableObject } from '@ddd/core';
import { faker } from '@faker-js/faker';
import { Inject, Logger } from '@nestjs/common';
import { NestContextManager } from '@packages/nestjs-request-context';
import { v4 } from 'uuid';

export class SeedUtils {
  @Inject(NestContextManager)
  private NestContextManager: NestContextManager;

  flip(percent: number = 50): boolean {
    const random = faker.helpers.rangeToNumber({ min: 1, max: 100 });
    return random <= percent;
  }

  flipCallback<T>(callback?: () => T, percent: number = 50): Nullable<T> {
    if (this.flip(percent)) return callback();
    return NullableObject;
  }

  /** 31.01.2023 -> Date */
  parseDate(input: string): Date {
    const parts = input.match(/(\d+)/g);
    return new Date(+new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])) - 1);
  }

  async bootstrap(seed: () => Promise<void>): Promise<void> {
    await this.NestContextManager.runInContext(async () => {
      try {
        Logger.log('STARTED', 'SEED');
        await seed();
        Logger.log('SUCCESS', 'SEED');
      } catch (err) {
        Logger.log('ERROR', 'SEED');
        throw err;
      }
    });
  }

  async newRequest<T>(label: string, callback: () => Promise<T>): Promise<T> {
    return await this.NestContextManager.forceRunInNewContext(async () => {
      const requestID = v4();

      Logger.log(`[${label}] Start SEED request: ${requestID}`, 'SEED');
      const result = await callback();
      Logger.log(`[${label}] Finished SEED request: ${requestID}`, 'SEED');

      return result;
    });
  }
}
