import type { AstAttribute } from './types/AstAttribute';
import type { AstChild } from './types/AstChild';
import type { AstRoot } from './types/AstRoot';
import type { Token } from './types/Token';

import { UnexpectedEOF } from './errors/UnexpectedEOF';
import { UnexpectedToken } from './errors/UnexpectedToken';

const buildAttribute = <T>(
  key: string,
  startIndex: number,
  tokens: Token<T>[]
): [AstAttribute<T>, number] => {
  const attribute: AstAttribute<T> = {
    key,
    value: [],
  };
  let i = startIndex + 1;
  if (i >= tokens.length) {
    throw new UnexpectedEOF();
  }
  let token = tokens[i];
  if (token.kind !== 'syntax' && token.value !== '=') {
    throw new UnexpectedToken(
      `Expected '=' but got '${token.value}' (${token.position.row}:${token.position.col})`
    );
  }
  i += 1;
  if (i >= tokens.length) {
    throw new UnexpectedEOF();
  }
  token = tokens[i];
  if (token.kind !== 'syntax' && token.value !== '"') {
    throw new UnexpectedToken(
      `Expected '"' but got '${token.value}' (${token.position.row}:${token.position.col})`
    );
  }
  for (; i < tokens.length; i++) {
    token = tokens[i];
    if (token.kind === 'syntax' && token.value === '"') {
      break;
    }
    attribute.value.push(token.value);
  }
  return [attribute, i - startIndex];
};

const buildChild = <T>(
  startIndex: number,
  tokens: Token<T>[]
): [AstChild<T>, number] => {
  let i = startIndex;
  if (i >= tokens.length) {
    throw new UnexpectedEOF();
  }
  let token = tokens[i];
  if (token.kind === 'dynamic') {
    return [
      {
        type: 'child',
        kind: 'value',
        value: token.value,
      },
      i - startIndex,
    ];
  } else if (token.kind === 'value') {
    return [
      {
        type: 'child',
        kind: 'text',
        value: token.value,
      },
      i - startIndex,
    ];
  }

  let attributes: AstAttribute<T>[] = [];
  let children: AstChild<T>[] = [];
  if (token.kind !== 'syntax' || token.value !== '<') {
    throw new UnexpectedToken(
      `Expected '<' but got '${token.value}' (${token.position.row}:${token.position.col})`
    );
  }
  i += 1;
  if (i >= tokens.length) {
    throw new UnexpectedEOF();
  }
  token = tokens[i];
  if (token.kind !== 'symbol') {
    throw new UnexpectedToken(
      `Expected a symbol but got '${token.value}' (${token.position.row}:${token.position.col})`
    );
  }
  const tag = token.value;
  for (; i < tokens.length; i++) {
    token = tokens[i];
    if (token.kind === 'syntax' && token.value === '>') {
      break;
    }
    if (token.kind === 'symbol') {
      const [attribute, consumed] = buildAttribute(token.value, i, tokens);
      i += consumed;
      attributes.push(attribute);
    }
  }
  for (; i < tokens.length; i++) {
    token = tokens[i];
    // TODO: This doesn't account for child elements.
    // Solution will need to peek at next element and determine if its the closing tag for the current element, or the opening tag for a child element.
    if (token.kind === 'syntax' && token.value === '<') {
      break;
    }
    const [child, consumed] = buildChild(i, tokens);
    i += consumed;
    children.push(child);
  }
  i += 1;
  if (i >= tokens.length) {
    throw new UnexpectedEOF();
  }
  token = tokens[i];
  if (token.kind !== 'syntax' || token.value !== '/') {
    throw new UnexpectedToken(
      `Expected '/' but got '${token.value}' (${token.position.row}:${token.position.col})`
    );
  }
  i += 1;
  if (i >= tokens.length) {
    throw new UnexpectedEOF();
  }
  token = tokens[i];
  if (token.kind !== 'symbol' || token.value !== tag) {
    throw new UnexpectedToken(
      `Mismatched closing tag, expected '${tag}' but got '${token.value}' (${token.position.row}:${token.position.col})`
    );
  }
  i += 1;
  if (i >= tokens.length) {
    throw new UnexpectedEOF();
  }
  token = tokens[i];
  if (token.kind !== 'syntax' || token.value !== '>') {
    throw new UnexpectedToken(
      `Expected '>' but got '${token.value}' (${token.position.row}:${token.position.col})`
    );
  }
  return [
    {
      type: 'child',
      kind: 'node',
      tag,
      attributes,
      children,
    },
    i - startIndex,
  ];
};

export const lexer = <T>(tokens: Token<T>[]): AstRoot<T> => {
  const children: AstChild<T>[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const [child, consumed] = buildChild(i, tokens);
    i += consumed;
    children.push(child);
  }
  return {
    type: 'root',
    children,
  };
};
