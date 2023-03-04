import type { SegmentStream } from '@/types/SegmentStream';
import type { Token } from '@/types/Token';

import { SegmentType } from '@/types/SegmentStream';
import { TokenKind } from '@/types/Token';
import { produceJoinedSyntaxTokens } from '@/tokenizer/produceJoinedSyntaxTokens';
import { accumulateTextTokens } from '@/tokenizer/accumulateTextTokens';
import { tokenizeString } from '@/tokenizer/tokenizeString';

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
}
