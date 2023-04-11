import { UnexpectedEOF } from '../../errors/UnexpectedEOF.js';
import { UnexpectedToken } from '../../errors/UnexpectedToken.js';
import { ConsumeStream } from '../../types/ConsumeStream.js';
import { Token, TokenKind } from '../../types/Token.js';

export const assert = (
  key: 'value' | 'kind',
  expected: any,
  tok: ConsumeStream<Token<unknown>>,
) => {
  if (tok.current.kind === TokenKind.EndOfFile) {
    throw new UnexpectedEOF(tok?.previous?.kind);
  }
  if (tok.current[key] !== expected)
    throw new UnexpectedToken(expected, String(tok.current[key]));
};
