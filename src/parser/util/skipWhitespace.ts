import type { ConsumeStream } from '../../types/ConsumeStream.js';
import type { Token } from '../../types/Token.js';
import { TokenKind } from '../../types/Token.js';

export const skipWhitespace = (tok: ConsumeStream<Token<unknown>>) => {
  while (tok.current.kind === TokenKind.Whitespace) {
    tok.next();
  }
};
