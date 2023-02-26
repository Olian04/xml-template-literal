export const createConsumeStream = <T>(gen: Generator<T>) => {
  let cache: { next?: IteratorResult<T> } = {};

  const next = () => {
    if (!('next' in cache)) {
      cache.next = gen.next();
    }
    return cache.next as IteratorResult<T>;
  };
  const api = {
    done: () => Boolean(next().done),
    consumeOne: () => {
      cache.next = gen.next();
    },
    current: () => next().value as T,
  };

  return api;
};
