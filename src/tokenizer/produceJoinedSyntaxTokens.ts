import type { StaticToken } from '@/types/Token';
import { TokenKind } from '@/types/Token';

export function* produceJoinedSyntaxTokens(
  tokens: Generator<StaticToken>
): Generator<StaticToken> {
  let tok: IteratorResult<StaticToken, any>;
  let curr_token: StaticToken | undefined = undefined;
  let prev_token: StaticToken | undefined = undefined;
  while (!(tok = tokens.next()).done) {
    prev_token = curr_token;
    curr_token = tok.value;

    if (
      prev_token?.kind === TokenKind.Syntax &&
      curr_token.kind === TokenKind.Syntax
    ) {
      if (prev_token.value === '<' && curr_token.value === '/') {
        yield {
          kind: TokenKind.Syntax,
          value: '</',
        };
        curr_token = undefined;
        continue;
      }

      if (prev_token.value === '/' && curr_token.value === '>') {
        yield {
          kind: TokenKind.Syntax,
          value: '/>',
        };
        curr_token = undefined;
        continue;
      }
    }

    if (prev_token) {
      yield prev_token;
    }
  }
  if (curr_token) {
    yield curr_token;
  }
}
