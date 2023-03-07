import { describe, it } from 'mocha';
import { expect } from 'chai';

import { mergeTemplateSegments } from '!util/mergeTemplateSegments';
import { tokenizer } from '!tokenizer';
import { createConsumeStream } from '!parser/util/createConsumeStream';
import { AstKind, ChildType } from '!types/AbstractSyntaxTree';
import { parseChildren } from '!parser/parseChildren';

export const t = <T>(
  staticSegments: TemplateStringsArray,
  ...dynamicSegments: T[]
) =>
  mergeTemplateSegments({
    dynamic: dynamicSegments,
    static: [...staticSegments],
  });

describe('parseChildren', () => {
  it('should correctly parse single text child', () => {
    const regular = parseChildren(
      createConsumeStream(tokenizer(t` foo `))
    );

    expect(regular).to.deep.equal([
      {
        kind: AstKind.Child,
        type: ChildType.Text,
        value: ' foo ',
      },
    ]);
  });

  it('should correctly parse single data child', () => {
    const A = { foo: 0 };
    const B = { foo: 1 };
    const C = { foo: 2 };
    const regular = parseChildren(
      createConsumeStream(tokenizer(t`${A}${B}${C}`))
    );

    expect(regular).to.deep.equal([
      {
        kind: AstKind.Child,
        type: ChildType.Data,
        value: A,
      },
      {
        kind: AstKind.Child,
        type: ChildType.Data,
        value: B,
      },
      {
        kind: AstKind.Child,
        type: ChildType.Data,
        value: C,
      },
    ]);
  });

  it('should correctly parse text and data children (pre)', () => {
    const A = { foo: 0 };
    const pre = parseChildren(
      createConsumeStream(tokenizer(t` pre ${A}`))
    );

    expect(pre).to.deep.equal([
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
    ]);
  });

  it('should correctly parse text and data children (post)', () => {
    const A = { foo: 0 };
    const post = parseChildren(
      createConsumeStream(tokenizer(t`${A} post `))
    );

    expect(post).to.deep.equal([
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
    ]);
  });

  it('should correctly parse single node child', () => {
    const regular = parseChildren(
      createConsumeStream(tokenizer(t`<h1></h1>`))
    );

    expect(regular).to.deep.equal([
      {
        kind: AstKind.Child,
        type: ChildType.Node,
        tag: 'h1',
        attributes: [],
        children: [],
      },
    ]);
  });

  it('should correctly parse multiple node children', () => {
    const regular = parseChildren(
      createConsumeStream(tokenizer(t`<h1></h1><h2></h2><h3></h3>`))
    );

    expect(regular).to.deep.equal([
      {
        kind: AstKind.Child,
        type: ChildType.Node,
        tag: 'h1',
        attributes: [],
        children: [],
      },
      {
        kind: AstKind.Child,
        type: ChildType.Node,
        tag: 'h2',
        attributes: [],
        children: [],
      },
      {
        kind: AstKind.Child,
        type: ChildType.Node,
        tag: 'h3',
        attributes: [],
        children: [],
      },
    ]);
  });
});
