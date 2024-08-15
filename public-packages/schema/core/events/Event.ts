import { Resource } from '../resource';

export interface Event<EventType extends string, Payload extends Record<string, any>> extends Resource<'event'> {
  eventType: EventType;
  eventId: string;
  timestamp: number;

  payload: Payload;
}
