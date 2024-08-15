module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:json/recommended', 'prettier'],
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'unused-imports', 'simple-import-sort'],
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['.eslintrc.js', 'tsconfig*.json', '*.md', 'package*.json', 'nest-cli.json'],
  parserOptions: {
    ecmaVersion: 'latest',
    project: 'tsconfig.build.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    extraFileExtensions: ['.json'],
  },

  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/prefer-namespace-keyword': 'off',
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    '@typescript-eslint/no-unused-vars': 'off',

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-absolute-path': 'error',
    'unused-imports/no-unused-imports': 1,
  },
};
