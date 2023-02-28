import { assertSyntax } from './util/assertSyntax';
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

const nextToken = (tok: ConsumeStream<Token<unknown>>) => {
  tok.next();
};

const parseAttribute = <T>(tok: ConsumeStream<Token<T>>): AstAttribute<T> => {
  assert('kind', TokenKind.Text, tok.current);
  const key = tok.current.value as string;
  nextToken(tok);
  assertSyntax('=', tok.current);
  nextToken(tok);
  if (tok.current.kind === TokenKind.Data) {
    return {
      kind: 'attribute',
      type: AttributeType.Data,
      key,
      value: tok.current.value,
    };
  }
  assertSyntax('"', tok.current);
  nextToken(tok);
  let value = '';
  while (tok.current.value !== '"') {
    value += tok.current.value;
    nextToken(tok);
  }
  assertSyntax('"', tok.current);
  return {
    kind: 'attribute',
    type: AttributeType.Text,
    key,
    value,
  };
};

const parseChildNode = <T>(tok: ConsumeStream<Token<T>>): AstChild<T> => {
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
      kind: 'child',
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
  return parseChild(createConsumeStream(tokens));
};
