import { UnexpectedEOF } from '../../errors/UnexpectedEOF.js';
import { UnexpectedToken } from '../../errors/UnexpectedToken.js';
import { ConsumeStream } from '../../types/ConsumeStream.js';
import { SyntaxToken, Token, TokenKind } from '../../types/Token.js';

export const assertSyntax = (
  expected: SyntaxToken['value'],
  tok: ConsumeStream<Token<unknown>>,
) => {
  if (tok.current.kind === TokenKind.EndOfFile) {
    throw new UnexpectedEOF(tok?.previous?.kind);
  }
  if (tok.current.kind !== TokenKind.Syntax || tok.current.value !== expected) {
    throw new UnexpectedToken(expected, String(tok.current.value));
  }
};
