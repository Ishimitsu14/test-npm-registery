import { NODE_ENV } from '@packages/berish-configurator-core';
import fs from 'fs';
import path from 'path';

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd());
const moduleFileExtensions = ['mjs', 'js', 'ts', 'tsx', 'json', 'jsx'];

export function resolveApp(relativePath: string) {
  return path.resolve(appDirectory, relativePath);
}

// Resolve file paths in the same order as webpack
export function resolveModule(resolveFn: (relative: string) => string, filePath: string) {
  const extension = moduleFileExtensions.find((extension) => fs.existsSync(resolveFn(`${filePath}.${extension}`)));
  if (extension) return resolveFn(`${filePath}.${extension}`);
  return resolveFn(`${filePath}.js`);
}

const dotenvRoot = resolveApp('.env');

// Don't include `.env.local` for `test` environment
// since normally you expect tests to produce the same
// results for everyone
const dotenvFiles = [`${dotenvRoot}.${NODE_ENV}.local`, `${dotenvRoot}.${NODE_ENV}`, NODE_ENV !== 'test' && `${dotenvRoot}.local`, dotenvRoot].filter(Boolean);

export const paths = {
  appDirectory,
  moduleFileExtensions,

  appPackageJson: resolveApp('package.json'),
  appNodeModules: resolveApp('node_modules'),
  dotenv: { root: dotenvRoot, files: dotenvFiles },
  appPath: resolveApp('.'),
  appSrc: resolveApp('src'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appCache: resolveApp('.cache'),

  appSrcIndexJs: resolveModule(resolveApp, 'src/index'),
  appBuildIndexJs: resolveModule(resolveApp, 'build/index'),
};
