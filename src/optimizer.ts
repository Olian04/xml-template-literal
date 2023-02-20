import type { Token } from './types/Token';

function* optimizeAttributeValue<T>(
  tokenizer: Generator<Token<T>, null, unknown>
): Generator<Token<T>, null, unknown> {
  let valuePos: { col: number; row: number } = { col: NaN, row: NaN };
  let valueAggregator = '';
  let token: IteratorResult<Token<T>, any>;
  while (!(token = tokenizer.next()).done) {
    if (isNaN(valuePos.col)) {
      valuePos = token.value.position;
    }

    if (token.value.kind === 'symbol') {
      valueAggregator += token.value.value;
    } else if (token.value.kind === 'syntax' && token.value.value !== '"') {
      valueAggregator += token.value.value;
    } else if (token.value.kind === 'dynamic') {
      if (valueAggregator.length > 0) {
        yield {
          kind: 'value',
          value: valueAggregator,
          position: valuePos,
        };
      }
      valueAggregator = '';
      valuePos = { col: NaN, row: NaN };
      yield token.value;
    } else if (token.value.kind === 'syntax' && token.value.value === '"') {
      if (valueAggregator.length > 0) {
        yield {
          kind: 'value',
          value: valueAggregator,
          position: valuePos,
        };
      }
      yield token.value;
      break;
    }
  }
  return null;
}

function* optimizeTagDefinition<T>(
  tokenizer: Generator<Token<T>, null, unknown>
): Generator<Token<T>, null, unknown> {
  let token: IteratorResult<Token<T>>;
  while (!(token = tokenizer.next()).done) {
    if (token.value.kind === 'syntax' && token.value.value === '"') {
      yield token.value;
      yield* optimizeAttributeValue(tokenizer);
    } else if (token.value.kind === 'syntax' && token.value.value === '>') {
      yield token.value;
      break;
    } else {
      yield token.value;
    }
  }
  return null;
}

export function* optimizer<T>(
  tokenizer: Generator<Token<T>, null, unknown>
): Generator<Token<T>, null, unknown> {
  let valuePos: { col: number; row: number } = { col: NaN, row: NaN };
  let valueAggregator = '';
  let token: IteratorResult<Token<T>>;
  while (!(token = tokenizer.next()).done) {
    if (isNaN(valuePos.col)) {
      valuePos = token.value.position;
    }

    if (token.value.kind === 'syntax' && token.value.value === '<') {
      if (valueAggregator.length > 0) {
        yield {
          kind: 'value',
          value: valueAggregator,
          position: valuePos,
        };
      }
      valueAggregator = '';
      valuePos = { col: NaN, row: NaN };

      yield token.value;
      yield* optimizeTagDefinition(tokenizer);
    } else if (token.value.kind === 'dynamic') {
      if (valueAggregator.length > 0) {
        yield {
          kind: 'value',
          value: valueAggregator,
          position: valuePos,
        };
      }
      valueAggregator = '';
      valuePos = { col: NaN, row: NaN };

      yield token.value;
    } else if (token.value.kind === 'symbol') {
      valueAggregator += token.value.value;
    } else if (token.value.kind === 'syntax') {
      valueAggregator += token.value.value;
    }
  }
  return null;
}
