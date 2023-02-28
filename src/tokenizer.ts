import { SegmentStream, SegmentType } from './types/SegmentStream';
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

function* produceJoinedTokens(
  tokens: Generator<SyntaxToken | TextToken>
): Generator<SyntaxToken | TextToken> {
  let tok: IteratorResult<SyntaxToken | TextToken, any>;
  let curr_token: SyntaxToken | TextToken | undefined = undefined;
  let prev_token: SyntaxToken | TextToken | undefined = undefined;
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

function* stripOutWhitespace(
  tokens: Generator<SyntaxToken | TextToken>
): Generator<SyntaxToken | TextToken> {
  for (const tok of tokens) {
    if (tok.value !== ' ') {
      yield tok;
    }
  }
}

function* includeSpacesInText(
  tokens: Generator<SyntaxToken | TextToken>
): Generator<SyntaxToken | TextToken> {
  let isInValue = false;
  let value = '';
  for (const tok of tokens) {
    if (tok.kind === TokenKind.Syntax && tok.value === '"') {
      isInValue = !isInValue;
      if (value.length > 0) {
        yield {
          kind: TokenKind.Text,
          value: value,
        };
        value = '';
      }
      yield tok;
    } else if (isInValue) {
      value += tok.value;
    } else {
      yield tok;
    }
  }
  if (value.length > 0) {
    yield {
      kind: TokenKind.Text,
      value: value,
    };
  }
}

export function* tokenizer<T>(segments: SegmentStream<T>): Generator<Token<T>> {
  for (const segment of segments) {
    if (segment.type === SegmentType.Static) {
      yield* produceJoinedTokens(
        stripOutWhitespace(
          accumulateTextTokens(
            includeSpacesInText(tokenizeString(segment.value))
          )
        )
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
