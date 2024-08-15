import { ConstructorType } from '../../core';
import { IDomainEvent } from '../../domain';
import { RegisterMediatorNotificationTrigger } from '../Mediator';
import { IDomainEventTrigger } from './IDomainEventTrigger';

export const DOMAIN_EVENT_TRIGGER = Symbol('DOMAIN_EVENT_TRIGGER');
export const DOMAIN_EVENT_TRIGGER_EVENT_TYPES = Symbol('DOMAIN_EVENT_TRIGGER_EVENT_TYPES');

export function RegisterDomainEventTrigger(...domainEventTypes: ConstructorType<IDomainEvent>[]): ClassDecorator {
  const decorators = domainEventTypes.map((domainEventType) => RegisterMediatorNotificationTrigger(domainEventType));
  return (target: ConstructorType<IDomainEventTrigger<IDomainEvent>>) => {
    for (const decorator of decorators) {
      decorator(target);
    }
  };
}
