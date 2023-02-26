import { Token, SyntaxToken, TokenKind, TextToken } from './types/Token';

const isStaticSegment = (v: number) => v % 2 === 0;
const clamp = (upper: number, lower: number, value: number) =>
  value > upper ? upper : value < lower ? lower : value;

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

export function* tokenizer<T>(originalSegments: {
  static: string[];
  dynamic: T[];
}): Generator<Token<T>> {
  const segments = new Array(
    originalSegments.static.length + originalSegments.dynamic.length
  )
    .fill(0)
    .map((_, i) => {
      if (isStaticSegment(i)) {
        return {
          type: 'static' as const,
          value: originalSegments.static[Math.floor(i / 2)],
        };
      }
      return {
        type: 'dynamic' as const,
        value: originalSegments.dynamic[Math.floor(i / 2)],
      };
    });

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
