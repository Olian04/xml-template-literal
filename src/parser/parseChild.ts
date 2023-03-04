import type { AstAttribute, AstChild } from '@/types/AbstractSyntaxTree';
import type { ConsumeStream } from '@/types/ConsumeStream';
import type { Token } from '@/types/Token';
import { TokenKind } from '@/types/Token';
import { AstKind, ChildType } from '@/types/AbstractSyntaxTree';

import { assert } from '@/parser/util/assert';
import { assertSyntax } from '@/parser/util/assertSyntax';
import { nextToken } from '@/parser/util/nextToken';
import { parseAttribute } from '@/parser//parseAttribute';

export const parseChildNode = <T>(
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
    nextToken(tok);
    return {
      kind: AstKind.Child,
      type: ChildType.Node,
      tag,
      attributes,
      children: [],
    };
  }
  assertSyntax('>', tok.current);
  nextToken(tok);
  const children: AstChild<T>[] = [];
  while (tok.current.value !== '</') {
    children.push(parseChild(tok));
    nextToken(tok);
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

export const parseChild = <T>(tok: ConsumeStream<Token<T>>): AstChild<T> => {
  if (tok.current.kind === TokenKind.Data) {
    return {
      kind: AstKind.Child,
      type: ChildType.Data,
      value: tok.current.value,
    };
  }
  if (tok.current.kind === TokenKind.Text) {
    return {
      kind: AstKind.Child,
      type: ChildType.Text,
      value: tok.current.value,
    };
  }
  return parseChildNode(tok);
};
