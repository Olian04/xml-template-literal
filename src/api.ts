export type {
  AstChild,
  AstAttribute,
  ChildType,
  AttributeType,
} from './types/AbstractSyntaxTree';

import type { AstChild } from './types/AbstractSyntaxTree';
import { parseTokens } from './parser';
import { tokenizer } from './tokenizer';
import { mergeTemplateSegments } from './util/mergeTemplateSegments';
import { SegmentStream } from './types/SegmentStream';

export function parseXml(xmlString: string): AstChild<never>;
export function parseXml<T>(segments: SegmentStream<T>): AstChild<T>;
export function parseXml(
  stringOrSegment: string | SegmentStream<unknown>
): AstChild<unknown> {
  if (typeof stringOrSegment === 'string') {
    return parseTokens(
      tokenizer(
        mergeTemplateSegments({
          dynamic: [],
          static: [stringOrSegment],
        })
      )
    );
  }
  return parseTokens(tokenizer(stringOrSegment));
}

export const xml = <T>(
  staticSegments: TemplateStringsArray,
  ...dynamicSegments: T[]
): AstChild<T> =>
  parseTokens(
    tokenizer(
      mergeTemplateSegments({
        dynamic: dynamicSegments,
        static: [...staticSegments],
      })
    )
  );
