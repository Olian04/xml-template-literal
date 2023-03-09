import type { Token } from "!types/Token";
import type { AstAttribute } from "!api";
import type { ConsumeStream } from "!types/ConsumeStream";

import { TokenKind } from "!types/Token";
import { parseAttribute } from "!parser/parseAttribute";
import { nextToken } from "!parser/util/nextToken";

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
