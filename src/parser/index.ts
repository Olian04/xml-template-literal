import type { AstChild } from '!types/AbstractSyntaxTree';
import type { Token } from '!types/Token';

import { createConsumeStream } from '!parser/util/createConsumeStream';
import { parseChild } from '!parser//parseChild';
import { skipWhitespace } from '!parser//util/skipWhitespace';

export const parseTokens = <T>(tokens: Generator<Token<T>>): AstChild<T> => {
  const tok = createConsumeStream(tokens);
  skipWhitespace(tok);
  return parseChild(tok);
};
