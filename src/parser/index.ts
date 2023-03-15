import { AstKind, AstRoot } from '!types/AbstractSyntaxTree';
import type { Token } from '!types/Token';

import { createConsumeStream } from '!parser/util/createConsumeStream';
import { parseChildren } from '!parser/parseChildren';

export const parseTokens = <T>(tokens: Generator<Token<T>>): AstRoot<T> => ({
  kind: AstKind.Root,
  children: parseChildren(createConsumeStream(tokens)),
});
