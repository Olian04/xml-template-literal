import type {
  AstAttribute,
  AstAttributeComposite,
  AstChild,
} from './types/AbstractSyntaxTree';
import type { ConsumeStream } from './types/ConsumeStream';
import type { Token } from './types/Token';

import { TokenKind } from './types/Token';
import { AstKind, AttributeType, ChildType } from './types/AbstractSyntaxTree';
import { assert } from './util/assert';
import { createConsumeStream } from './util/createConsumeStream';
import { assertSyntax } from './util/assertSyntax';

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

const parseAttribute = <T>(tok: ConsumeStream<Token<T>>): AstAttribute<T> => {
  assert('kind', TokenKind.Text, tok.current);
  const key = tok.current.value as string;
  nextToken(tok);
  assertSyntax('=', tok.current);
  nextToken(tok);
  if (tok.current.kind === TokenKind.Data) {
    return {
      kind: AstKind.Attribute,
      type: AttributeType.Data,
      key,
      value: tok.current.value,
    };
  }
  assertSyntax('"', tok.current);
  nextToken(tok);
  const parts: AstAttributeComposite<T>[] = [];
  let value = '';
  while (tok.current.value !== '"') {
    // @ts-ignore
    if (tok.current.kind === TokenKind.Data) {
      if (value.length > 0) {
        parts.push({
          kind: AstKind.Composite,
          type: AttributeType.Text,
          value: value,
        });
        value = '';
      }
      // @ts-ignore
      parts.push({
        kind: AstKind.Composite,
        type: AttributeType.Data,
        // @ts-ignore
        value: tok.current.value,
      });
    } else {
      value += tok.current.value;
    }
    nextToken(tok);
  }
  assertSyntax('"', tok.current);

  if (parts.length > 0) {
    parts.push({
      kind: AstKind.Composite,
      type: AttributeType.Text,
      value: value,
    });
    return {
      kind: AstKind.Attribute,
      type: AttributeType.Composite,
      key,
      value: parts,
    };
  }
  return {
    kind: AstKind.Attribute,
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

const parseChild = <T>(tok: ConsumeStream<Token<T>>): AstChild<T> => {
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

export const parseTokens = <T>(tokens: Generator<Token<T>>): AstChild<T> => {
  const tok = createConsumeStream(tokens);
  skipWhitespace(tok);
  return parseChild(tok);
};
