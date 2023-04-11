import type { ConsumeStream } from '../types/ConsumeStream.js';
import { AstKind, ChildType, type AstChild } from '../types/AbstractSyntaxTree.js';
import { TokenKind, type Token } from '../types/Token.js';

import { assert } from './util/assert.js';
import { assertSyntax } from './util/assertSyntax.js';
import { nextToken } from './util/nextToken.js';
import { parseChildren } from './parseChildren.js';
import { parseAttributes } from './parseAttributes.js';

const parseTag = <T>(
  tok: ConsumeStream<Token<T>>,
): string => {
  assert('kind', TokenKind.Text, tok);
  const tag = tok.current.value as string;
  nextToken(tok);
  return tag;
}

export const parseNodeChild = <T>(
  tok: ConsumeStream<Token<T>>
): AstChild<T> => {
  assertSyntax('<', tok);
  nextToken(tok);
  const tag = parseTag(tok);
  const attributes = parseAttributes(tok);
  if (tok.current.value === '/>') {
    assertSyntax('/>', tok);
    return {
      kind: AstKind.Child,
      type: ChildType.Node,
      tag,
      attributes,
      children: [],
    };
  }
  assertSyntax('>', tok);
  nextToken(tok, false);
  const children = parseChildren(tok);
  assertSyntax('</', tok);
  nextToken(tok);
  assert('value', tag, tok);
  nextToken(tok);
  assertSyntax('>', tok);
  return {
    kind: AstKind.Child,
    type: ChildType.Node,
    tag,
    attributes,
    children,
  };
};

export const parseTextChild = <T>(
  tok: ConsumeStream<Token<T>>
): AstChild<T> => {
  let value = '';
  while (
    tok.current.kind === TokenKind.Text ||
    tok.current.kind === TokenKind.Whitespace
  ) {
    value += tok.current.value;
    nextToken(tok, false);
  }

  return {
    kind: AstKind.Child,
    type: ChildType.Text,
    value,
  };
};

export const parseChild = <T>(
  tok: ConsumeStream<Token<T>>
): AstChild<T> => {
  if (tok.current.kind === TokenKind.Data) {
    const value = tok.current.value;
    nextToken(tok, false);
    return {
      kind: AstKind.Child,
      type: ChildType.Data,
      value,
    };
  }
  if (
    tok.current.kind === TokenKind.Text ||
    tok.current.kind === TokenKind.Whitespace
  ) {
    return parseTextChild(tok);
  }
  if (
    tok.current.kind === TokenKind.Syntax &&
    tok.current.value === '<'
  ) {
    const node = parseNodeChild(tok);
    nextToken(tok, false);
    return node;
  }
  throw new Error(`UnexpectedToken: Expected either "<", a Data token, a Text token, or a Whitespace token. But got ${tok.current.kind} token with value "${tok.current.value}"`)
};
