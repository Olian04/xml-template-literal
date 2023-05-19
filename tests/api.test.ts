import { describe, it, expect } from 'vitest';

import { xml, AstKind, ChildType, AttributeType } from '../dist/api';

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
        },
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
        },
      ],
    });
  });

  it('should work for a minimal-complete-example', () => {
    const func = _ => _;
    const ast = xml`
      <div class="widget">
        <h1>Some Title</h1>
        <form>
          <input type="text" name="something" />
          <input type="submit" onclick=${func} />
        </form>
      </div>
    `;

    expect(ast).to.deep.equal({
      kind: AstKind.Root,
      children: [
        {
          kind: AstKind.Child,
          type: ChildType.Node,
          tag: 'div',
          attributes: [
            {
              kind: AstKind.Attribute,
              type: AttributeType.Text,
              key: 'class',
              value: 'widget',
            }
          ],
          children: [
            {
              kind: AstKind.Child,
              type: ChildType.Node,
              tag: 'h1',
              attributes: [],
              children: [
                {
                  kind: AstKind.Child,
                  type: ChildType.Text,
                  value: 'Some Title',
                }
              ],
            },
            {
              kind: AstKind.Child,
              type: ChildType.Node,
              tag: 'form',
              attributes: [],
              children: [
                {
                  kind: AstKind.Child,
                  type: ChildType.Node,
                  tag: 'input',
                  attributes: [
                    {
                      kind: AstKind.Attribute,
                      type: AttributeType.Text,
                      key: 'type',
                      value: 'text',
                    },
                    {
                      kind: AstKind.Attribute,
                      type: AttributeType.Text,
                      key: 'name',
                      value: 'something',
                    }
                  ],
                  children: [],
                },
                {
                  kind: AstKind.Child,
                  type: ChildType.Node,
                  tag: 'h1',
                  attributes: [
                    {
                      kind: AstKind.Attribute,
                      type: AttributeType.Text,
                      key: 'type',
                      value: 'submit',
                    },
                    {
                      kind: AstKind.Attribute,
                      type: AttributeType.Data,
                      key: 'onclick',
                      value: func,
                    }
                  ],
                  children: [],
                }
              ],
            }
          ],
        },
      ],
    });
  });
});
