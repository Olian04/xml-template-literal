import type { ConsumeStream } from '@/types/ConsumeStream';
import type { Token } from '@/types/Token';
import { skipWhitespace } from '@/parser/util/skipWhitespace';

export const nextToken = (
  tok: ConsumeStream<Token<unknown>>,
  shouldSkipWhitespace = true
) => {
  tok.next();
  if (shouldSkipWhitespace) {
    skipWhitespace(tok);
  }
};
