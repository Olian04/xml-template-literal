import type { AstAttribute, AstChild } from '!types/AbstractSyntaxTree';
import type { ConsumeStream } from '!types/ConsumeStream';
import type { Token } from '!types/Token';
import { TokenKind } from '!types/Token';
import { AstKind, ChildType } from '!types/AbstractSyntaxTree';

import { assert } from '!parser/util/assert';
import { assertSyntax } from '!parser/util/assertSyntax';
import { nextToken } from '!parser/util/nextToken';
import { parseAttribute } from '!parser//parseAttribute';

export const parseNodeChild = <T>(
  tok: ConsumeStream<Token<T>>
): AstChild<T> => {
  assertSyntax('<', tok.current);
  nextToken(tok);
  assert('kind', TokenKind.Text, tok.current);
  const tag = tok.current.value as string;
  nextToken(tok);
  const attributes: AstAttribute<T>[] = [];
  while (tok.current.kind === TokenKind.Text) {
    attributes.push(parseAttribute(tok));
    nextToken(tok);
  }
  if (tok.current.value === '/>') {
    assertSyntax('/>', tok.current);
    return {
      kind: AstKind.Child,
      type: ChildType.Node,
      tag,
      attributes,
      children: [],
    };
  }
  assertSyntax('>', tok.current);
  nextToken(tok, false);
  const children: AstChild<T>[] = [];
  while (tok.current.value !== '</') {
    children.push(parseChild(tok));
    if (tok.current.value === '</') {
      break;
    }
    nextToken(tok, false);
  }
  assertSyntax('</', tok.current);
  nextToken(tok);
  assert('value', tag, tok.current);
  nextToken(tok);
  assertSyntax('>', tok.current);
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

export const parseChild = <T>(tok: ConsumeStream<Token<T>>): AstChild<T> => {
  if (tok.current.kind === TokenKind.Data) {
    return {
      kind: AstKind.Child,
      type: ChildType.Data,
      value: tok.current.value,
    };
  }
  if (
    tok.current.kind === TokenKind.Text ||
    tok.current.kind === TokenKind.Whitespace
  ) {
    return parseTextChild(tok);
  }
  return parseNodeChild(tok);
};
