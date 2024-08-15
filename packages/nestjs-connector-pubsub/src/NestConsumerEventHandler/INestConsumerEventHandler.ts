export interface INestConsumerEventHandler<EventMap extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>, EventName extends keyof EventMap = keyof EventMap> {
  execute(...args: Parameters<EventMap[EventName]>): ReturnType<EventMap[EventName]>;
}

export interface INestConsumerEventHandlerMethod<
  EventMap extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>,
  EventName extends keyof EventMap = keyof EventMap,
> {
  (...args: Parameters<EventMap[EventName]>): ReturnType<EventMap[EventName]>;
}

export type INestConsumerEventHandlerMethodParameters<
  EventMap extends Record<string, (...args: any[]) => any> = Record<string, (...args: any[]) => any>,
  EventName extends keyof EventMap = keyof EventMap,
> = Parameters<INestConsumerEventHandlerMethod<EventMap, EventName>>;
