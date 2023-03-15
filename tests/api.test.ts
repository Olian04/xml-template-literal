import { describe, it } from 'mocha';
import { expect } from 'chai';

import { xml, AstKind, ChildType } from '!api';

describe('api', () => {
  it('should expose XML template literal function', () => {
    expect(typeof xml).to.equal('function');

    const A = { foo: 0 };
    const B = [1, 2, 3];
    const C = 42;
    const ast = xml<typeof A | typeof B | typeof C>`
      <someTag
        property="value"
        prop=${A}
        >
        <div id="bar">foo</div>
        ${B}
      </someTag>
      <greet name="World" />
      <greet name="World"></greet>
      <greet name="Foo ${C} Bar"></greet>
    `;

    expect(typeof ast).to.equal('object');
  });

  it('should work for an "Hello, world!" example ', () => {
    const ast = xml`<div>Hello, world!</div>`;

    expect(ast).to.deep.equal({
      kind: AstKind.Root,
      children: [
        {
          kind: AstKind.Child,
          type: ChildType.Node,
          tag: 'div',
          attributes: [],
          children: [
            {
              kind: AstKind.Child,
              type: ChildType.Text,
              value: 'Hello, world!',
            },
          ],
        }
      ],
    });
  });

  it('should work for an "Hello, ${name}!" example ', () => {
    const name = 'Oliver';
    const ast = xml`<div>Hello, ${name}!</div>`;

    expect(ast).to.deep.equal({
      kind: AstKind.Root,
      children: [
        {
          kind: AstKind.Child,
          type: ChildType.Node,
          tag: 'div',
          attributes: [],
          children: [
            {
              kind: AstKind.Child,
              type: ChildType.Text,
              value: 'Hello, ',
            },
            {
              kind: AstKind.Child,
              type: ChildType.Data,
              value: name,
            },
            {
              kind: AstKind.Child,
              type: ChildType.Text,
              value: '!',
            },
          ],
        }
      ],
    });
  });

  it('should work for an "Hello, ${name}!" example ', () => {
    const name = 'Oliver';
    const ast = xml`
      <div>Hello, ${name}!</div>
    `;

    expect(ast).to.deep.equal({
      kind: AstKind.Child,
      type: ChildType.Node,
      tag: 'div',
      attributes: [],
      children: [
        {
          kind: AstKind.Child,
          type: ChildType.Text,
          value: 'Hello, ',
        },
        {
          kind: AstKind.Child,
          type: ChildType.Data,
          value: name,
        },
        {
          kind: AstKind.Child,
          type: ChildType.Text,
          value: '!',
        },
      ],
    });
  });
});
