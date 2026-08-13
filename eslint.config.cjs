module.exports = [
  { ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**', '.vscode/**', 'coverage/**'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: { project: './tsconfig.json' }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'import': require('eslint-plugin-import'),
      'unused-imports': require('eslint-plugin-unused-imports')
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/no-unused-modules': ['warn', { unusedExports: true }]
    },
    settings: { 'import/resolver': { typescript: {} } }
  }
];
