import { TokenKind, type Token } from '../types/Token.js';
import type { AstChild } from '../types/AbstractSyntaxTree.js';
import type { ConsumeStream } from '../types/ConsumeStream.js';

import { parseChild } from './parseChild.js';

export const parseChildren = <T>(
  tok: ConsumeStream<Token<T>>
): AstChild<T>[] => {
  const children: AstChild<T>[] = [];
  while (
    tok.current.kind !== TokenKind.EndOfFile &&
    tok.current.value !== '</'
  ) {
    children.push(parseChild(tok));
  }
  return children;
}
