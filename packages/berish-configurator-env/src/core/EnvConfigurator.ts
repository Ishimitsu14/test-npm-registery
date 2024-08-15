import { AbstractConfigurator } from '@packages/berish-configurator-core';

import { loadEnv } from '../utils';

export class EnvConfigurator<Schema extends Record<string, any>> extends AbstractConfigurator<Schema> {
  constructor() {
    super();

    loadEnv();
  }

  protected configResolver(key: string) {
    return process.env[key];
  }
}
