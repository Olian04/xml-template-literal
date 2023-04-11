/** @type {import('mocha').MochaOptions} */
module.exports = {
  parallel: true,
  spec: ['./tests/**/*.test.ts'],
  require: ['ts-node/register'],
  recursive: true,
};
