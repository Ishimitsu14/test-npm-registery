import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import fs from 'fs';

import { paths } from './paths';

let __isLoaded = false;

export function loadEnv(): void {
  if (__isLoaded) return void 0;

  __isLoaded = true;

  for (const file of paths.dotenv.files) {
    if (fs.existsSync(file)) {
      expand(
        config({
          path: file,
        }),
      );
    }
  }
}
