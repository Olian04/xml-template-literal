import { describe, it, expect } from 'vitest';

import { mergeTemplateSegments } from '../../src/util/mergeTemplateSegments';
import { SegmentType } from '../../src/types/SegmentStream';

describe('mergeTemplateSegments', () => {
  it('should throw error when providing invalid amount of segments', () => {
    expect(() => {
      mergeTemplateSegments({
        dynamic: [],
        static: [],
      });
    }).to.throw(RangeError);

    expect(() => {
      mergeTemplateSegments({
        dynamic: [2],
        static: [],
      });
    }).to.throw(RangeError);

    expect(() => {
      mergeTemplateSegments({
        dynamic: [2],
        static: [''],
      });
    }).to.throw(RangeError);

    expect(() => {
      mergeTemplateSegments({
        dynamic: [],
        static: ['one', 'two'],
      });
    }).to.throw(RangeError);
  });

  it('should correctly merge segments', () => {
    const merged = mergeTemplateSegments({
      dynamic: [2],
      static: ['one', 'three'],
    });

    expect(merged).to.deep.equal([
      {
        type: SegmentType.Static,
        value: 'one',
      },
      {
        type: SegmentType.Dynamic,
        value: 2,
      },
      {
        type: SegmentType.Static,
        value: 'three',
      },
    ]);
  });
});
