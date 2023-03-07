import { describe, it } from 'mocha';
import { expect } from 'chai';

import { mergeTemplateSegments } from '!util/mergeTemplateSegments';
import { tokenizer } from '!tokenizer';
import { parseChild } from '!parser/parseChild';
import { createConsumeStream } from '!parser/util/createConsumeStream';
import { AstKind, ChildType } from '!types/AbstractSyntaxTree';

export const t = <T>(
  staticSegments: TemplateStringsArray,
  ...dynamicSegments: T[]
) =>
  mergeTemplateSegments({
    dynamic: dynamicSegments,
    static: [...staticSegments],
  });

describe('parseChild', () => {
  it('should produce the same AST when parsing a regular tag and an equivalent self-closing tag', () => {
    const regular = parseChild(createConsumeStream(tokenizer(t`<div></div>`)));

    const selfClose = parseChild(createConsumeStream(tokenizer(t`<div/>`)));

    expect(regular).to.deep.equal(selfClose);
  });

  it('should correctly parse text child', () => {
    const regular = parseChild(
      createConsumeStream(tokenizer(t`<div> foo </div>`))
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
      createConsumeStream(tokenizer(t`<div>${A}</div>`))
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

  it('should correctly parse text and data children (pre)', () => {
    const A = { foo: 0 };
    const pre = parseChild(
      createConsumeStream(tokenizer(t`<div> pre ${A}</div>`))
    );

    expect(pre).to.deep.equal({
      kind: AstKind.Child,
      type: ChildType.Node,
      tag: 'div',
      attributes: [],
      children: [
        {
          kind: AstKind.Child,
          type: ChildType.Text,
          value: ' pre ',
        },
        {
          kind: AstKind.Child,
          type: ChildType.Data,
          value: A,
        },
      ],
    });
  });

  it('should correctly parse text and data children (post)', () => {
    const A = { foo: 0 };
    const post = parseChild(
      createConsumeStream(tokenizer(t`<div>${A} post </div>`))
    );

    expect(post).to.deep.equal({
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
          value: ' post ',
        },
      ],
    });
  });

  it('should correctly parse node child', () => {
    const regular = parseChild(
      createConsumeStream(tokenizer(t`<div><h1></h1></div>`))
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
