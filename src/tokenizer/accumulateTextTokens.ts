import { TokenKind, type StaticToken } from '../types/Token.js';

export function* accumulateTextTokens(
  tokens: Generator<StaticToken>
): Generator<StaticToken> {
  let textAccumulator = '';
  for (const tok of tokens) {
    if (tok.kind !== TokenKind.Text) {
      if (textAccumulator) {
        yield {
          kind: TokenKind.Text,
          value: textAccumulator,
        };
        textAccumulator = '';
      }
      yield tok;
    } else {
      textAccumulator += tok.value;
    }
  }
  if (textAccumulator) {
    yield {
      kind: TokenKind.Text,
      value: textAccumulator,
    };
  }
}
