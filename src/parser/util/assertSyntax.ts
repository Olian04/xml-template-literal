import { UnexpectedToken } from '!errors/UnexpectedToken';
import { SyntaxToken, Token, TokenKind } from '!types/Token';

export const assertSyntax = (
  expected: SyntaxToken['value'],
  token: Token<unknown>
) => {
  if (token.kind !== TokenKind.Syntax || token.value !== expected) {
    throw new UnexpectedToken(expected, String(token.value));
  }
};
