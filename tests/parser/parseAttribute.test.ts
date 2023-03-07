import { describe, it } from 'mocha';
import { expect } from 'chai';

import { mergeTemplateSegments } from '!util/mergeTemplateSegments';
import { tokenizer } from '!tokenizer';
import { parseAttribute } from '!parser/parseAttribute';
import { createConsumeStream } from '!parser/util/createConsumeStream';
import { AstKind, AttributeType } from '!types/AbstractSyntaxTree';

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
