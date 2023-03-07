import type { AstChild } from '!types/AbstractSyntaxTree';
import type { ConsumeStream } from '!types/ConsumeStream';
import type { Token } from '!types/Token';
import { TokenKind } from '!types/Token';
import { AstKind, ChildType } from '!types/AbstractSyntaxTree';

import { assert } from '!parser/util/assert';
import { assertSyntax } from '!parser/util/assertSyntax';
import { nextToken } from '!parser/util/nextToken';
import { parseChildren } from '!parser/parseChildren';
import { parseAttributes } from '!parser/parseAttributes';
import { UnexpectedToken } from '!errors/UnexpectedToken';

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
  nextToken(tok);
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
    return parseNodeChild(tok);
  }
  throw new Error(`UnexpectedToken: Expected either "<", a Data token, a Text token, or a Whitespace token. But got ${tok.current.kind} token with value "${tok.current.value}"`)
};
