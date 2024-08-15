export interface IIntegrationEvent<Type extends string, Content extends Record<string, any>> {
  eventType: Type;
  eventId: string;
  createdAt: Date;
  content: Content;
}
