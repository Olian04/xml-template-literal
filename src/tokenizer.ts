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
      case '\n':
      case '\t':
      case '\r':
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

function* accumulateWhitespaceTokens(
  tokens: Generator<SyntaxToken | TextToken>
): Generator<SyntaxToken | TextToken> {
  let whitespaceAccumulator = '';
  for (const tok of tokens) {
    if (tok.kind === TokenKind.Syntax && tok.value === ' ') {
      whitespaceAccumulator += tok.value;
    } else {
      if (whitespaceAccumulator.length > 0) {
        yield {
          kind: TokenKind.Syntax,
          value: ' ',
        };
        whitespaceAccumulator = '';
      }
      yield tok;
    }
  }
  if (whitespaceAccumulator.length > 0) {
    yield {
      kind: TokenKind.Syntax,
      value: ' ',
    };
    whitespaceAccumulator = '';
  }
}

function* filter(
  predicate: (tok: SyntaxToken | TextToken) => boolean,
  tokens: Generator<SyntaxToken | TextToken>
): Generator<SyntaxToken | TextToken> {
  for (const tok of tokens) {
    if (predicate(tok)) {
      yield tok;
    }
  }
}

export function* tokenizer<T>(segments: SegmentStream<T>): Generator<Token<T>> {
  for (const segment of segments) {
    if (segment.type === 'static') {
      yield* filter(
        (tok) => tok.value !== ' ',
        accumulateTextTokens(
          accumulateWhitespaceTokens(tokenizeString(segment.value))
        )
      );
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
