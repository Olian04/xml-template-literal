import {
  AstAttribute,
  AstChild,
  AttributeType,
  ChildType,
} from './types/AbstractSyntaxTree';
import { ConsumeStream } from './types/ConsumeStream';
import { Token, TokenKind } from './types/Token';
import { assert } from './util/assert';

import { createConsumeStream } from './util/createConsumeStream';

const nextToken = (
  tok: ConsumeStream<Token<unknown>>,
  skipWhitespace = true
) => {
  tok.next();
  if (
    skipWhitespace &&
    tok.current.kind === TokenKind.Syntax &&
    tok.current.value === ' '
  ) {
    tok.next();
  }
};

const parseAttribute = <T>(tok: ConsumeStream<Token<T>>): AstAttribute<T> => {
  assert(TokenKind.Text, tok.current.kind);
  const key = tok.current.value as string;
  nextToken(tok);
  assert(TokenKind.Syntax, tok.current.kind);
  assert('=', tok.current.value);
  nextToken(tok);
  if (tok.current.kind === TokenKind.Data) {
    return {
      kind: 'attribute',
      type: AttributeType.Data,
      key,
      value: tok.current.value,
    };
  }
  assert(TokenKind.Syntax, tok.current.kind);
  assert('"', tok.current.value);
  nextToken(tok);
  let value = '';
  while (tok.current.value !== '"') {
    value += tok.current.value;
    nextToken(tok);
  }
  assert(TokenKind.Syntax, tok.current.kind);
  assert('"', tok.current.value);
  return {
    kind: 'attribute',
    type: AttributeType.Text,
    key,
    value,
  };
};

const parseChildNode = <T>(tok: ConsumeStream<Token<T>>): AstChild<T> => {
  assert(TokenKind.Syntax, tok.current.kind);
  assert('<', tok.current.value);
  nextToken(tok);
  assert(TokenKind.Text, tok.current.kind);
  const tag = tok.current.value;
  nextToken(tok);
  const attributes: AstAttribute<T>[] = [];
  while (tok.current.kind === TokenKind.Text) {
    attributes.push(parseAttribute(tok));
    nextToken(tok);
  }
  assert(TokenKind.Syntax, tok.current.kind);
  if (tok.current.value === '/') {
    nextToken(tok);
    assert('>', tok.current.value);
    return {
      kind: 'child',
      type: ChildType.Node,
      attributes,
      children: [],
    };
  }
  assert('>', tok.current.value);
  nextToken(tok);
  const children: AstChild<T>[] = [];
  while (tok.current.value !== '<') {
    children.push(parseChild(tok));
    nextToken(tok);
  }
  assert(TokenKind.Syntax, tok.current.kind);
  assert('<', tok.current.value);
  nextToken(tok);
  assert(TokenKind.Syntax, tok.current.kind);
  assert('/', tok.current.value);
  nextToken(tok);
  assert(TokenKind.Text, tok.current.kind);
  assert(tag, tok.current.value);
  nextToken(tok);
  assert(TokenKind.Syntax, tok.current.kind);
  assert('>', tok.current.value);
  return {
    kind: 'child',
    type: ChildType.Node,
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
  return parseChild(createConsumeStream(tokens));
};
