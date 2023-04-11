import type { ConsumeStream } from '../../types/ConsumeStream.js';
import type { Token } from '../../types/Token.js';
import { skipWhitespace } from '../../parser/util/skipWhitespace.js';

export const nextToken = (
  tok: ConsumeStream<Token<unknown>>,
  shouldSkipWhitespace = true
) => {
  tok.next();
  if (shouldSkipWhitespace) {
    skipWhitespace(tok);
  }
};
