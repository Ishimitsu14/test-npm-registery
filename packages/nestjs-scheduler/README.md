# Schedulers

Используется для интервальных задач. Реализуется на основе адаптеров, которые умееют регистрировать и выполнять повторяющиеся события. Является фасадом для удобной настройки таких задач.

## Способы регистрации задач

Задачи могут быть зарегистрированы следующими способами:

- Ручным, через вызов метоа регистрации
- Автоматически, используя NestJS контекст

## Начало работы

Для начала необходимо создать Scheduler, который будет отвечать за регистрацию задач

```typescript
const scheduler = new Scheduler({ adapter, namespace: '<current app id>' });
```

Далее можно регистрировать интервальные задачи

```typescript
scheduler.registerStreamSingleRepeatTask('unique task id', { every: 10000, data: '0x123123' }, (data) => doAction());

scheduler.registerStreamManyRepeatTasks(
  'unique group task id',
  [
    { every: 10000, data: '0x123123' },
    { every: 15000, data: '0x321321' },
  ],
  (data) => doAction(),
);
```

## Nest

Для Nest нужны следующие зависимости: DiscoveryModule, ContextRegistrator (из @package/nestjs-request-context)

```typescript
const providers = [
  ...SchedulerNestProvidersInject({
    useFactory: (scheduler: Scheduler) => scheduler,
    inject: [<SCHEDULER_TOKEN>]
  })
]
```

Если нужны динамические задачи, например, прогрузить данные из БД и после выставить какие-то задачи относительно этих данных, тогда использовать ручной способ
