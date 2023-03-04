import { describe, it } from 'mocha';
import { expect } from 'chai';

import { mergeTemplateSegments } from '../src/util/mergeTemplateSegments';
import { tokenizer } from '../src/tokenizer';
import { parseTokens } from '../src/parser';
import {
  AttributeType,
  ChildType,
  AstKind,
} from '../src/types/AbstractSyntaxTree';
import { UnexpectedEOF } from '../src/errors/UnexpectedEOF';
import { UnexpectedToken } from '../src/errors/UnexpectedToken';

describe('parser', () => {
  it('should throw when provided an empty input', () => {
    expect(() => {
      const ast = parseTokens(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [],
            static: [''],
          })
        )
      );
    }).to.throw(UnexpectedEOF);
  });

  it('should throw when provided invalid syntax in input', () => {
    expect(() => {
      const ast = parseTokens(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [],
            static: ['<div'],
          })
        )
      );
    }).to.throw(UnexpectedEOF);

    expect(() => {
      const ast = parseTokens(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [],
            static: ['<div<'],
          })
        )
      );
    }).to.throw(UnexpectedToken);

    expect(() => {
      const ast = parseTokens(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [],
            static: ['<div>'],
          })
        )
      );
    }).to.throw(UnexpectedEOF);

    expect(() => {
      const ast = parseTokens(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [],
            static: ['<div'],
          })
        )
      );
    }).to.throw(UnexpectedEOF);
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
    });
  });

  it('should correctly parse tag with children', () => {
    const ast = parseTokens(
      tokenizer(
        mergeTemplateSegments({
          dynamic: [],
          static: ['<div><p> </p></div>'],
        })
      )
    );

    expect(ast).to.deep.equal({
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
          children: [],
        },
      ],
    });
  });

  it('should correctly parse composite property value', () => {
    const A = { foo: 0 };

    const ast = parseTokens(
      tokenizer(
        mergeTemplateSegments({
          dynamic: [A],
          static: ['<div class="box ', ' lg" />'],
        })
      )
    );

    expect(ast).to.deep.equal({
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
    });
  });
});
