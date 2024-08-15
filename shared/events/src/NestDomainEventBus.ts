import { DomainEventBus } from '@ddd/events';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

export class NestDomainEventBus implements OnModuleInit {
  @Inject(DiscoveryService)
  private discoveryService: DiscoveryService;

  private _domainEventBus = new DomainEventBus();

  get domainEventBus() {
    return this._domainEventBus;
  }

  onModuleInit() {
    const providers = this.discoveryService
      .getProviders()
      .map((wrapper) => wrapper?.instance)
      .filter(Boolean);
    this._domainEventBus.registerTriggers(providers);

    for (const entry of this._domainEventBus.entries) {
      Logger.log(`Registered trigger '${entry.triggerClass.name}' for event '${entry.type.name}'`, NestDomainEventBus.name);
    }
  }
}
