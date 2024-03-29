import { describe, it, expect } from 'vitest';

import { mergeTemplateSegments } from '../../src/util/mergeTemplateSegments';
import { tokenizer } from '../../src/tokenizer';
import { parseTokens } from '../../src/parser';
import { AttributeType, ChildType, AstKind, AstRoot } from '../../src/types/AbstractSyntaxTree';
import { UnexpectedEOF } from '../../src/errors/UnexpectedEOF';
import { UnexpectedToken } from '../../src/errors/UnexpectedToken';

const t = <T>(
  staticSegments: TemplateStringsArray,
  ...dynamicSegments: T[]
) =>
  mergeTemplateSegments({
    dynamic: dynamicSegments,
    static: [...staticSegments],
  });

const assertAst = <Ast extends AstRoot<unknown>>(testAst: Ast, expectedAst: Ast) => {
  expect(testAst).to.deep.equal(expectedAst);
}

describe('parser', () => {
  it('should return empty root when provided an empty input', () => {
    expect(parseTokens(tokenizer(t``))).to.deep.equal({
      kind: AstKind.Root,
      children: [],
    });
  });

  it('should throw when provided invalid syntax in input', () => {
    expect(() => {
      parseTokens(tokenizer(t`<div`));
    }).to.throw(UnexpectedEOF);

    expect(() => {
      parseTokens(tokenizer(t`<div<`));
    }).to.throw(UnexpectedToken);

    expect(() => {
      parseTokens(tokenizer(t`<div>`));
    }).to.throw(UnexpectedEOF);

    expect(() => {
      parseTokens(tokenizer(t`<div`));
    }).to.throw(UnexpectedEOF);
  });

  it('should join together dynamic and static parts in one AST', () => {
    const A = { foo: 0 };
    const ast = parseTokens(
      tokenizer(t`<someTag property="value" prop=${A}></someTag>`)
    );

    assertAst(ast, {
      kind: AstKind.Root,
      children: [
        {
          kind: AstKind.Child,
          type: ChildType.Node,
          tag: 'someTag',
          attributes: [
            {
              kind: AstKind.Attribute,
              type: AttributeType.Text,
              key: 'property',
              value: 'value',
            },
            {
              kind: AstKind.Attribute,
              type: AttributeType.Data,
              key: 'prop',
              value: A,
            },
          ],
          children: [],
        },
      ],
    });
  });

  it('should correctly parse tag with children', () => {
    const ast = parseTokens(tokenizer(t`<div><p> </p></div>`));

    assertAst(ast, {
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
              type: ChildType.Node,
              tag: 'p',
              attributes: [],
              children: [
                {
                  kind: AstKind.Child,
                  type: ChildType.Text,
                  value: ' ',
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('should correctly parse attribute-syntax tokens inside child body', () => {
    const A = 2;
    const B = 3;
    const C = A + B;
    const ast = parseTokens(tokenizer(t`<div>${A} + ${B} = ${C}</div>`));

    assertAst(ast, {
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
              type: ChildType.Data,
              value: A,
            },
            {
              kind: AstKind.Child,
              type: ChildType.Text,
              value: ' + ',
            },
            {
              kind: AstKind.Child,
              type: ChildType.Data,
              value: B,
            },
            {
              kind: AstKind.Child,
              type: ChildType.Text,
              value: ' = ',
            },
            {
              kind: AstKind.Child,
              type: ChildType.Data,
              value: C,
            }
          ],
        },
      ],
    });
  });

  it('should correctly parse composite property value', () => {
    const A = { foo: 0 };
    const ast = parseTokens(tokenizer(t`<div class="box ${A} lg" />`));

    assertAst(ast, {
      kind: AstKind.Root,
      children: [
        {
          kind: AstKind.Child,
          type: ChildType.Node,
          tag: 'div',
          attributes: [
            {
              kind: AstKind.Attribute,
              type: AttributeType.Composite,
              key: 'class',
              value: [
                {
                  kind: AstKind.Composite,
                  type: AttributeType.Text,
                  value: 'box ',
                },
                {
                  kind: AstKind.Composite,
                  type: AttributeType.Data,
                  value: A,
                },
                {
                  kind: AstKind.Composite,
                  type: AttributeType.Text,
                  value: ' lg',
                },
              ],
            },
          ],
          children: [],
        },
      ],
    });
  });
});
