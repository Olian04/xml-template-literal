import type { Token } from '../types/Token';
import { UnexpectedEOF } from '../errors/UnexpectedEOF';

export const createConsumeStream = <V, T extends Token<V>>(
  gen: Generator<T>
) => {
  let cache: { next?: IteratorResult<T>; previous?: IteratorResult<T> } = {};

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
    get done() {
      return Boolean(next().done);
    },
    get current() {
      if (api.done) {
        if ('previous' in cache && 'next' in cache) {
          throw new UnexpectedEOF(`${cache.previous?.value?.value}`);
        } else if ('next' in cache) {
          throw new UnexpectedEOF(`${cache.next?.value?.value}`);
        } else {
          throw new UnexpectedEOF();
        }
      }
      return next().value as T;
    },
  };

  return api;
};
