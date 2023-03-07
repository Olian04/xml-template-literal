import { describe, it } from 'mocha';
import { expect } from 'chai';

import { mergeTemplateSegments } from '!util/mergeTemplateSegments';
import { tokenizer } from '!tokenizer';
import { parseChild } from '!parser/parseChild';
import { createConsumeStream } from '!parser/util/createConsumeStream';
import { AstKind, ChildType } from '!types/AbstractSyntaxTree';

describe('parseChild', () => {
  it('should produce the same AST when parsing a regular tag and an equivalent self-closing tag', () => {
    const regular = parseChild(
      createConsumeStream(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [],
            static: ['<div></div>'],
          })
        )
      )
    );

    const selfClose = parseChild(
      createConsumeStream(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [],
            static: ['<div/>'],
          })
        )
      )
    );

    expect(regular).to.deep.equal(selfClose);
  });

  it('should correctly parse text child', () => {
    const regular = parseChild(
      createConsumeStream(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [],
            static: ['<div> foo </div>'],
          })
        )
      )
    );

    expect(regular).to.deep.equal({
      kind: AstKind.Child,
      type: ChildType.Node,
      tag: 'div',
      attributes: [],
      children: [
        {
          kind: AstKind.Child,
          type: ChildType.Text,
          value: ' foo ',
        },
      ],
    });
  });

  it('should correctly parse data child', () => {
    const A = { foo: 0 };
    const regular = parseChild(
      createConsumeStream(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [A],
            static: ['<div>', '</div>'],
          })
        )
      )
    );

    expect(regular).to.deep.equal({
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
      ],
    });
  });

  it('should correctly parse node child', () => {
    const A = { foo: 0 };
    const regular = parseChild(
      createConsumeStream(
        tokenizer(
          mergeTemplateSegments({
            dynamic: [],
            static: ['<div><h1></h1></div>'],
          })
        )
      )
    );

    expect(regular).to.deep.equal({
      kind: AstKind.Child,
      type: ChildType.Node,
      tag: 'div',
      attributes: [],
      children: [
        {
          kind: AstKind.Child,
          type: ChildType.Node,
          tag: 'h1',
          attributes: [],
          children: [],
        },
      ],
    });
  });
});
