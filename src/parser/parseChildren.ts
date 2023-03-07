import { Token, TokenKind } from "!types/Token";
import type { AstChild } from "!types/AbstractSyntaxTree";
import type { ConsumeStream } from "!types/ConsumeStream";

import { parseChild } from "!parser/parseChild";
import { nextToken } from "!parser/util/nextToken";

export const parseChildren = <T>(
  tok: ConsumeStream<Token<T>>
): AstChild<T>[] => {
  const children: AstChild<T>[] = [];
  while (
    tok.current.kind !== TokenKind.EndOfFile &&
    tok.current.value !== '</'
  ) {
    children.push(parseChild(tok));
    nextToken(tok, false);
  }
  return children;
}
