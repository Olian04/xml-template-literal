import { SegmentStream, SegmentType } from '!types/SegmentStream';

const isStaticSegment = (v: number) => v % 2 === 0;

export const mergeTemplateSegments = <T>(templateSegments: {
  static: string[];
  dynamic: T[];
}): SegmentStream<T> => {
  const staticLength = templateSegments.static.length;
  const dynamicLength = templateSegments.dynamic.length;
  if (staticLength - dynamicLength !== 1) {
    throw new RangeError(
      `Invalid segment lengths: Expected "static.length - dynamic.length" to equal 1 but got ${
        staticLength - dynamicLength
      }`
    );
  }
  return new Array(staticLength + dynamicLength)
    .fill(0)
    .map((_, i) => {
      if (isStaticSegment(i)) {
        return {
          type: SegmentType.Static,
          value: templateSegments.static[Math.floor(i / 2)],
        } as const;
      }
      return {
        type: SegmentType.Dynamic,
        value: templateSegments.dynamic[Math.floor(i / 2)],
      } as const;
    })
    .filter((seg) => Boolean(seg.value));
};
