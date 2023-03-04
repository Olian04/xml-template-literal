import type {
  AstAttribute,
  AstAttributeComposite,
} from '!types/AbstractSyntaxTree';
import type { ConsumeStream } from '!types/ConsumeStream';
import type { Token } from '!types/Token';

import { TokenKind } from '!types/Token';
import { AstKind, AttributeType } from '!types/AbstractSyntaxTree';
import { assert } from '!parser/util/assert';
import { assertSyntax } from '!parser/util/assertSyntax';
import { nextToken } from '!parser/util/nextToken';

export const parseAttributeValue = <T>(
  key: string,
  tok: ConsumeStream<Token<T>>
): AstAttribute<T> => {
  const parts: AstAttributeComposite<T>[] = [];
  let value = '';
  while (tok.current.value !== '"') {
    if (tok.current.kind === TokenKind.Data) {
      if (value.length > 0) {
        parts.push({
          kind: AstKind.Composite,
          type: AttributeType.Text,
          value: value,
        });
        value = '';
      }

      parts.push({
        kind: AstKind.Composite,
        type: AttributeType.Data,
        value: tok.current.value,
      });
    } else {
      value += tok.current.value;
    }
    nextToken(tok, false);
  }
  assertSyntax('"', tok.current);

  if (parts.length > 0) {
    parts.push({
      kind: AstKind.Composite,
      type: AttributeType.Text,
      value: value,
    });
    return {
      kind: AstKind.Attribute,
      type: AttributeType.Composite,
      key,
      value: parts,
    };
  }
  return {
    kind: AstKind.Attribute,
    type: AttributeType.Text,
    key,
    value,
  };
};

export const parseAttribute = <T>(
  tok: ConsumeStream<Token<T>>
): AstAttribute<T> => {
  assert('kind', TokenKind.Text, tok.current);
  const key = tok.current.value as string;
  nextToken(tok);
  assertSyntax('=', tok.current);
  nextToken(tok);
  if (tok.current.kind === TokenKind.Data) {
    return {
      kind: AstKind.Attribute,
      type: AttributeType.Data,
      key,
      value: tok.current.value,
    };
  }
  assertSyntax('"', tok.current);
  nextToken(tok);
  return parseAttributeValue(key, tok);
};
