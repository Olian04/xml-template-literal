const { MochaOptions } = require('mocha');

/** @type {MochaOptions} */
module.exports = {
  spec: ['./tests/**/*.test.ts', './tests/**/*.spec.ts'],
  require: ['ts-node/register'],
  recursive: true,
};
