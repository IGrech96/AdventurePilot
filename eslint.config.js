module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    project: ['./tsconfig.node.json', './tsconfig.app.json'],
    tsconfigRootDir: __dirname
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};