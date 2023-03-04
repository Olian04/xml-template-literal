const { MochaOptions } = require('mocha');

/** @type {MochaOptions} */
module.exports = {
  parallel: true,
  spec: ['./tests/**/*.test.ts', './tests/**/*.spec.ts'],
  require: ['ts-node/register', 'tsconfig-paths/register'],
  recursive: true,
};
