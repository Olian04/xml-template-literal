import { EndOfFileToken, Token, TokenKind } from '../../types/Token.js';
import { ConsumeStream } from '../../types/ConsumeStream.js';

export const createConsumeStream = <T>(
  gen: Generator<Token<T>>
): ConsumeStream<Token<T>> => {
  let cache: { next?: IteratorResult<Token<T>>; previous?: IteratorResult<Token<T>> } = {};

  const next = () => {
    if (!('next' in cache)) {
      cache.next = gen.next();
    }
    return cache.next as IteratorResult<T>;
  };
  const api = {
    next: () => {
      cache.previous = cache.next;
      delete cache.next;
      next();
    },
    get previous() {
      return cache.previous?.value as Token<T>;
    },
    get done() {
      return Boolean(next().done);
    },
    get current() {
      if (api.done) {
        return {
          kind: TokenKind.EndOfFile,
          value: null,
        } as EndOfFileToken;
      }
      return next().value as Token<T>;
    },
  };

  return api;
};
