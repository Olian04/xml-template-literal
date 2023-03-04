import type { ConsumeStream } from '@/types/ConsumeStream';
import type { Token } from '@/types/Token';
import { TokenKind } from '@/types/Token';

export const skipWhitespace = (tok: ConsumeStream<Token<unknown>>) => {
  while (tok.current.kind === TokenKind.Whitespace) {
    tok.next();
  }
};
