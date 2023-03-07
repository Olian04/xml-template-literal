import { UnexpectedEOF } from '!errors/UnexpectedEOF';
import { UnexpectedToken } from '!errors/UnexpectedToken';
import { ConsumeStream } from '!types/ConsumeStream';
import { Token, TokenKind } from '!types/Token';

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
