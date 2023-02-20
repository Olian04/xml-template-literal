import type { AstAttribute } from './types/AstAttribute';
import type { AstChild } from './types/AstChild';
import type { AstRoot } from './types/AstRoot';
import type { Token } from './types/Token';

import { UnexpectedEOF } from './errors/UnexpectedEOF';
import { UnexpectedToken } from './errors/UnexpectedToken';

const buildAttribute = <T>(
  key: string,
  tokenizer: Generator<Token<T>, null, unknown>
): AstAttribute<T> => {
  const attribute: AstAttribute<T> = {
    key,
    value: [],
  };
  let token: IteratorResult<Token<T>> = tokenizer.next();
  token = tokenizer.next();
  if (token.done) {
    throw new UnexpectedEOF();
  }
  if (token.value.kind !== 'syntax' && token.value.value !== '=') {
    throw new UnexpectedToken(`Expected '=' but got '${token.value.value}'`);
  }
  token = tokenizer.next();
  if (token.done) {
    throw new UnexpectedEOF();
  }
  if (token.value.kind !== 'syntax' && token.value.value !== '"') {
    throw new UnexpectedToken(`Expected '"' but got '${token.value.value}'`);
  }
  while (!(token = tokenizer.next()).done) {
    if (token.value.kind === 'syntax' && token.value.value === '"') {
      break;
    }
    attribute.value.push(token.value.value);
  }
  return attribute;
};

const buildChild = <T>(
  tokenizer: Generator<Token<T>, null, unknown>
): AstChild<T> => {
  let token: IteratorResult<Token<T>> = tokenizer.next();
  if (token.done) {
    throw new UnexpectedEOF();
  }
  if (token.value.kind === 'value' || token.value.kind === 'dynamic') {
    return {
      type: 'child',
      value: token.value.value,
    };
  }

  let attributes: AstAttribute<T>[] = [];
  let children: AstChild<T>[] = [];
  if (token.value.kind !== 'syntax' || token.value.value !== '<') {
    throw new UnexpectedToken(`Expected '<' but got '${token.value.value}'`);
  }
  token = tokenizer.next();
  if (token.done) {
    throw new UnexpectedEOF();
  }
  if (token.value.kind !== 'symbol') {
    throw new UnexpectedToken(
      `Expected a symbol but got '${token.value.value}'`
    );
  }
  const tag = token.value.value;
  while (!(token = tokenizer.next()).done) {
    if (token.value.kind === 'syntax' && token.value.value === '>') {
      break;
    }
    if (token.value.kind === 'symbol') {
      attributes.push(buildAttribute(token.value.value, tokenizer));
    }
  }
  while (!(token = tokenizer.next()).done) {
    if (token.value.kind === 'syntax' && token.value.value === '<') {
      break;
    }
    children.push(buildChild(tokenizer));
  }
  token = tokenizer.next();
  if (token.done) {
    throw new UnexpectedEOF();
  }
  if (token.value.kind !== 'syntax' || token.value.value !== '/') {
    throw new UnexpectedToken(`Expected '/' but got '${token.value.value}'`);
  }
  token = tokenizer.next();
  if (token.done) {
    throw new UnexpectedEOF();
  }
  if (token.value.kind !== 'symbol' || token.value.value !== tag) {
    throw new UnexpectedToken(
      `Missmatched closing tag, expected '${tag}' but got '${token.value.value}'`
    );
  }
  token = tokenizer.next();
  if (token.done) {
    throw new UnexpectedEOF();
  }
  if (token.value.kind !== 'syntax' || token.value.value !== '>') {
    throw new UnexpectedToken(`Expected '>' but got '${token.value.value}'`);
  }
  return {
    type: 'child',
    tag,
    attributes,
    children,
  };
};

function peek<G>(
  iterator: Generator<G, null, unknown>
): [IteratorResult<G, null>, Generator<G, null, unknown>] {
  let peeked = iterator.next();
  let rebuiltIterator = function* () {
    if (peeked.done) return null;
    yield peeked.value;
    yield* iterator;
    return null;
  };
  return [peeked, rebuiltIterator()];
}

export const lexer = <T>(
  tokenizer: Generator<Token<T>, null, unknown>
): AstRoot<T> => {
  let children: AstChild<T>[] = [];
  while (true) {
    const [peeked, newTokenize] = peek(tokenizer);
    if (peeked.done) {
      break;
    }
    children.push(buildChild(newTokenize));
  }
  return {
    type: 'root',
    children,
  };
};
