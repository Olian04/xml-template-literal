import { xml } from '../dist/api';

const ast = xml`
  <div>Hello, ${2} World!</div>
`;

console.log(ast);
