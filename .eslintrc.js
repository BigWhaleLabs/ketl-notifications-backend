require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: ['@big-whale-labs/bwl-eslint-backend'],
  parserOptions: { tsconfigRootDir: __dirname },
}
