import { xml } from '../dist/api.js';

const ast = xml`
  <div>Hello, ${2} World!</div>
`;

console.log(ast);
