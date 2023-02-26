// import { describe, it } from 'mocha';
// import { expect } from 'chai';

// import { tokenizer } from '../src/tokenizer';
// import { optimizer } from '../src/optimizer';
// import { lexer } from '../src/lexer';

// describe('lexer', () => {
//   it('should return an AST', () => {
//     const ast = lexer(
//       optimizer(
//         tokenizer({
//           dynamic: [],
//           static: [],
//         })
//       )
//     );
//     expect(ast).to.deep.equal({
//       type: 'root',
//       children: [],
//     });
//   });

//   it('should join together dynamic and static parts in one AST', () => {
//     const A = { foo: 0 };
//     const ast = lexer(
//       optimizer(
//         tokenizer({
//           dynamic: [A],
//           static: ['<someTag property="value" prop="', '"></someTag>'],
//         })
//       )
//     );
//     expect(ast).to.deep.equal({
//       type: 'root',
//       children: [
//         {
//           type: 'child',
//           kind: 'node',
//           tag: 'someTag',
//           children: [],
//           attributes: [
//             { key: 'property', value: ['value'] },
//             { key: 'prop', value: [A] },
//           ],
//         },
//       ],
//     });
//   });
// });
