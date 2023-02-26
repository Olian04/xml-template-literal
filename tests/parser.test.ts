import { describe, it } from 'mocha';
import { expect } from 'chai';

import { mergeTemplateSegments } from '../src/util/mergeTemplateSegments';
import { tokenizer } from '../src/tokenizer';
import { parseTokens } from '../src/parser';
import { AttributeType, ChildType } from '../src/types/AbstractSyntaxTree';

describe('parser', () => {
  it('should return an AST', () => {
    const ast = parseTokens(
      tokenizer(
        mergeTemplateSegments({
          dynamic: [],
          static: [''],
        })
      )
    );
    expect(ast).to.deep.equal({
      kind: 'child',
      type: ChildType.Node,
      children: [],
      attributes: [],
    });
  });

  it('should join together dynamic and static parts in one AST', () => {
    const A = { foo: 0 };
    const ast = parseTokens(
      tokenizer(
        mergeTemplateSegments({
          dynamic: [A],
          static: ['<someTag property="value" prop=', '></someTag>'],
        })
      )
    );
    expect(ast).to.deep.equal({
      kind: 'child',
      type: ChildType.Node,
      attributes: [
        {
          kind: 'attribute',
          type: AttributeType.Text,
          key: 'property',
          value: 'value',
        },
        {
          kind: 'attribute',
          type: AttributeType.Data,
          key: 'prop',
          value: A,
        },
      ],
      children: [],
    });
  });
});
