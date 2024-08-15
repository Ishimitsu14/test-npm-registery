import { CustomDecorator } from '@nestjs/common';

import { CONSUMER_CUSTOM_METADATA_MAP_METADATA } from '../const';

export function NestConsumerCustomMetadata(key: string | symbol, value: any): CustomDecorator<typeof CONSUMER_CUSTOM_METADATA_MAP_METADATA> {
  const method = (target, prop?) => {
    const map = Reflect.getMetadata(CONSUMER_CUSTOM_METADATA_MAP_METADATA, target, prop) || {};
    map[key] = value;
    Reflect.defineMetadata(CONSUMER_CUSTOM_METADATA_MAP_METADATA, map, target, prop);
  };
  method.KEY = CONSUMER_CUSTOM_METADATA_MAP_METADATA;
  return method;
}
