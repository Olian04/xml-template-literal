import type { AstAttribute, AstChild } from './types/AbstractSyntaxTree';
import type { ConsumeStream } from './types/ConsumeStream';
import type { SyntaxToken, Token } from './types/Token';

import { TokenKind } from './types/Token';
import { AttributeType, ChildType } from './types/AbstractSyntaxTree';
import { assert } from './util/assert';
import { createConsumeStream } from './util/createConsumeStream';

const nextToken = (
  tok: ConsumeStream<Token<unknown>>,
  shouldSkipWhitespace = true
) => {
  tok.next();
  if (shouldSkipWhitespace) {
    skipWhitespace(tok);
  }
};

const skipWhitespace = (tok: ConsumeStream<Token<unknown>>) => {
  while (tok.current.kind === TokenKind.Whitespace) {
    tok.next();
  }
};

const assertSyntax = (
  tok: ConsumeStream<Token<unknown>>,
  value: SyntaxToken['value']
) => {
  assert('value', value, tok.current);
  assert('kind', TokenKind.Syntax, tok.current);
};

const parseAttribute = <T>(tok: ConsumeStream<Token<T>>): AstAttribute<T> => {
  assert('kind', TokenKind.Text, tok.current);
  const key = tok.current.value as string;
  nextToken(tok);
  assertSyntax(tok, '=');
  nextToken(tok);
  if (tok.current.kind === TokenKind.Data) {
    return {
      kind: 'attribute',
      type: AttributeType.Data,
      key,
      value: tok.current.value,
    };
  }
  assertSyntax(tok, '"');
  nextToken(tok);
  let value = '';
  while (tok.current.value !== '"') {
    value += tok.current.value;
    nextToken(tok);
  }
  assertSyntax(tok, '"');
  return {
    kind: 'attribute',
    type: AttributeType.Text,
    key,
    value,
  };
};

const parseChildNode = <T>(tok: ConsumeStream<Token<T>>): AstChild<T> => {
  assertSyntax(tok, '<');
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
    assertSyntax(tok, '/>');
    nextToken(tok);
    return {
      kind: 'child',
      type: ChildType.Node,
      tag,
      attributes,
      children: [],
    };
  }
  assertSyntax(tok, '>');
  nextToken(tok);
  const children: AstChild<T>[] = [];
  while (tok.current.value !== '</') {
    children.push(parseChild(tok));
    nextToken(tok);
  }
  assertSyntax(tok, '</');
  nextToken(tok);
  assert('value', tag, tok.current);
  nextToken(tok);
  assertSyntax(tok, '>');
  return {
    kind: 'child',
    type: ChildType.Node,
    tag,
    attributes,
    children,
  };
};

const parseChild = <T>(tok: ConsumeStream<Token<T>>): AstChild<T> => {
  if (tok.current.kind === TokenKind.Data) {
    return {
      kind: 'child',
      type: ChildType.Data,
      value: tok.current.value,
    };
  }
  if (tok.current.kind === TokenKind.Text) {
    return {
      kind: 'child',
      type: ChildType.Text,
      value: tok.current.value,
    };
  }
  return parseChildNode(tok);
};

export const parseTokens = <T>(tokens: Generator<Token<T>>): AstChild<T> => {
  const tok = createConsumeStream(tokens);
  skipWhitespace(tok);
  return parseChild(tok);
};
