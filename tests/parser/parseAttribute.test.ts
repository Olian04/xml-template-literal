import { describe, it, expect } from 'vitest';

import { mergeTemplateSegments } from '../../src/util/mergeTemplateSegments';
import { tokenizer } from '../../src/tokenizer';
import { parseAttribute } from '../../src/parser/parseAttribute';
import { createConsumeStream } from '../../src/parser/util/createConsumeStream';
import { AstKind, AttributeType } from '../../src/types/AbstractSyntaxTree';

export const t = <T>(
  staticSegments: TemplateStringsArray,
  ...dynamicSegments: T[]
) =>
  mergeTemplateSegments({
    dynamic: dynamicSegments,
    static: [...staticSegments],
  });

describe('parseAttribute', () => {
  it('should correctly parse text attribute', () => {
    const ast = parseAttribute(createConsumeStream(tokenizer(t`id="foo"`)));

    expect(ast).to.deep.equal({
      kind: AstKind.Attribute,
      type: AttributeType.Text,
      key: 'id',
      value: 'foo',
    });
  });

  it('should correctly parse data attribute', () => {
    const A = { foo: 0 };
    const ast = parseAttribute(createConsumeStream(tokenizer(t`id=${A}`)));

    expect(ast).to.deep.equal({
      kind: AstKind.Attribute,
      type: AttributeType.Data,
      key: 'id',
      value: A,
    });
  });

  it('should correctly parse composite attribute', () => {
    const A = { foo: 0 };
    const ast = parseAttribute(
      createConsumeStream(tokenizer(t`id="pre${A}post"`))
    );

    expect(ast).to.deep.equal({
      kind: AstKind.Attribute,
      type: AttributeType.Composite,
      key: 'id',
      value: [
        {
          kind: AstKind.Composite,
          type: AttributeType.Text,
          value: 'pre',
        },
        {
          kind: AstKind.Composite,
          type: AttributeType.Data,
          value: A,
        },
        {
          kind: AstKind.Composite,
          type: AttributeType.Text,
          value: 'post',
        },
      ],
    });
  });
});
