export interface IIntegrationEventFactory<Type extends string, Content extends Record<string, any>> {
  eventId?: string;
  eventType: Type;
  createdAt: Date;
  content: Content;
}
