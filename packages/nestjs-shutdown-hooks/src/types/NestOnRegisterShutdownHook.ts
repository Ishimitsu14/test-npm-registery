import { INestApplicationContext } from '@nestjs/common';

export interface NestOnRegisterShutdownHook {
  onRegisterShutdownHook(app: INestApplicationContext): any;
}
