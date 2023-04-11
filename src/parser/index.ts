import type { Token } from '../types/Token.js';
import { AstKind, AstRoot } from '../types/AbstractSyntaxTree.js';

import { createConsumeStream } from './util/createConsumeStream.js';
import { parseChildren } from './parseChildren.js';

export const parseTokens = <T>(tokens: Generator<Token<T>>): AstRoot<T> => ({
  kind: AstKind.Root,
  children: parseChildren(createConsumeStream(tokens)),
});
