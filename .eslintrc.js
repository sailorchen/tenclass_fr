module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'eol-last': 0,
    'indent': 0,
    'space-before-function-paren': 0,
    'comma-spacing': 0,
    'arrow-spacing': 0,
    'no-unused-vars': 0,
    'space-before-blocks': 0,
    'quote-props': 0,
    'no-trailing-spaces': 0,
    'object-curly-newline': 0,
    'vue/no-unused-vars':0,
    'no-unused-vars':0,
    'brace-style':0,
    'keyword-spacing':0,
    'space-in-parens':0,
    'space-infix-ops':0
  }
}
