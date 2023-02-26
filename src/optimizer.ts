import { Token, TokenKind } from './types/Token';
import { createConsumeStream } from './util/createConsumeStream';

function* accumulateTextTokens<T>(
  tokens: Generator<Token<T>>,
  predicate: (token: Token<T>) => boolean
): Generator<Token<T>> {}

export function* optimizer<T>(
  original_tokens: Generator<Token<T>>
): Generator<Token<T>> {
  const tokens = createConsumeStream(original_tokens);
  while (!tokens.done) {
    const token = tokens.current();
  }
}
