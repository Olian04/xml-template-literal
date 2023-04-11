import { SegmentType, type SegmentStream } from '../types/SegmentStream.js';
import { TokenKind, type Token } from '../types/Token.js';

import { produceJoinedSyntaxTokens } from './produceJoinedSyntaxTokens.js';
import { accumulateTextTokens } from './accumulateTextTokens.js';
import { tokenizeString } from './tokenizeString.js';

export function* tokenizer<T>(segments: SegmentStream<T>): Generator<Token<T>> {
  for (const segment of segments) {
    if (segment.type === SegmentType.Static) {
      yield* produceJoinedSyntaxTokens(
        accumulateTextTokens(tokenizeString(segment.value))
      );
    } else if (segment.type === SegmentType.Dynamic) {
      yield {
        kind: TokenKind.Data,
        value: segment.value,
      };
    } else {
      throw new Error(`Unknown segment: ${segment}`);
    }
  }
  return
}
