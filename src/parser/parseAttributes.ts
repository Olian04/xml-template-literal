import type { AstAttribute } from '../types/AbstractSyntaxTree.js';
import type { ConsumeStream } from '../types/ConsumeStream.js';
import { TokenKind, type Token } from '../types/Token.js';

import { parseAttribute } from './parseAttribute.js';
import { nextToken } from './util/nextToken.js';

export const parseAttributes = <T>(
  tok: ConsumeStream<Token<T>>
): AstAttribute<T>[] => {
  const attributes: AstAttribute<T>[] = [];
  while (tok.current.kind === TokenKind.Text) {
    attributes.push(parseAttribute(tok));
    nextToken(tok);
  }
  return attributes;
}
