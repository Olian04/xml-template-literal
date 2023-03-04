import { xml } from '..';

const ast = xml`
  <div>Hello, ${2} World!</div>
`;

console.log(ast);
