module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 0 : 0
  },
  parserOptions: {
    parser: 'babel-eslint',
    "ecmaVersion": 7
  }
}
