import { ConfigParser } from '@packages/berish-configurator-core';
import fs from 'fs';

import { resolveApp } from '../utils';

export const fileParser: ConfigParser<Buffer> = (path: string) => {
  if (!path) return null;

  const fullPath = resolveApp(path);
  if (!fullPath) return null;
  if (!fs.existsSync(fullPath)) return null;

  return fs.readFileSync(fullPath);
};
