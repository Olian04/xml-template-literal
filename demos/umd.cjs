const { xml } = require('xml-template-literal');

const ast = xml`
  <div>Hello, ${2} World!</div>
`;

console.log(ast);
