import { SegmentStream } from './types/SegmentStream';
import { Token, TokenKind, StaticToken } from './types/Token';

function* tokenizeString(input: string): Generator<StaticToken> {
  for (const char of input) {
    switch (char) {
      case '<':
        yield {
          kind: TokenKind.Syntax,
          value: '<',
        };
        break;
      case '>':
        yield {
          kind: TokenKind.Syntax,
          value: '>',
        };
        break;
      case '/':
        yield {
          kind: TokenKind.Syntax,
          value: '/',
        };
        break;
      case '=':
        yield {
          kind: TokenKind.Syntax,
          value: '=',
        };
        break;
      case '"':
        yield {
          kind: TokenKind.Syntax,
          value: '"',
        };
        break;
      case '\n':
        yield {
          kind: TokenKind.Whitespace,
          value: '\n',
        };
        break;
      case '\r':
        yield {
          kind: TokenKind.Whitespace,
          value: '\r',
        };
        break;
      case '\t':
        yield {
          kind: TokenKind.Whitespace,
          value: '\t',
        };
        break;
      case ' ':
        yield {
          kind: TokenKind.Whitespace,
          value: ' ',
        };
        break;
      default:
        yield {
          kind: TokenKind.Text,
          value: char,
        };
        break;
    }
  }
}

function* accumulateTextTokens(
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

function* produceJoinedTokens(
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

export function* tokenizer<T>(segments: SegmentStream<T>): Generator<Token<T>> {
  for (const segment of segments) {
    if (segment.type === SegmentType.Static) {
      yield* produceJoinedTokens(
        accumulateTextTokens(tokenizeString(segment.value))
      );
    } else if (segment.type === SegmentType.Dynamic) {
      yield {
        kind: TokenKind.Data,
        value: segment.value,
      };
    } else {
      throw new Error(`Unknown segment: ${segment}`);
    }
  }
}
