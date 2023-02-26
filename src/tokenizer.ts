import { SegmentStream } from './types/SegmentStream';
import { Token, SyntaxToken, TokenKind, TextToken } from './types/Token';

function* tokenizeString(input: string): Generator<SyntaxToken | TextToken> {
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
      case ' ':
        yield {
          kind: TokenKind.Syntax,
          value: ' ',
        };
        break;
      case '\n':
        // Ignore newline
        // TODO: Account for this in error handling
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
  tokens: Generator<SyntaxToken | TextToken>
): Generator<SyntaxToken | TextToken> {
  let textAccumulator = '';
  for (const tok of tokens) {
    if (tok.kind === TokenKind.Syntax) {
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

export function* tokenizer<T>(segments: SegmentStream<T>): Generator<Token<T>> {
  for (const segment of segments) {
    if (segment.type === 'static') {
      yield* accumulateTextTokens(tokenizeString(segment.value));
    } else if (segment.type === 'dynamic') {
      yield {
        kind: TokenKind.Data,
        value: segment.value,
      };
    } else {
      throw new Error(`Unknown segment: ${segment}`);
    }
  }
}
