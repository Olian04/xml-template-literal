import type { StaticToken } from '@/types/Token';
import { TokenKind } from '@/types/Token';

export function* tokenizeString(input: string): Generator<StaticToken> {
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
