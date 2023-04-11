const { xml } = require('../legacy/umd.cjs');

const ast = xml`
  <div>Hello, ${2} World!</div>
`;

console.log(ast);
