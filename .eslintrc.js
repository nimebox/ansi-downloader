module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: [ 'standard', 'plugin:vue/essential'],
  globals: {
    __static: true
  },
  plugins: ['vue'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
