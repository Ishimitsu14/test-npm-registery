# nestjs-shutdown-hooks

Пакет нужен для отлавливания любых критичных ошибок, которые происходят в проекте.
По-умолчанию NestJS не умеет цеплять все ошибки, которые происходят внутри. Приложение может остаться запущенным, но быть в критичном состоянии

Так же у нас по-умолчанию отсутствует возможность в своих провайдерах регистировать хук завершения (например, если БД почему-то отключилась, приложение не завершится, хотя текущее состояние является критичным). Пакет предоставляет специальный хук, с помощью которого такие действия можно цеплять.

## Инициализация

Сначала необходимо зарегистировать приложение (инстанс NestJS). Так как он регистрируется в функции, и это функция инициализации тоже может сработать с ошибками, нам необходимо иметь Wrapper.
Для всего приложения (инстанса Node) должен быть зарегистрирован только 1 (ОДИН) `NestShutdownRoot`

Пример:

```typescript
// main.ts

import { NestFactory } from '@nestjs/core';
import { NestShutdownRoot } from '@packages/nestjs-shutdown-hooks';

import { CustomModule } from './module';

async function bootstrap() {
  const app = await NestFactory.create(MicroserviceModule);

  // Происходит специальная регистрация приложения
  await app.get(NestShutdownRoot).registerApp(app);

  await app.init();
  await app.startAllMicroservices();
}

// Сразу запускает переданную функцию, и ловит ошибки.
NestShutdownRoot.bootstrapRun(bootstrap);
```

Так же забываем добавить провайдер в первоначальный Module

```typescript
// module.ts

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [NestShutdownRoot],
})
export class UserIdentityModule {}
```

## Пример использования в провайдере

```typescript
// provider.ts

import { INestApplicationContext, Injectable, OnModuleInit } from '@nestjs/common';
import { NestOnRegisterShutdownHook } from '@package/nestjs-shutdown-hooks';

import { PrismaClient as BasePrismaClient } from '../$GENERATED_PRISMA_CLIENT';

@Injectable()
export class PrismaClient extends BasePrismaClient implements OnModuleInit, NestOnRegisterShutdownHook {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  onRegisterShutdownHook(app: INestApplicationContext) {
    // Прослушка завершения соединения у DB
    this.$on('beforeExit', async () => {
      // graceful exit
      await app.close();
    });
  }
}
```
