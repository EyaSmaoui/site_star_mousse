const nodeGlobals = {
  require: 'readonly',
  module: 'readonly',
  exports: 'readonly',
  process: 'readonly',
  console: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  Buffer: 'readonly',
  URL: 'readonly'
};

module.exports = [{
  ignores: ['chatbot/.venv/**'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'commonjs',
    globals: nodeGlobals
  },
  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off'
  }
}];
