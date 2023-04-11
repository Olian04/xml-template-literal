import { describe, it, expect } from 'vitest';

import type { Token } from '../../../src/types/Token';
import { tokenizer } from '../../../src/tokenizer';
import { createConsumeStream } from '../../../src/parser/util/createConsumeStream';
import { mergeTemplateSegments } from '../../../src/util/mergeTemplateSegments';
import { SegmentStream } from '../../../src/types/SegmentStream';

export const t = <T>(
  staticSegments: TemplateStringsArray,
  ...dynamicSegments: T[]
) =>
  mergeTemplateSegments({
    dynamic: dynamicSegments,
    static: [...staticSegments],
  });

const echoTest = (input: SegmentStream<unknown>) => {
  const tok = tokenizer(input);
  const stream = createConsumeStream(tokenizer(input))

  const tokValues = [...tok].map((v: Token<any>) => v.value);
  const streamValues = [] as any[];
  while (!stream.done) {
    streamValues.push(stream.current.value);
    stream.next();
  }

  expect(streamValues).to.deep.equal(tokValues);
}

describe('createConsumeStream', () => {
  it('should echo correctly for input "<div></div>"', () => {
    echoTest(t`<div></div>`);
  });

  it('should echo correctly for input " pre ${A} post "', () => {
    const A = { foo: 0 };
    echoTest(t` pre ${A} post `);
  });
});
